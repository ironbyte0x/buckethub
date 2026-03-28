import { BucketId, PermissionLevel, UserBucketPermissions } from '@buckethub/rpc-contract';
import { PermissionRepository } from './permission.repository';

export class PermissionService {
  public constructor(private readonly permissionRepository: PermissionRepository) {}

  public async list(): Promise<UserBucketPermissions[]> {
    const rows = await this.permissionRepository.getAll();

    return this.aggregatePermissions(rows);
  }

  public async getByUser(userId: string): Promise<UserBucketPermissions[]> {
    const rows = await this.permissionRepository.getByUser(userId);

    return this.aggregatePermissions(rows);
  }

  public async setPermissions(bucketId: BucketId, userId: string, permissions: PermissionLevel[]) {
    await this.permissionRepository.setPermissions(bucketId, userId, permissions);
  }

  public async hasPermission(
    userId: string,
    bucketId: BucketId,
    permission: PermissionLevel
  ): Promise<boolean> {
    const permissions = await this.permissionRepository.getUserBucketPermissions(userId, bucketId);

    return permissions.includes(permission);
  }

  public async grantFullPermissions(bucketId: BucketId, userId: string) {
    await this.permissionRepository.grantFullPermissions(bucketId, userId);
  }

  private aggregatePermissions(
    rows: Array<{
      bucketId: BucketId;
      bucketName: string;
      userId: string;
      userName: string;
      userEmail: string;
      permission: string;
    }>
  ): UserBucketPermissions[] {
    const map = new Map<string, UserBucketPermissions>();

    for (const row of rows) {
      const key = `${row.userId}:${row.bucketId}`;
      const existing = map.get(key);

      if (existing) {
        existing.permissions.push(row.permission as PermissionLevel);
      } else {
        map.set(key, {
          userId: row.userId,
          userName: row.userName,
          userEmail: row.userEmail,
          bucketId: row.bucketId,
          bucketName: row.bucketName,
          permissions: [row.permission as PermissionLevel]
        });
      }
    }

    return Array.from(map.values());
  }
}
