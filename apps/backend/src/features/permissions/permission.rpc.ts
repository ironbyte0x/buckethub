import { UserRole } from '@buckethub/core';
import { Contract, os } from '../../rpc/contract';
import { roleMiddleware } from '../../rpc/middleware';
import { authMiddleware } from '../../rpc/middleware/auth';
import { PermissionService } from './permission.service';

export function createPermissionRPCHandlers(
  permissionService: PermissionService
): Contract['permissions'] {
  const base = os.use(authMiddleware).use(roleMiddleware([UserRole.Admin]));

  const list = base.permissions.list.handler(async () => {
    return permissionService.list();
  });

  const setPermissions = base.permissions.setPermissions.handler(async ({ input }) => {
    await permissionService.setPermissions(input.bucketId, input.userId, input.permissions);
  });

  return {
    list,
    setPermissions
  };
}
