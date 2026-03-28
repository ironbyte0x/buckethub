import { BucketId, UserBucketPermissions } from '@buckethub/rpc-contract';
import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

export const permissions: HandlerRegistry<'permissions'> = {
  list: async () => {
    return demoState.permissions;
  },

  setPermissions: async (input) => {
    const user = demoState.users.get(input.userId);
    const bucket = demoState.buckets.get(input.bucketId as BucketId);

    if (!user || !bucket) {
      return;
    }

    const existingIndex = demoState.permissions.findIndex(
      (p) => p.userId === input.userId && p.bucketId === input.bucketId
    );

    if (input.permissions.length === 0) {
      if (existingIndex !== -1) {
        demoState.permissions.splice(existingIndex, 1);
      }

      return;
    }

    const permission: UserBucketPermissions = {
      userId: input.userId,
      userName: user.name,
      userEmail: user.email,
      bucketId: input.bucketId as BucketId,
      bucketName: bucket.name,
      permissions: input.permissions
    };

    if (existingIndex === -1) {
      demoState.permissions.push(permission);
    } else {
      demoState.permissions[existingIndex] = permission;
    }
  }
};
