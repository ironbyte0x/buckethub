import { beforeEach, describe, expect, it } from 'vitest';
import { BucketId, Object as S3Object } from '@buckethub/rpc-contract';
import { createMockClass } from '@buckethub/test';
import { S3Connection, S3Storage } from '../../shared/storage';
import { BucketRepository } from '../buckets';
import { ObjectService } from './object.service';

function createMockBucketRepository() {
  return createMockClass<BucketRepository>();
}

function createMockS3Storage() {
  return createMockClass<S3Storage>();
}

function makeObjectsGenerator(chunks: S3Object[][]): ReturnType<S3Storage['getObjects']> {
  async function* generator() {
    for (const chunk of chunks) {
      yield chunk;
    }
  }

  return generator() as ReturnType<S3Storage['getObjects']>;
}

const mockConnection: S3Connection & { region: string | null } = {
  accessKeyId: 'key',
  secretAccessKey: 'secret',
  endpoint: 'https://s3.example.com',
  bucket: 'bucket',
  region: 'us-east-1'
};

describe('ObjectService', () => {
  let objectService: ObjectService;
  let bucketRepository: ReturnType<typeof createMockBucketRepository>;
  let s3: ReturnType<typeof createMockS3Storage>;

  beforeEach(() => {
    bucketRepository = createMockBucketRepository();
    s3 = createMockS3Storage();
    objectService = new ObjectService(bucketRepository, s3);
    bucketRepository.getBucketConnection.mockResolvedValue(mockConnection);
  });

  describe('getObjectsByBucketId', () => {
    it('yields chunks from S3', async () => {
      const chunk1 = [{ type: 'file' as const, key: 'a.txt', name: 'a.txt', size: 10 }];
      const chunk2 = [{ type: 'file' as const, key: 'b.txt', name: 'b.txt', size: 20 }];

      s3.getObjects.mockImplementation(() => makeObjectsGenerator([chunk1, chunk2]));

      const received: S3Object[][] = [];

      for await (const chunk of objectService.getObjectsByBucketId({
        bucketId: 'b1' as BucketId,
        prefix: ''
      })) {
        received.push(chunk);
      }

      expect(received).toEqual([chunk1, chunk2]);
    });
  });

  describe('initiateMultipartUpload', () => {
    it('returns uploadId and presignedUrls', async () => {
      const presignedUrls = [{ partNumber: 1, presignedUrl: 'https://url.com/1' }];

      s3.initiateMultipartUpload.mockResolvedValue('upload-id-123');
      s3.generatePresignedUrls.mockResolvedValue(presignedUrls);

      const result = await objectService.initiateMultipartUpload({
        bucketId: 'b1' as BucketId,
        key: 'large-file.bin',
        totalParts: 1
      });

      expect(result).toEqual({ uploadId: 'upload-id-123', presignedUrls });
    });

    it('throws when upload ID is falsy', async () => {
      // @ts-expect-error - simulating a failure case where initiateMultipartUpload returns a falsy value
      s3.initiateMultipartUpload.mockResolvedValue();

      await expect(
        objectService.initiateMultipartUpload({
          bucketId: 'b1' as BucketId,
          key: 'file.bin',
          totalParts: 1
        })
      ).rejects.toThrow('Failed to initiate multipart upload');
    });
  });

  describe('completeMultipartUpload', () => {
    it('lists parts then completes', async () => {
      const parts = [{ ETag: 'etag1', PartNumber: 1 }];

      s3.listMultipartUploadParts.mockResolvedValue(parts);

      await objectService.completeMultipartUpload({
        bucketId: 'b1' as BucketId,
        key: 'file.bin',
        uploadId: 'upload-id-123'
      });

      expect(s3.listMultipartUploadParts).toHaveBeenCalledWith(
        mockConnection,
        'file.bin',
        'upload-id-123'
      );

      expect(s3.completeMultipartUpload).toHaveBeenCalledWith(
        mockConnection,
        'file.bin',
        'upload-id-123',
        parts
      );
    });
  });

  describe('delegation methods', () => {
    it('renameObject delegates to s3Storage', async () => {
      await objectService.renameObject({
        bucketId: 'b1' as BucketId,
        oldKey: 'old.txt',
        newKey: 'new.txt'
      });

      expect(s3.renameObject).toHaveBeenCalledWith(mockConnection, 'old.txt', 'new.txt');
    });

    it('copyObject delegates to s3Storage', async () => {
      await objectService.copyObject({
        bucketId: 'b1' as BucketId,
        sourceKey: 'src.txt',
        destinationKey: 'dst.txt'
      });

      expect(s3.copyObject).toHaveBeenCalledWith(mockConnection, 'src.txt', 'dst.txt');
    });

    it('moveObject delegates to s3Storage', async () => {
      await objectService.moveObject({
        bucketId: 'b1' as BucketId,
        sourceKey: 'src.txt',
        destinationKey: 'dst.txt'
      });

      expect(s3.moveObject).toHaveBeenCalledWith(mockConnection, 'src.txt', 'dst.txt');
    });

    it('deleteObject delegates to s3Storage', async () => {
      await objectService.deleteObject({ bucketId: 'b1' as BucketId, key: 'file.txt' });

      expect(s3.deleteObject).toHaveBeenCalledWith(mockConnection, 'file.txt');
    });
  });
});
