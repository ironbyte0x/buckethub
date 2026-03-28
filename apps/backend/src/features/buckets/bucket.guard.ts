import { UserRole } from '@buckethub/core';
import { BucketId, PermissionLevel } from '@buckethub/rpc-contract';
import { ORPCError } from '@orpc/server';
import { PermissionService } from '../permissions';

export class BucketGuard {
  constructor(private permissionService: PermissionService) {}

  public async requirePermission(
    userId: string,
    userRole: UserRole,
    bucketId: BucketId,
    requiredPermission: PermissionLevel
  ): Promise<void> {
    if (userRole === UserRole.Admin) {
      return;
    }

    const hasPermission = await this.permissionService.hasPermission(
      userId,
      bucketId,
      requiredPermission
    );

    if (!hasPermission) {
      throw new ORPCError('FORBIDDEN', {
        message: `You don't have ${requiredPermission} permission for this bucket`
      });
    }
  }
}
