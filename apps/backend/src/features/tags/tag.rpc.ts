import { UserRole } from '@buckethub/core';
import { ORPCError } from '@orpc/server';
import { Contract, os } from '../../rpc/contract';
import { authMiddleware, roleMiddleware } from '../../rpc/middleware';
import { BucketGuard } from '../buckets';
import { ConnectionGuard } from '../connections';
import { TagService } from './tag.service';

export function createTagRPCHandlers(
  tagService: TagService,
  bucketGuard: BucketGuard,
  connectionGuard: ConnectionGuard
): Contract['tags'] {
  const base = os.use(authMiddleware);
  const adminBase = base.use(roleMiddleware([UserRole.Admin]));

  const getAll = base.tags.getAll.handler(async () => {
    return tagService.getAll();
  });

  const create = adminBase.tags.create.handler(async ({ input }) => {
    return tagService.create(input);
  });

  const delete_ = adminBase.tags.delete.handler(async ({ input }) => {
    await tagService.delete(input);
  });

  const addTagToBucket = adminBase.tags.addTagToBucket.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'edit');

    return tagService.addTagToBucket(input);
  });

  const removeTagFromBucket = adminBase.tags.removeTagFromBucket.handler(
    async ({ context, input }) => {
      const mapping = await tagService.getBucketTagMapping(input.id);

      if (!mapping) {
        throw new ORPCError('NOT_FOUND', { message: 'Tag mapping not found' });
      }

      await bucketGuard.requirePermission(
        context.user.id,
        context.user.role,
        mapping.bucketId,
        'edit'
      );

      await tagService.removeTagFromBucket(input);
    }
  );

  const getTagsForBuckets = base.tags.getTagsForBuckets.handler(async ({ context }) => {
    return tagService.getTagsForBuckets(context.user.id, context.user.role);
  });

  const addTagToConnection = base.tags.addTagToConnection.handler(async ({ context, input }) => {
    await connectionGuard.requireAccess(context.user.id, context.user.role, input.connectionId);

    return tagService.addTagToConnection(input);
  });

  const removeTagFromConnection = base.tags.removeTagFromConnection.handler(
    async ({ context, input }) => {
      const mapping = await tagService.getConnectionTagMapping(input.id);

      if (!mapping) {
        throw new ORPCError('NOT_FOUND', { message: 'Tag mapping not found' });
      }

      await connectionGuard.requireAccess(context.user.id, context.user.role, mapping.connectionId);

      await tagService.removeTagFromConnection(input);
    }
  );

  const getTagsForConnections = base.tags.getTagsForConnections.handler(async ({ context }) => {
    return tagService.getTagsForConnections(context.user.id, context.user.role);
  });

  return {
    getAll,
    create,
    delete: delete_,
    addTagToBucket,
    removeTagFromBucket,
    getTagsForBuckets,
    addTagToConnection,
    removeTagFromConnection,
    getTagsForConnections
  };
}
