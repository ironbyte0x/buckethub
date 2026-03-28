import { Contract, os } from '../../rpc/contract';
import { authMiddleware } from '../../rpc/middleware';
import { ConnectionGuard } from '../connections';
import { BucketGuard } from './bucket.guard';
import { BucketService } from './bucket.service';

export function createBucketRPCHandlers(
  bucketService: BucketService,
  bucketGuard: BucketGuard,
  connectionGuard: ConnectionGuard
): Contract['buckets'] {
  const base = os.use(authMiddleware);

  const getAll = base.buckets.getAll.handler(async ({ context }) => {
    return bucketService.getAllBuckets(context.user.id, context.user.role);
  });

  const getBucket = base.buckets.getBucket.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.id, 'view');

    return bucketService.getBucket(input);
  });

  const addBucket = base.buckets.addBucket.handler(async ({ context, input }) => {
    await connectionGuard.requireAccess(context.user.id, context.user.role, input.connectionId);

    return bucketService.addBucket(input, context.user.id);
  });

  const listBuckets = base.buckets.listBuckets.handler(async ({ context, input }) => {
    await connectionGuard.requireAccess(context.user.id, context.user.role, input.connectionId);

    return bucketService.listBuckets(input);
  });

  const getBucketMetrics = base.buckets.getBucketMetrics.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.id, 'view');

    return bucketService.getBucketMetrics(input);
  });

  const listBucketsMetrics = base.buckets.listBucketsMetrics.handler(async ({ context, input }) => {
    await connectionGuard.requireAccess(context.user.id, context.user.role, input.connectionId);

    return bucketService.listBucketsMetrics(input);
  });

  const delete_ = base.buckets.delete.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.id, 'delete');

    await bucketService.deleteBucket(input);
  });

  return {
    getAll,
    getBucket,
    getBucketMetrics,
    addBucket,
    listBuckets,
    listBucketsMetrics,
    delete: delete_
  };
}
