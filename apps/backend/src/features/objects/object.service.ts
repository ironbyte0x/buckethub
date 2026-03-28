import {
  AbortMultipartUploadRequest,
  CompleteMultipartUploadRequest,
  CopyObjectRequest,
  DeleteObjectRequest,
  GenerateShareUrlRequest,
  GetAllByBucketIdSchemaRequest,
  GetByIdSchemaRequest,
  GetDownloadUrlRequest,
  GetPreviewUrlRequest,
  GetUploadUrlRequest,
  InitiateMultipartUploadRequest,
  MoveObjectRequest,
  RenameSchemaRequest
} from '@buckethub/rpc-contract';
import { S3Storage } from '../../shared/storage';
import { BucketRepository } from '../buckets';

export class ObjectService {
  constructor(
    private readonly bucketRepository: BucketRepository,
    private readonly s3Storage: S3Storage
  ) {}

  public async *getObjectsByBucketId({ bucketId, prefix }: GetAllByBucketIdSchemaRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    for await (const chunk of this.s3Storage.getObjects(connection, prefix)) {
      yield chunk;
    }
  }

  public async getObjectByKey({ bucketId, key }: GetByIdSchemaRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    const result = await this.s3Storage.getObject(key, connection);

    return result.metadata;
  }

  public async renameObject({ bucketId, oldKey, newKey }: RenameSchemaRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    await this.s3Storage.renameObject(connection, oldKey, newKey);
  }

  public async generateShareUrl({ bucketId, key, expiresIn }: GenerateShareUrlRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    const url = await this.s3Storage.generateShareUrl(connection, key, expiresIn);

    return { url };
  }

  public async getPreviewUrl({ bucketId, key }: GetPreviewUrlRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    const url = await this.s3Storage.generatePreviewUrl(connection, key);
    const object = await this.s3Storage.getObject(key, connection);

    return { url, contentType: object.metadata.contentType };
  }

  public async getDownloadUrl({ bucketId, key }: GetDownloadUrlRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    const url = await this.s3Storage.generateDownloadUrl(connection, key);

    return { url };
  }

  public async deleteObject({ bucketId, key }: DeleteObjectRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    await this.s3Storage.deleteObject(connection, key);
  }

  public async copyObject({ bucketId, sourceKey, destinationKey }: CopyObjectRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    await this.s3Storage.copyObject(connection, sourceKey, destinationKey);
  }

  public async moveObject({ bucketId, sourceKey, destinationKey }: MoveObjectRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    await this.s3Storage.moveObject(connection, sourceKey, destinationKey);
  }

  public async getUploadUrl({ bucketId, key }: GetUploadUrlRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    const url = await this.s3Storage.presignUploadUrl(connection, key);

    return { url };
  }

  public async initiateMultipartUpload({
    bucketId,
    key,
    totalParts
  }: InitiateMultipartUploadRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);
    const uploadId = await this.s3Storage.initiateMultipartUpload(connection, key);

    if (!uploadId) {
      throw new Error('Failed to initiate multipart upload');
    }

    const presignedUrls = await this.s3Storage.generatePresignedUrls(
      connection,
      key,
      uploadId,
      totalParts
    );

    return { uploadId, presignedUrls };
  }

  public async completeMultipartUpload({
    bucketId,
    key,
    uploadId
  }: CompleteMultipartUploadRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);
    const parts = await this.s3Storage.listMultipartUploadParts(connection, key, uploadId);

    await this.s3Storage.completeMultipartUpload(connection, key, uploadId, parts);
  }

  public async abortMultipartUpload({ bucketId, key, uploadId }: AbortMultipartUploadRequest) {
    const connection = await this.bucketRepository.getBucketConnection(bucketId);

    await this.s3Storage.abortMultipartUpload(connection, key, uploadId);
  }
}
