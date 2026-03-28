import * as v from 'valibot';
import { oc } from '@orpc/contract';
import { bucketIdSchema } from './buckets';

export const permissionLevelSchema = v.picklist(['view', 'edit', 'delete']);
export type PermissionLevel = v.InferOutput<typeof permissionLevelSchema>;

export const bucketPermissionSchema = v.object({
  bucketId: bucketIdSchema,
  userId: v.string(),
  permission: permissionLevelSchema
});

export type BucketPermissionRecord = v.InferOutput<typeof bucketPermissionSchema>;

const userBucketPermissionsSchema = v.object({
  userId: v.string(),
  userName: v.string(),
  userEmail: v.string(),
  bucketId: bucketIdSchema,
  bucketName: v.string(),
  permissions: v.array(permissionLevelSchema)
});

export type UserBucketPermissions = v.InferOutput<typeof userBucketPermissionsSchema>;

const list = oc.input(v.void()).output(v.array(userBucketPermissionsSchema));

const setPermissions = oc
  .input(
    v.object({
      bucketId: bucketIdSchema,
      userId: v.string(),
      permissions: v.array(permissionLevelSchema)
    })
  )
  .output(v.void());

export const permissions = {
  list,
  setPermissions
};
