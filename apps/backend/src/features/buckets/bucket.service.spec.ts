import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProviderType, UserRole } from '@buckethub/core';
import { BucketId, ConnectionId, Object as S3Object } from '@buckethub/rpc-contract';
import { createMockClass } from '@buckethub/test';
import { S3Storage } from '../../shared/storage';
import { ConnectionRepository } from '../connections';
import { PermissionService } from '../permissions';
import { BucketRepository } from './bucket.repository';
import { BucketService } from './bucket.service';

function createMockBucketRepository() {
  return createMockClass<BucketRepository>();
}

function createMockConnectionRepository() {
  return createMockClass<ConnectionRepository>();
}

function createMockS3Storage() {
  return createMockClass<S3Storage>();
}

function createMockPermissionService() {
  return createMockClass<PermissionService>();
}

function makeObjectsGenerator(chunks: S3Object[][]): ReturnType<S3Storage['getObjects']> {
  async function* generator() {
    for (const chunk of chunks) {
      yield chunk;
    }
  }

  return generator() as ReturnType<S3Storage['getObjects']>;
}

describe('BucketService', () => {
  let bucketService: BucketService;
  let bucketRepository: ReturnType<typeof createMockBucketRepository>;
  let connectionRepository: ReturnType<typeof createMockConnectionRepository>;
  let s3: ReturnType<typeof createMockS3Storage>;
  let permissionService: ReturnType<typeof createMockPermissionService>;

  beforeEach(() => {
    bucketRepository = createMockBucketRepository();
    connectionRepository = createMockConnectionRepository();
    s3 = createMockS3Storage();
    permissionService = createMockPermissionService();

    bucketService = new BucketService(
      bucketRepository,
      connectionRepository,
      s3,
      permissionService
    );
  });

  describe('getAllBuckets', () => {
    it('admin returns only buckets on admin-created connections', async () => {
      const buckets = [
        {
          id: 'b1' as BucketId,
          connectionId: 'conn-1' as ConnectionId,
          name: 'bucket-1',
          createdAt: new Date()
        },
        {
          id: 'b2' as BucketId,
          connectionId: 'conn-2' as ConnectionId,
          name: 'bucket-2',
          createdAt: new Date()
        }
      ];

      bucketRepository.getAllBuckets.mockResolvedValue(buckets);

      connectionRepository.getByAdminCreators.mockResolvedValue([
        {
          id: 'conn-1' as ConnectionId,
          providerType: ProviderType.AmazonS3,
          label: 'Admin Connection',
          endpoint: 'https://s3.example.com',
          createdBy: 'admin-1'
        }
      ]);

      const result = await bucketService.getAllBuckets('user-1', UserRole.Admin);

      expect(result).toEqual([buckets[0]]);
      expect(permissionService.getByUser).not.toHaveBeenCalled();
    });

    it('regular user returns only permission-matched buckets', async () => {
      const buckets = [
        {
          id: 'b1' as BucketId,
          connectionId: 'conn-1' as ConnectionId,
          name: 'bucket-1',
          createdAt: new Date()
        },
        {
          id: 'b2' as BucketId,
          connectionId: 'conn-1' as ConnectionId,
          name: 'bucket-2',
          createdAt: new Date()
        },
        {
          id: 'b3' as BucketId,
          connectionId: 'conn-1' as ConnectionId,
          name: 'bucket-3',
          createdAt: new Date()
        }
      ];

      bucketRepository.getAllBuckets.mockResolvedValue(buckets);

      permissionService.getByUser.mockResolvedValue([
        {
          userId: 'user-1',
          userName: 'User',
          userEmail: 'user@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'bucket-1',
          permissions: []
        },
        {
          userId: 'user-1',
          userName: 'User',
          userEmail: 'user@test.com',
          bucketId: 'b3' as BucketId,
          bucketName: 'bucket-3',
          permissions: []
        }
      ]);

      const result = await bucketService.getAllBuckets('user-1', UserRole.User);

      expect(result).toHaveLength(2);
      expect(result.map((bucket) => bucket.id)).toEqual(['b1', 'b3']);
    });

    it('user with no permissions gets empty array', async () => {
      bucketRepository.getAllBuckets.mockResolvedValue([
        {
          id: 'b1' as BucketId,
          connectionId: 'conn-1' as ConnectionId,
          name: 'bucket-1',
          createdAt: new Date()
        }
      ]);

      permissionService.getByUser.mockResolvedValue([]);

      const result = await bucketService.getAllBuckets('user-1', UserRole.User);

      expect(result).toEqual([]);
    });
  });

  describe('getObjectsInfo', () => {
    const connection = {
      accessKeyId: 'key',
      secretAccessKey: 'secret',
      bucket: 'my-bucket',
      endpoint: 'https://s3.example.com'
    };

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns { count: 0, size: 0 } for empty bucket', async () => {
      s3.getObjects.mockImplementation(() => makeObjectsGenerator([[]]));

      const result = await bucketService.getObjectsInfo(connection);

      expect(result).toEqual({ count: 0, size: 0, isComplete: true });
    });

    it('counts files and sums sizes from flat listing', async () => {
      s3.getObjects.mockImplementation(() =>
        makeObjectsGenerator([
          [
            { type: 'file', key: 'a.txt', name: 'a.txt', size: 100 },
            { type: 'file', key: 'b.txt', name: 'b.txt', size: 200 },
            { type: 'file', key: 'c.txt', name: 'c.txt', size: 50 }
          ]
        ])
      );

      const result = await bucketService.getObjectsInfo(connection);

      expect(result).toEqual({ count: 3, size: 350, isComplete: true });
    });

    it('recurses into folders', async () => {
      s3.getObjects
        .mockImplementationOnce(() =>
          makeObjectsGenerator([[{ type: 'folder', key: 'dir/', name: 'dir' }]])
        )
        .mockImplementationOnce(() =>
          makeObjectsGenerator([
            [{ type: 'file', key: 'dir/file.txt', name: 'file.txt', size: 42 }]
          ])
        );

      const result = await bucketService.getObjectsInfo(connection);

      expect(result).toEqual({ count: 1, size: 42, isComplete: true });
    });

    it('stops traversal after timeout', async () => {
      vi.useFakeTimers();

      let callCount = 0;

      s3.getObjects.mockImplementation(() => {
        callCount++;

        if (callCount > 2) {
          vi.advanceTimersByTime(10_000);
        }

        return makeObjectsGenerator([
          [{ type: 'folder', key: `dir-${callCount}/`, name: `dir-${callCount}` }]
        ]);
      });

      const result = await bucketService.getObjectsInfo(connection);

      expect(result.count).toBe(0);
      expect(result.isComplete).toBe(false);
      expect(s3.getObjects).toHaveBeenCalledTimes(3);
    });
  });

  describe('listBucketsMetrics', () => {
    it('returns metrics for fulfilled promises, skips rejected ones', async () => {
      const connection = {
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        endpoint: 'https://s3.example.com',
        accountId: null,
        createdBy: 'user-1',
        createdAt: new Date()
      };

      connectionRepository.getById.mockResolvedValue(connection);

      s3.headBucket
        .mockResolvedValueOnce({
          accessPointAlias: undefined,
          bucketArn: undefined,
          bucketLocationName: undefined,
          bucketLocationType: undefined,
          bucketRegion: 'us-east-1'
        })
        .mockRejectedValueOnce(new Error('Access denied'));

      s3.getObjects.mockImplementation(() =>
        makeObjectsGenerator([[{ type: 'file', key: 'file.txt', name: 'file.txt', size: 500 }]])
      );

      const result = await bucketService.listBucketsMetrics({
        connectionId: 'conn-1' as ConnectionId,
        bucketNames: ['bucket-ok', 'bucket-fail']
      });

      expect(Object.keys(result)).toEqual(['bucket-ok']);
      expect(result['bucket-ok']).toEqual({ totalObjects: 1, totalSize: 500, isComplete: true });
    });

    it('returns empty record when all promises fail', async () => {
      connectionRepository.getById.mockResolvedValue({
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        endpoint: 'https://s3.example.com',
        createdBy: 'user-1',
        createdAt: new Date()
      });

      s3.headBucket.mockRejectedValue(new Error('Error'));

      const result = await bucketService.listBucketsMetrics({
        connectionId: 'conn-1' as ConnectionId,
        bucketNames: ['bucket-1', 'bucket-2']
      });

      expect(result).toEqual({});
    });
  });

  describe('addBucket', () => {
    it('calls headBucket, creates bucket, grants full permissions', async () => {
      const bucketData = {
        id: 'b1' as BucketId,
        name: 'my-bucket',
        connectionId: 'conn-1' as ConnectionId,
        createdAt: new Date()
      };
      const connection = {
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        endpoint: 'https://s3.example.com',
        accountId: null,
        createdBy: 'user-1',
        createdAt: new Date()
      };
      const createdBucket = {
        id: 'b1' as BucketId,
        name: 'my-bucket',
        connectionId: 'conn-1' as ConnectionId,
        region: 'eu-west-1',
        createdAt: new Date()
      };

      connectionRepository.getById.mockResolvedValue(connection);

      s3.headBucket.mockResolvedValue({
        accessPointAlias: undefined,
        bucketArn: undefined,
        bucketLocationName: undefined,
        bucketLocationType: undefined,
        bucketRegion: 'eu-west-1'
      });

      bucketRepository.createBucket.mockResolvedValue(createdBucket);

      const result = await bucketService.addBucket(bucketData, 'user-1');

      expect(s3.headBucket).toHaveBeenCalledWith(expect.objectContaining({ bucket: 'my-bucket' }));

      expect(bucketRepository.createBucket).toHaveBeenCalledWith(
        expect.objectContaining({ region: 'eu-west-1' })
      );

      expect(permissionService.grantFullPermissions).toHaveBeenCalledWith('b1', 'user-1');
      expect(result).toEqual(createdBucket);
    });
  });

  describe('listBuckets', () => {
    it('maps S3 response correctly', async () => {
      connectionRepository.getById.mockResolvedValue({
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        endpoint: 'https://s3.example.com',
        createdBy: 'user-1',
        createdAt: new Date()
      });

      s3.listBuckets.mockResolvedValue({
        $metadata: {},
        Buckets: [
          {
            Name: 'bucket-1',
            BucketArn: 'arn:1',
            BucketRegion: 'us-east-1',
            CreationDate: new Date('2024-01-01')
          }
        ]
      });

      const result = await bucketService.listBuckets({ connectionId: 'conn-1' as ConnectionId });

      expect(result).toEqual([
        { name: 'bucket-1', arn: 'arn:1', region: 'us-east-1', createdAt: new Date('2024-01-01') }
      ]);
    });

    it('returns empty array when Buckets is undefined', async () => {
      connectionRepository.getById.mockResolvedValue({
        id: 'conn-1' as ConnectionId,
        providerType: ProviderType.AmazonS3,
        label: 'Test',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        endpoint: 'https://s3.example.com',
        createdBy: 'user-1',
        createdAt: new Date()
      });

      s3.listBuckets.mockResolvedValue({ $metadata: {} });

      const result = await bucketService.listBuckets({ connectionId: 'conn-1' as ConnectionId });

      expect(result).toEqual([]);
    });
  });
});
