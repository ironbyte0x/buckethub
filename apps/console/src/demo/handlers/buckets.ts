import { Bucket, BucketId, Object } from '@buckethub/rpc-contract';
import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

function computeBucketMetrics(bucketId: BucketId) {
  const objects = demoState.objects.get(bucketId) || [];
  const files = objects.filter((object) => object.type === 'file');
  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

  return { totalObjects: files.length, totalSize, isComplete: true };
}

export const buckets: HandlerRegistry<'buckets'> = {
  getAll: async () => {
    return Array.from(demoState.buckets.values());
  },

  getBucket: async (input) => {
    const bucket = demoState.buckets.get(input.id as BucketId);

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    return bucket;
  },

  getBucketMetrics: async (input) => {
    const bucket = demoState.buckets.get(input.id as BucketId);

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    return computeBucketMetrics(input.id as BucketId);
  },

  addBucket: async (input) => {
    demoState.buckets.set(input.id as BucketId, input as Bucket);
    demoState.objects.set(input.id as BucketId, [] as Object[]);

    return input as Bucket;
  },

  listBuckets: async (input) => {
    const buckets = Array.from(demoState.buckets.values()).filter(
      (bucket) => bucket.connectionId === input.connectionId
    );

    return buckets.map((bucket) => ({
      name: bucket.name,
      createdAt: bucket.createdAt
    }));
  },

  listBucketsMetrics: async (input) => {
    const allBuckets = Array.from(demoState.buckets.values()).filter(
      (bucket) => bucket.connectionId === input.connectionId
    );

    const record: Record<string, { totalObjects: number; totalSize: number; isComplete: boolean }> =
      {};

    for (const bucket of allBuckets) {
      if (input.bucketNames.includes(bucket.name)) {
        record[bucket.name] = computeBucketMetrics(bucket.id);
      }
    }

    return record;
  },

  delete: async (input) => {
    demoState.buckets.delete(input.id as BucketId);
    demoState.objects.delete(input.id as BucketId);
  }
};
