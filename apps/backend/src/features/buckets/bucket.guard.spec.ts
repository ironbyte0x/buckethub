import { beforeEach, describe, expect, it } from 'vitest';
import { UserRole } from '@buckethub/core';
import { BucketId } from '@buckethub/rpc-contract';
import { createMockClass } from '@buckethub/test';
import { ORPCError } from '@orpc/server';
import { PermissionService } from '../permissions';
import { BucketGuard } from './bucket.guard';

function createMockPermissionService() {
  return createMockClass<PermissionService>();
}

describe('BucketGuard', () => {
  let guard: BucketGuard;
  let permissionService: ReturnType<typeof createMockPermissionService>;

  beforeEach(() => {
    permissionService = createMockPermissionService();
    guard = new BucketGuard(permissionService);
  });

  it('admin role bypasses permission check', async () => {
    await guard.requirePermission('user-1', UserRole.Admin, 'bucket-1' as BucketId, 'view');

    expect(permissionService.hasPermission).not.toHaveBeenCalled();
  });

  it('non-admin with valid permission resolves without error', async () => {
    permissionService.hasPermission.mockResolvedValue(true);

    await expect(
      guard.requirePermission('user-1', UserRole.User, 'bucket-1' as BucketId, 'view')
    ).resolves.toBeUndefined();
  });

  it('non-admin without permission throws ORPCError with FORBIDDEN', async () => {
    permissionService.hasPermission.mockResolvedValue(false);

    await expect(
      guard.requirePermission('user-1', UserRole.User, 'bucket-1' as BucketId, 'edit')
    ).rejects.toThrow(ORPCError);

    await expect(
      guard.requirePermission('user-1', UserRole.User, 'bucket-1' as BucketId, 'edit')
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('non-admin role does not bypass permission check', async () => {
    permissionService.hasPermission.mockResolvedValue(false);

    await expect(
      guard.requirePermission('user-1', UserRole.User, 'bucket-1' as BucketId, 'view')
    ).rejects.toThrow(ORPCError);

    expect(permissionService.hasPermission).toHaveBeenCalled();
  });
});
