import * as v from 'valibot';
import { eventIterator, oc } from '@orpc/contract';
import { bucketIdSchema } from './buckets';
import {
  AccessDeniedError,
  BucketNotFoundError,
  ListObjectsAccessDeniedError,
  ObjectMovePartialError,
  ObjectNotFoundError,
  ProviderUnreachableError
} from './errors';
import { defineErrors } from './utils';

const fileSchema = v.object({
  type: v.literal('file'),
  key: v.string(),
  name: v.string(),
  lastModified: v.optional(v.string()),
  size: v.optional(v.pipe(v.number(), v.minValue(0))),
  eTag: v.optional(v.string()),
  storageClass: v.optional(v.string()),
  contentType: v.optional(v.string()),
  owner: v.optional(
    v.object({
      id: v.optional(v.string()),
      displayName: v.optional(v.string())
    })
  )
});

export type FileObject = v.InferOutput<typeof fileSchema>;

const folderSchema = v.object({
  type: v.literal('folder'),
  key: v.string(),
  name: v.string()
});

const objectSchema = v.variant('type', [fileSchema, folderSchema]);

export type Object = v.InferOutput<typeof objectSchema>;

const keySchema = v.pipe(
  v.string(),
  v.minLength(1),
  v.check(
    (value) => !value.includes('..'),
    'Key cannot contain ".." to prevent directory traversal attacks'
  ),
  v.rawCheck(({ dataset, addIssue }) => {
    if (typeof dataset.value === 'string') {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder('utf-8');
      const encoded = encoder.encode(dataset.value);

      const isValidUtf8 = decoder.decode(encoded) === dataset.value;

      if (!isValidUtf8) {
        addIssue({
          message: 'Key must be valid UTF-8'
        });
      }

      if (encoded.length > 1024) {
        addIssue({
          message: 'Key must be at most 1024 bytes long'
        });
      }
    }
  })
);

const prefixSchema = v.union([keySchema, v.literal('')]);

const getAllByBucketIdSchema = v.object({
  bucketId: bucketIdSchema,
  prefix: prefixSchema
});

export type GetAllByBucketIdSchemaRequest = v.InferOutput<typeof getAllByBucketIdSchema>;

const getAllByBucketId = oc
  .input(getAllByBucketIdSchema)
  .output(eventIterator(v.array(objectSchema)))
  .errors(
    defineErrors(ProviderUnreachableError, BucketNotFoundError, ListObjectsAccessDeniedError)
  );

const getByIdSchema = v.object({
  bucketId: bucketIdSchema,
  key: keySchema
});

export type GetByIdSchemaRequest = v.InferOutput<typeof getByIdSchema>;

const getById = oc
  .input(getByIdSchema)
  .output(v.optional(fileSchema))
  .errors(
    defineErrors(
      ProviderUnreachableError,
      BucketNotFoundError,
      ObjectNotFoundError,
      ListObjectsAccessDeniedError
    )
  );

const renameSchema = v.object({
  bucketId: bucketIdSchema,
  oldKey: keySchema,
  newKey: keySchema
});

export type RenameSchemaRequest = v.InferOutput<typeof renameSchema>;

const rename = oc
  .input(renameSchema)
  .output(v.void())
  .errors(defineErrors(BucketNotFoundError, ObjectMovePartialError));

const generateShareUrlSchema = v.object({
  bucketId: bucketIdSchema,
  key: keySchema,
  expiresIn: v.optional(v.pipe(v.number(), v.minValue(60), v.maxValue(604800)), 3600)
});

export type GenerateShareUrlRequest = v.InferOutput<typeof generateShareUrlSchema>;

const generateShareUrl = oc
  .input(generateShareUrlSchema)
  .output(v.object({ url: v.string() }))
  .errors(defineErrors(BucketNotFoundError));

const getPreviewUrlSchema = v.object({
  bucketId: bucketIdSchema,
  key: keySchema
});

export type GetPreviewUrlRequest = v.InferOutput<typeof getPreviewUrlSchema>;

const getPreviewUrl = oc
  .input(getPreviewUrlSchema)
  .output(v.object({ url: v.string(), contentType: v.optional(v.string()) }))
  .errors(defineErrors(BucketNotFoundError, ObjectNotFoundError));

const getDownloadUrlSchema = v.object({
  bucketId: bucketIdSchema,
  key: keySchema
});

export type GetDownloadUrlRequest = v.InferOutput<typeof getDownloadUrlSchema>;

const getDownloadUrl = oc
  .input(getDownloadUrlSchema)
  .output(v.object({ url: v.string() }))
  .errors(defineErrors(BucketNotFoundError));

const deleteObjectSchema = v.object({
  bucketId: bucketIdSchema,
  key: keySchema
});

export type DeleteObjectRequest = v.InferOutput<typeof deleteObjectSchema>;

const deleteObject = oc
  .input(deleteObjectSchema)
  .output(v.void())
  .errors(defineErrors(AccessDeniedError, BucketNotFoundError));

const copyObjectSchema = v.object({
  bucketId: bucketIdSchema,
  sourceKey: keySchema,
  destinationKey: keySchema
});

export type CopyObjectRequest = v.InferOutput<typeof copyObjectSchema>;

const copyObject = oc
  .input(copyObjectSchema)
  .output(v.void())
  .errors(defineErrors(BucketNotFoundError));

const moveObjectSchema = v.object({
  bucketId: bucketIdSchema,
  sourceKey: keySchema,
  destinationKey: keySchema
});

export type MoveObjectRequest = v.InferOutput<typeof moveObjectSchema>;

const moveObject = oc
  .input(moveObjectSchema)
  .output(v.void())
  .errors(defineErrors(BucketNotFoundError, ObjectMovePartialError));

const getUploadUrlSchema = v.object({
  bucketId: bucketIdSchema,
  key: keySchema
});

export type GetUploadUrlRequest = v.InferOutput<typeof getUploadUrlSchema>;

const getUploadUrl = oc
  .input(getUploadUrlSchema)
  .output(v.object({ url: v.string() }))
  .errors(defineErrors(BucketNotFoundError));

const initiateMultipartUploadSchema = v.object({
  bucketId: bucketIdSchema,
  key: keySchema,
  totalParts: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(10_000))
});

export type InitiateMultipartUploadRequest = v.InferOutput<typeof initiateMultipartUploadSchema>;

const initiateMultipartUpload = oc
  .input(initiateMultipartUploadSchema)
  .output(
    v.object({
      uploadId: v.string(),
      presignedUrls: v.array(
        v.object({
          partNumber: v.number(),
          presignedUrl: v.string()
        })
      )
    })
  )
  .errors(defineErrors(BucketNotFoundError));

const completeMultipartUploadSchema = v.object({
  bucketId: bucketIdSchema,
  key: keySchema,
  uploadId: v.string()
});

export type CompleteMultipartUploadRequest = v.InferOutput<typeof completeMultipartUploadSchema>;

const completeMultipartUpload = oc
  .input(completeMultipartUploadSchema)
  .output(v.void())
  .errors(defineErrors(BucketNotFoundError));

const abortMultipartUploadSchema = v.object({
  bucketId: bucketIdSchema,
  key: keySchema,
  uploadId: v.string()
});

export type AbortMultipartUploadRequest = v.InferOutput<typeof abortMultipartUploadSchema>;

const abortMultipartUpload = oc
  .input(abortMultipartUploadSchema)
  .output(v.void())
  .errors(defineErrors(BucketNotFoundError));

export const objects = {
  getAllByBucketId,
  getById,
  rename,
  generateShareUrl,
  getPreviewUrl,
  getDownloadUrl,
  deleteObject,
  copyObject,
  moveObject,
  getUploadUrl,
  initiateMultipartUpload,
  completeMultipartUpload,
  abortMultipartUpload
};
