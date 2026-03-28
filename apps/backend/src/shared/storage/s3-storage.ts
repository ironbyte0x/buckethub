import { S3Client as BunS3Client } from 'bun';
import { LRUCache } from 'lru-cache';
import mime from 'mime-types';
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CopyObjectCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  ListPartsCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
  UploadPartCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Duration } from '@buckethub/core';
import {
  AccessDeniedError,
  BucketNotFoundError,
  InvalidCredentialsError,
  ListBucketsAccessDeniedError,
  ListObjectsAccessDeniedError,
  ObjectAlreadyExistsError,
  ObjectMovePartialError,
  ObjectNotFoundError,
  ProviderUnreachableError
} from '@buckethub/rpc-contract';

export interface S3Connection {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint: string;
  region?: string | null;
}

export class S3Storage {
  private clientCache = new LRUCache<string, S3Client>({
    max: 100,
    dispose: (client) => client.destroy()
  });

  private resolveEndpoint(endpoint: string, region?: string | null): string {
    if (region && endpoint.includes('amazonaws.com')) {
      return `https://s3.${region}.amazonaws.com`;
    }

    return endpoint;
  }

  private createConnectionCacheKey(connection: S3Connection): string {
    const secretHash = Bun.hash(connection.secretAccessKey).toString(36);

    return `${connection.accessKeyId}:${connection.endpoint}:${connection.region ?? ''}:${secretHash}`;
  }

  private createS3Client(connection: S3Connection) {
    const cacheKey = this.createConnectionCacheKey(connection);
    let client = this.clientCache.get(cacheKey);

    if (client) {
      return client;
    }

    client = new S3Client({
      region: connection.region ?? 'us-east-1',
      endpoint: this.resolveEndpoint(connection.endpoint, connection.region),
      credentials: {
        accessKeyId: connection.accessKeyId,
        secretAccessKey: connection.secretAccessKey
      },
      requestHandler: {
        requestTimeout: Duration.inSeconds(6).toMilliseconds(),
        connectionTimeout: Duration.inSeconds(6).toMilliseconds(),
        throwOnRequestTimeout: true
      },
      maxAttempts: 3,
      forcePathStyle: true,
      followRegionRedirects: true
    });

    this.clientCache.set(cacheKey, client);

    return client;
  }

  public invalidateClientCache(connection: Pick<S3Connection, 'accessKeyId' | 'endpoint'>) {
    const prefix = `${connection.accessKeyId}:${connection.endpoint}:`;

    for (const [key, client] of this.clientCache) {
      if (key.startsWith(prefix)) {
        client.destroy();
        this.clientCache.delete(key);
      }
    }
  }

  public clearClientCache() {
    for (const client of this.clientCache.values()) {
      client.destroy();
    }

    this.clientCache.clear();
  }

  public async *getObjects(connection: S3Connection, prefix = '') {
    const { region, endpoint, ...s3Options } = connection;
    const s3 = new BunS3Client({
      ...s3Options,
      endpoint: this.resolveEndpoint(endpoint, region)
    });
    let continuationToken: string | undefined;
    const maxKeys = 1000;

    do {
      try {
        const response = await s3.list({
          prefix,
          delimiter: '/',
          maxKeys: maxKeys,
          continuationToken: continuationToken
        });

        // Files/objects at the current level
        const objects =
          response.contents?.map((contents) => {
            const mimeType = mime.lookup(contents.key) || undefined;

            return {
              type: 'file' as const,
              key: contents.key,
              name: contents.key.split('/').pop() ?? contents.key,
              lastModified: contents.lastModified,
              size: contents.size,
              eTag: contents.eTag,
              storageClass: contents.storageClass,
              contentType: mimeType,
              owner: contents.owner
                ? {
                    id: contents.owner.id,
                    displayName: contents.owner.displayName
                  }
                : undefined
            };
          }) ?? [];

        const folders =
          response.commonPrefixes?.map((commonPrefix) => {
            return {
              type: 'folder' as const,
              key: commonPrefix.prefix ?? '',
              name:
                commonPrefix.prefix
                  ?.substring(0, commonPrefix.prefix.length - 1)
                  .split('/')
                  .pop() ?? ''
            };
          }) ?? [];

        const items = [...folders, ...objects];

        yield items;

        continuationToken = response.nextContinuationToken;
      } catch (error) {
        if (error instanceof Error && 'code' in error) {
          if (error.name === 'S3Error') {
            switch (error.code) {
              case 'AccessDenied':
                throw new ListObjectsAccessDeniedError();
              case 'ConnectionRefused':
                throw new ProviderUnreachableError();
            }
          }

          if (error.code === 'FailedToOpenSocket') {
            throw new ProviderUnreachableError();
          }
        }

        throw error;
      }
    } while (continuationToken);
  }

  public async getObject(key: string, connection: S3Connection) {
    const s3 = this.createS3Client(connection);
    const mimeType = mime.lookup(key);

    const command = new GetObjectCommand({
      Bucket: connection.bucket,
      Key: key
    });

    let response;

    try {
      response = await s3.send(command);
    } catch (error) {
      if (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404) {
        throw new ObjectNotFoundError();
      }

      throw error;
    }

    if (!response.Body) {
      throw new ObjectNotFoundError();
    }

    return {
      stream: response.Body as ReadableStream,
      type: response.ContentType || mimeType || undefined,
      metadata: {
        type: 'file' as const,
        key: key,
        name: key.split('/').pop() ?? key,
        lastModified: response.LastModified?.toISOString(),
        size: response.ContentLength,
        eTag: response.ETag,
        storageClass: response.StorageClass,
        contentType: mimeType || response.ContentType || undefined,
        owner: undefined
      }
    };
  }

  public async presignUploadUrl(connection: S3Connection, objectKey: string) {
    const s3 = this.createS3Client(connection);

    const command = new PutObjectCommand({
      Bucket: connection.bucket,
      Key: objectKey
    });

    return await getSignedUrl(s3, command, {
      expiresIn: Duration.inHours(1).toSeconds()
    });
  }

  public async generateShareUrl(connection: S3Connection, key: string, expiresIn: number) {
    const s3 = this.createS3Client(connection);

    const command = new GetObjectCommand({
      Bucket: connection.bucket,
      Key: key
    });

    return await getSignedUrl(s3, command, {
      expiresIn
    });
  }

  public async generatePreviewUrl(connection: S3Connection, key: string) {
    const s3 = this.createS3Client(connection);

    const command = new GetObjectCommand({
      Bucket: connection.bucket,
      Key: key,
      ResponseContentDisposition: 'inline'
    });

    return await getSignedUrl(s3, command, {
      expiresIn: Duration.inHours(1).toSeconds()
    });
  }

  public async generateDownloadUrl(connection: S3Connection, key: string) {
    const s3 = this.createS3Client(connection);

    const filename = key.split('/').pop() || key;
    const safeFilename = filename.replace(/["\\\r\n]/g, '_');
    const encodedFilename = encodeURIComponent(filename);
    const command = new GetObjectCommand({
      Bucket: connection.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodedFilename}`
    });

    return await getSignedUrl(s3, command, {
      expiresIn: Duration.inHours(1).toSeconds()
    });
  }

  // Multipart upload methods for large files
  public async initiateMultipartUpload(credentials: S3Connection, objectKey: string) {
    const s3 = this.createS3Client(credentials);

    const command = new CreateMultipartUploadCommand({
      Bucket: credentials.bucket,
      Key: objectKey
    });

    const response = await s3.send(command);

    return response.UploadId;
  }

  public async generatePresignedUrls(
    credentials: S3Connection,
    objectKey: string,
    uploadId: string,
    totalParts: number
  ) {
    const s3 = this.createS3Client(credentials);
    const presignedUrls = [];

    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const command = new UploadPartCommand({
        Bucket: credentials.bucket,
        Key: objectKey,
        PartNumber: partNumber,
        UploadId: uploadId
      });

      const presignedUrl = await getSignedUrl(s3, command, {
        expiresIn: Duration.inHours(1).toSeconds()
      });

      presignedUrls.push({
        partNumber,
        presignedUrl
      });
    }

    return presignedUrls;
  }

  public async completeMultipartUpload(
    credentials: S3Connection,
    objectKey: string,
    uploadId: string,
    parts: Array<{ ETag: string; PartNumber: number }>
  ) {
    const s3 = this.createS3Client(credentials);

    const command = new CompleteMultipartUploadCommand({
      Bucket: credentials.bucket,
      Key: objectKey,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber)
      }
    });

    return await s3.send(command);
  }

  public async listMultipartUploadParts(
    credentials: S3Connection,
    objectKey: string,
    uploadId: string
  ) {
    const s3 = this.createS3Client(credentials);
    const parts: Array<{ ETag: string; PartNumber: number }> = [];
    let partNumberMarker: string | undefined;
    let isTruncated = true;

    while (isTruncated) {
      const command = new ListPartsCommand({
        Bucket: credentials.bucket,
        Key: objectKey,
        UploadId: uploadId,
        PartNumberMarker: partNumberMarker
      });

      const response = await s3.send(command);

      if (response.Parts) {
        for (const part of response.Parts) {
          if (part.ETag && part.PartNumber) {
            parts.push({ ETag: part.ETag, PartNumber: part.PartNumber });
          }
        }
      }

      isTruncated = response.IsTruncated ?? false;
      partNumberMarker = response.NextPartNumberMarker;
    }

    return parts;
  }

  public async abortMultipartUpload(
    credentials: S3Connection,
    objectKey: string,
    uploadId: string
  ) {
    const s3 = this.createS3Client(credentials);

    const command = new AbortMultipartUploadCommand({
      Bucket: credentials.bucket,
      Key: objectKey,
      UploadId: uploadId
    });

    return await s3.send(command);
  }

  public async headBucket(connection: S3Connection) {
    const s3 = this.createS3Client(connection);

    const command = new HeadBucketCommand({
      Bucket: connection.bucket
    });

    try {
      const info = await s3.send(command);

      return {
        accessPointAlias: info.AccessPointAlias,
        bucketArn: info.BucketArn,
        bucketLocationName: info.BucketLocationName,
        bucketLocationType: info.BucketLocationType,
        bucketRegion: info.BucketRegion
      };
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        ['ECONNREFUSED', 'FailedToOpenSocket'].includes(error.code as string)
      ) {
        throw new ProviderUnreachableError();
      }

      if (
        error instanceof Error &&
        '$metadata' in error &&
        (error as S3ServiceException).$metadata.httpStatusCode === 301 &&
        connection.endpoint.includes('amazonaws.com')
      ) {
        return this.headBucketWithRedirect(connection);
      }

      if (error instanceof S3ServiceException) {
        switch (error.name) {
          case 'NotFound':
            throw new BucketNotFoundError();
          case 'Forbidden':
          case 'AccessDenied':
            throw new AccessDeniedError();
          case 'InvalidAccessKeyId':
            throw new InvalidCredentialsError();
          case 'SignatureDoesNotMatch':
            throw new InvalidCredentialsError();
        }

        if (error.$metadata.httpStatusCode === 403) {
          throw new AccessDeniedError();
        }
      }

      throw error;
    }
  }

  private async headBucketWithRedirect(connection: S3Connection) {
    const client = new S3Client({
      region: connection.region ?? 'us-east-1',
      credentials: {
        accessKeyId: connection.accessKeyId,
        secretAccessKey: connection.secretAccessKey
      },
      followRegionRedirects: true
    });

    try {
      const info = await client.send(new HeadBucketCommand({ Bucket: connection.bucket }));

      return {
        accessPointAlias: info.AccessPointAlias,
        bucketArn: info.BucketArn,
        bucketLocationName: info.BucketLocationName,
        bucketLocationType: info.BucketLocationType,
        bucketRegion: info.BucketRegion
      };
    } finally {
      client.destroy();
    }
  }

  public async listBuckets(connection: S3Connection) {
    try {
      const s3 = this.createS3Client(connection);

      const command = new ListBucketsCommand();

      return await s3.send(command);
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        ['ECONNREFUSED', 'ETIMEDOUT', 'FailedToOpenSocket'].includes(error.code as string)
      ) {
        throw new ProviderUnreachableError();
      }

      if (error instanceof S3ServiceException) {
        switch (error.name) {
          case 'InvalidAccessKeyId':
          case 'SignatureDoesNotMatch':
            throw new InvalidCredentialsError();
          case 'AccessDenied':
            throw new ListBucketsAccessDeniedError();
        }
      }

      throw error;
    }
  }

  private async copyAndDeleteObject(
    connection: S3Connection,
    sourceKey: string,
    destinationKey: string
  ) {
    const s3 = this.createS3Client(connection);

    const sourceHead = await this.headObject(connection, sourceKey);
    const sourceETag = sourceHead.ETag;

    const copyCommand = new CopyObjectCommand({
      Bucket: connection.bucket,
      CopySource: `${connection.bucket}/${encodeURIComponent(sourceKey)}`,
      Key: destinationKey
    });

    await s3.send(copyCommand);

    const destinationHead = await this.headObject(connection, destinationKey);

    if (destinationHead.ETag !== sourceETag) {
      throw new Error(`Copy verification failed: ETag mismatch for "${destinationKey}"`);
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: connection.bucket,
      Key: sourceKey
    });

    try {
      await s3.send(deleteCommand);
    } catch {
      throw new ObjectMovePartialError();
    }
  }

  public async renameObject(connection: S3Connection, oldKey: string, newKey: string) {
    try {
      await this.headObject(connection, newKey);
      throw new ObjectAlreadyExistsError();
    } catch (error) {
      if (error instanceof ObjectAlreadyExistsError) {
        throw error;
      }

      if (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404) {
        // Object doesn't exist, proceed with copy
      } else {
        throw error;
      }
    }

    await this.copyAndDeleteObject(connection, oldKey, newKey);
  }

  public async deleteObject(connection: S3Connection, key: string) {
    try {
      const s3 = this.createS3Client(connection);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: connection.bucket,
        Key: key
      });

      await s3.send(deleteCommand);
    } catch (error) {
      if (error instanceof S3ServiceException) {
        switch (error.name) {
          case 'AccessDenied': {
            throw new AccessDeniedError();
          }
        }
      }

      throw error;
    }
  }

  private headObject(connection: S3Connection, key: string) {
    const s3 = this.createS3Client(connection);

    const headCommand = new HeadObjectCommand({
      Bucket: connection.bucket,
      Key: key
    });

    return s3.send(headCommand);
  }

  public async copyObject(connection: S3Connection, sourceKey: string, destinationKey: string) {
    const s3 = this.createS3Client(connection);

    try {
      await this.headObject(connection, destinationKey);
      throw new ObjectAlreadyExistsError();
    } catch (error) {
      if (error instanceof ObjectAlreadyExistsError) {
        throw error;
      }

      if (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404) {
        // Object doesn't exist, proceed with copy
      } else {
        throw error;
      }
    }

    const copyCommand = new CopyObjectCommand({
      Bucket: connection.bucket,
      CopySource: `${connection.bucket}/${encodeURIComponent(sourceKey)}`,
      Key: destinationKey
    });

    await s3.send(copyCommand);
  }

  public async moveObject(connection: S3Connection, sourceKey: string, destinationKey: string) {
    try {
      await this.headObject(connection, destinationKey);
      throw new ObjectAlreadyExistsError();
    } catch (error) {
      if (error instanceof ObjectAlreadyExistsError) {
        throw error;
      }

      if (error instanceof S3ServiceException && error.$metadata.httpStatusCode === 404) {
        // Object doesn't exist, proceed with move
      } else {
        throw error;
      }
    }

    await this.copyAndDeleteObject(connection, sourceKey, destinationKey);
  }
}
