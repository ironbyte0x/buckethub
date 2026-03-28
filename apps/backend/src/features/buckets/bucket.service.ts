import { Duration, UserRole } from '@buckethub/core';
import { Bucket, BucketId, ConnectionId, ListBucketsRequest } from '@buckethub/rpc-contract';
import { ORPCError } from '@orpc/server';
import { S3Connection, S3Storage } from '../../shared/storage';
import { ConnectionRepository } from '../connections';
import { PermissionService } from '../permissions';
import { BucketRepository } from './bucket.repository';

export class BucketService {
  constructor(
    private readonly bucketRepository: BucketRepository,
    private readonly connectionRepository: ConnectionRepository,
    private readonly s3Storage: S3Storage,
    private readonly permissionService: PermissionService
  ) {}

  public async getAllBuckets(userId: string, role: UserRole) {
    const allBuckets = await this.bucketRepository.getAllBuckets();

    if (role === UserRole.Admin) {
      const adminConnections = await this.connectionRepository.getByAdminCreators();
      const adminConnectionIds = new Set(adminConnections.map((connection) => connection.id));

      return allBuckets.filter((bucket) => adminConnectionIds.has(bucket.connectionId));
    }

    const userPermissions = await this.permissionService.getByUser(userId);
    const allowedBucketIds = new Set(userPermissions.map((permission) => permission.bucketId));

    return allBuckets.filter((bucket) => allowedBucketIds.has(bucket.id));
  }

  public async getBucket(data: { id: BucketId }) {
    return this.bucketRepository.getBucketById(data.id);
  }

  public async getBucketMetrics(data: { id: BucketId }) {
    const connection = await this.bucketRepository.getBucketConnection(data.id);
    const objectsInfo = await this.getObjectsInfo(connection);

    return {
      totalObjects: objectsInfo.count,
      totalSize: objectsInfo.size,
      isComplete: objectsInfo.isComplete
    };
  }

  public async listBucketsMetrics(data: { connectionId: ConnectionId; bucketNames: string[] }) {
    const connection = await this.connectionRepository.getById(data.connectionId);

    if (!connection) {
      throw new ORPCError('NOT_FOUND', { message: 'Connection not found' });
    }

    const results = await Promise.allSettled(
      data.bucketNames.map(async (name) => {
        const bucketInfo = await this.s3Storage.headBucket({
          ...connection,
          bucket: name
        });

        const info = await this.getObjectsInfo({
          ...connection,
          bucket: name,
          region: bucketInfo.bucketRegion
        });

        return {
          name,
          totalObjects: info.count,
          totalSize: info.size,
          isComplete: info.isComplete
        };
      })
    );

    const record: Record<string, { totalObjects: number; totalSize: number; isComplete: boolean }> =
      {};

    for (const result of results) {
      if (result.status === 'fulfilled') {
        record[result.value.name] = {
          totalObjects: result.value.totalObjects,
          totalSize: result.value.totalSize,
          isComplete: result.value.isComplete
        };
      }
    }

    return record;
  }

  public async getObjectsInfo(connection: S3Connection) {
    const MAX_CONCURRENT = 5;
    const timeout = Duration.inSeconds(10);

    const startTime = Date.now();
    let count = 0;
    let size = 0;
    let timedOut = false;

    const traverse = async (prefix?: string): Promise<void> => {
      if (timedOut) {
        return;
      }

      const pending = new Set<Promise<void>>();

      for await (const chunk of this.s3Storage.getObjects(connection, prefix)) {
        if (timedOut || Date.now() - startTime >= timeout.toMilliseconds()) {
          timedOut = true;
          break;
        }

        for (const object of chunk) {
          if (timedOut) {
            break;
          }

          if (object.type === 'file') {
            count += 1;
            size += object.size ?? 0;

            if (Date.now() - startTime >= timeout.toMilliseconds()) {
              timedOut = true;
              break;
            }
          } else {
            if (pending.size >= MAX_CONCURRENT) {
              await Promise.race(pending);
            }

            if (Date.now() - startTime >= timeout.toMilliseconds()) {
              timedOut = true;
              break;
            }

            const promise = traverse(object.key).then(() => {
              pending.delete(promise);
            });

            pending.add(promise);
          }
        }
      }

      await Promise.all(pending);
    };

    await traverse();

    return { count, size, isComplete: !timedOut };
  }

  public async addBucket(data: Bucket, userId: string) {
    const connection = await this.connectionRepository.getById(data.connectionId);

    if (!connection) {
      throw new ORPCError('NOT_FOUND', { message: 'Connection not found' });
    }

    const info = await this.s3Storage.headBucket({
      accessKeyId: connection.accessKeyId,
      secretAccessKey: connection.secretAccessKey,
      endpoint: connection.endpoint,
      bucket: data.name
    });

    const bucket = await this.bucketRepository.createBucket({
      ...data,
      region: info.bucketRegion ?? null
    });

    await this.permissionService.grantFullPermissions(bucket.id, userId);

    return bucket;
  }

  public async listBuckets(data: ListBucketsRequest) {
    const connection = await this.connectionRepository.getById(data.connectionId);

    if (!connection) {
      throw new ORPCError('NOT_FOUND', { message: 'Connection not found' });
    }

    const response = await this.s3Storage.listBuckets({
      accessKeyId: connection.accessKeyId,
      secretAccessKey: connection.secretAccessKey,
      endpoint: connection.endpoint,
      bucket: ''
    });

    return (
      response.Buckets?.map((bucket) => ({
        name: bucket.Name ?? '',
        arn: bucket.BucketArn,
        region: bucket.BucketRegion,
        createdAt: bucket.CreationDate
      })) ?? []
    );
  }

  public async deleteBucket(data: { id: BucketId }) {
    await this.bucketRepository.deleteBucket(data.id);
  }
}
