import { beforeEach, describe, expect, it } from 'vitest';
import { BucketId, PermissionLevel } from '@buckethub/rpc-contract';
import { createMockClass } from '@buckethub/test';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';

function createMockPermissionRepository() {
  return createMockClass<PermissionRepository>();
}

describe('PermissionService', () => {
  let permissionService: PermissionService;
  let permissionRepository: ReturnType<typeof createMockPermissionRepository>;

  beforeEach(() => {
    permissionRepository = createMockPermissionRepository();
    permissionService = new PermissionService(permissionRepository);
  });

  describe('aggregatePermissions (via list)', () => {
    it('groups permissions by user and bucket', async () => {
      permissionRepository.getAll.mockResolvedValue([
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'view'
        },
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'edit'
        }
      ]);

      const result = await permissionService.list();

      expect(result).toHaveLength(1);
      expect(result[0].permissions).toEqual(['view', 'edit']);
    });

    it('separates different users on same bucket', async () => {
      permissionRepository.getAll.mockResolvedValue([
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'view'
        },
        {
          userId: 'u2',
          userName: 'Bob',
          userEmail: 'bob@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'view'
        }
      ]);

      const result = await permissionService.list();

      expect(result).toHaveLength(2);
      expect(result[0].userId).toBe('u1');
      expect(result[1].userId).toBe('u2');
    });

    it('separates same user on different buckets', async () => {
      permissionRepository.getAll.mockResolvedValue([
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'view'
        },
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b2' as BucketId,
          bucketName: 'Bucket2',
          permission: 'edit'
        }
      ]);

      const result = await permissionService.list();

      expect(result).toHaveLength(2);
      expect(result[0].bucketId).toBe('b1');
      expect(result[1].bucketId).toBe('b2');
    });

    it('returns empty array for no rows', async () => {
      permissionRepository.getAll.mockResolvedValue([]);

      const result = await permissionService.list();

      expect(result).toEqual([]);
    });

    it('aggregates all three permission levels', async () => {
      permissionRepository.getAll.mockResolvedValue([
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'view'
        },
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'edit'
        },
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'delete'
        }
      ]);

      const result = await permissionService.list();

      expect(result).toHaveLength(1);
      expect(result[0].permissions).toEqual(['view', 'edit', 'delete']);
    });

    it('preserves user metadata in aggregation', async () => {
      permissionRepository.getAll.mockResolvedValue([
        {
          userId: 'u1',
          userName: 'Alice Smith',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'MyBucket',
          permission: 'view'
        }
      ]);

      const result = await permissionService.list();

      expect(result[0]).toEqual({
        userId: 'u1',
        userName: 'Alice Smith',
        userEmail: 'alice@test.com',
        bucketId: 'b1',
        bucketName: 'MyBucket',
        permissions: ['view']
      });
    });
  });

  describe('hasPermission', () => {
    it('returns true when user has the required permission', async () => {
      permissionRepository.getUserBucketPermissions.mockResolvedValue([
        'view',
        'edit'
      ] as PermissionLevel[]);

      const result = await permissionService.hasPermission('u1', 'b1' as BucketId, 'view');

      expect(result).toBe(true);
    });

    it('returns false when user does not have the required permission', async () => {
      permissionRepository.getUserBucketPermissions.mockResolvedValue([
        'view'
      ] as PermissionLevel[]);

      const result = await permissionService.hasPermission('u1', 'b1' as BucketId, 'delete');

      expect(result).toBe(false);
    });

    it('returns false when user has no permissions', async () => {
      permissionRepository.getUserBucketPermissions.mockResolvedValue([]);

      const result = await permissionService.hasPermission('u1', 'b1' as BucketId, 'edit');

      expect(result).toBe(false);
    });
  });

  describe('getByUser', () => {
    it('aggregates permissions for a specific user', async () => {
      permissionRepository.getByUser.mockResolvedValue([
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'view'
        },
        {
          userId: 'u1',
          userName: 'Alice',
          userEmail: 'alice@test.com',
          bucketId: 'b1' as BucketId,
          bucketName: 'Bucket1',
          permission: 'edit'
        }
      ]);

      const result = await permissionService.getByUser('u1');

      expect(result).toHaveLength(1);
      expect(result[0].permissions).toEqual(['view', 'edit']);
    });

    it('returns empty array when user has no permissions', async () => {
      permissionRepository.getByUser.mockResolvedValue([]);

      const result = await permissionService.getByUser('u1');

      expect(result).toEqual([]);
    });
  });

  describe('setPermissions', () => {
    it('delegates to repository', async () => {
      await permissionService.setPermissions('b1' as BucketId, 'u1', [
        'view',
        'edit'
      ] as PermissionLevel[]);

      expect(permissionRepository.setPermissions).toHaveBeenCalledWith('b1', 'u1', [
        'view',
        'edit'
      ]);
    });
  });

  describe('grantFullPermissions', () => {
    it('delegates to repository', async () => {
      await permissionService.grantFullPermissions('b1' as BucketId, 'u1');

      expect(permissionRepository.grantFullPermissions).toHaveBeenCalledWith('b1', 'u1');
    });
  });
});
