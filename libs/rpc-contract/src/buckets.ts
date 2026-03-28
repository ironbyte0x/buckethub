import * as v from 'valibot';
import { brand } from '@buckethub/core';
import { InferContractRouterInputs, InferContractRouterOutputs, oc } from '@orpc/contract';
import { connectionIdSchema } from './connection';
import {
  AccessDeniedError,
  BucketNotFoundError,
  InvalidCredentialsError,
  ListBucketsAccessDeniedError,
  ListObjectsAccessDeniedError,
  ProviderUnreachableError
} from './errors';
import { defineErrors } from './utils';

export const bucketIdSchema = brand(v.pipe(v.string(), v.minLength(1)), 'BucketId');

export const bucketSchema = v.object({
  id: bucketIdSchema,
  connectionId: connectionIdSchema,
  name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Field is required')),
  createdAt: v.date()
});

export type Bucket = v.InferOutput<typeof bucketSchema>;
export type BucketId = Bucket['id'];

const getAll = oc.input(v.void()).output(v.array(bucketSchema));

const getBucket = oc
  .input(
    v.object({
      id: bucketIdSchema
    })
  )
  .output(bucketSchema)
  .errors(defineErrors(BucketNotFoundError));

const addBucket = oc
  .input(bucketSchema)
  .output(bucketSchema)
  .errors(
    defineErrors(
      BucketNotFoundError,
      AccessDeniedError,
      InvalidCredentialsError,
      ProviderUnreachableError
    )
  );

const listBuckets = oc
  .input(
    v.object({
      connectionId: connectionIdSchema
    })
  )
  .output(
    v.array(
      v.object({
        name: v.string(),
        arn: v.optional(v.string()),
        region: v.optional(v.string()),
        createdAt: v.optional(v.date())
      })
    )
  )
  .errors(
    defineErrors(
      AccessDeniedError,
      InvalidCredentialsError,
      ListBucketsAccessDeniedError,
      ProviderUnreachableError
    )
  );

const metricsSchema = v.object({
  totalObjects: v.pipe(v.number(), v.minValue(0)),
  totalSize: v.pipe(v.number(), v.minValue(0)),
  isComplete: v.boolean()
});

const getBucketMetrics = oc
  .input(v.object({ id: bucketIdSchema }))
  .output(metricsSchema)
  .errors(
    defineErrors(ProviderUnreachableError, BucketNotFoundError, ListObjectsAccessDeniedError)
  );

const listBucketsMetrics = oc
  .input(
    v.object({
      connectionId: connectionIdSchema,
      bucketNames: v.array(v.pipe(v.string(), v.trim(), v.minLength(1)))
    })
  )
  .output(v.record(v.string(), metricsSchema))
  .errors(defineErrors(ProviderUnreachableError));

const delete_ = oc.input(v.object({ id: bucketIdSchema })).output(v.void());

export type GetBucketRequest = InferContractRouterInputs<typeof getBucket>;
export type GetBucketResponse = InferContractRouterOutputs<typeof getBucket>;

export type GetBucketMetricsRequest = InferContractRouterInputs<typeof getBucketMetrics>;
export type GetBucketMetricsResponse = InferContractRouterOutputs<typeof getBucketMetrics>;

export type ListBucketsRequest = InferContractRouterInputs<typeof listBuckets>;
export type ListBucketsResponse = InferContractRouterOutputs<typeof listBuckets>;

export type ListBucketsMetricsRequest = InferContractRouterInputs<typeof listBucketsMetrics>;
export type ListBucketsMetricsResponse = InferContractRouterOutputs<typeof listBucketsMetrics>;

export type DeleteBucketRequest = InferContractRouterInputs<typeof delete_>;

export const buckets = {
  getAll,
  getBucket,
  getBucketMetrics,
  addBucket,
  listBuckets,
  listBucketsMetrics,
  delete: delete_
};
