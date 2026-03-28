import { Contract, os } from '../../rpc/contract';
import { authMiddleware } from '../../rpc/middleware/auth';
import { BucketGuard } from '../buckets';
import { ObjectService } from './object.service';

export function createObjectRPCHandlers(
  objectService: ObjectService,
  bucketGuard: BucketGuard
): Contract['objects'] {
  const base = os.use(authMiddleware);

  const getAllByBucketId = base.objects.getAllByBucketId.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'view');

    return objectService.getObjectsByBucketId(input);
  });

  const getById = base.objects.getById.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'view');

    return await objectService.getObjectByKey(input);
  });

  const rename = base.objects.rename.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'edit');

    return await objectService.renameObject(input);
  });

  const generateShareUrl = base.objects.generateShareUrl.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'view');

    return await objectService.generateShareUrl(input);
  });

  const getPreviewUrl = base.objects.getPreviewUrl.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'view');

    return await objectService.getPreviewUrl(input);
  });

  const getDownloadUrl = base.objects.getDownloadUrl.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'view');

    return await objectService.getDownloadUrl(input);
  });

  const deleteObject = base.objects.deleteObject.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(
      context.user.id,
      context.user.role,
      input.bucketId,
      'delete'
    );

    return await objectService.deleteObject(input);
  });

  const copyObject = base.objects.copyObject.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'edit');

    return await objectService.copyObject(input);
  });

  const moveObject = base.objects.moveObject.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'edit');

    return await objectService.moveObject(input);
  });

  const getUploadUrl = base.objects.getUploadUrl.handler(async ({ context, input }) => {
    await bucketGuard.requirePermission(context.user.id, context.user.role, input.bucketId, 'edit');

    return await objectService.getUploadUrl(input);
  });

  const initiateMultipartUpload = base.objects.initiateMultipartUpload.handler(
    async ({ context, input }) => {
      await bucketGuard.requirePermission(
        context.user.id,
        context.user.role,
        input.bucketId,
        'edit'
      );

      return await objectService.initiateMultipartUpload(input);
    }
  );

  const completeMultipartUpload = base.objects.completeMultipartUpload.handler(
    async ({ context, input }) => {
      await bucketGuard.requirePermission(
        context.user.id,
        context.user.role,
        input.bucketId,
        'edit'
      );

      return await objectService.completeMultipartUpload(input);
    }
  );

  const abortMultipartUpload = base.objects.abortMultipartUpload.handler(
    async ({ context, input }) => {
      await bucketGuard.requirePermission(
        context.user.id,
        context.user.role,
        input.bucketId,
        'edit'
      );

      return await objectService.abortMultipartUpload(input);
    }
  );

  return {
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
}
