import { and, eq } from 'drizzle-orm';
import { BucketId, PermissionLevel } from '@buckethub/rpc-contract';
import { bucketPermissionTable, bucketTable, database, user } from '../../shared/db';

export class PermissionRepository {
  public async getAll() {
    return database
      .select({
        bucketId: bucketPermissionTable.bucketId,
        bucketName: bucketTable.name,
        userId: bucketPermissionTable.userId,
        userName: user.name,
        userEmail: user.email,
        permission: bucketPermissionTable.permission
      })
      .from(bucketPermissionTable)
      .innerJoin(bucketTable, eq(bucketPermissionTable.bucketId, bucketTable.id))
      .innerJoin(user, eq(bucketPermissionTable.userId, user.id));
  }

  public async getByUser(userId: string) {
    return database
      .select({
        bucketId: bucketPermissionTable.bucketId,
        bucketName: bucketTable.name,
        userId: bucketPermissionTable.userId,
        userName: user.name,
        userEmail: user.email,
        permission: bucketPermissionTable.permission
      })
      .from(bucketPermissionTable)
      .innerJoin(bucketTable, eq(bucketPermissionTable.bucketId, bucketTable.id))
      .innerJoin(user, eq(bucketPermissionTable.userId, user.id))
      .where(eq(bucketPermissionTable.userId, userId));
  }

  public async getUserBucketPermissions(userId: string, bucketId: BucketId) {
    const results = await database
      .select({ permission: bucketPermissionTable.permission })
      .from(bucketPermissionTable)
      .where(
        and(eq(bucketPermissionTable.userId, userId), eq(bucketPermissionTable.bucketId, bucketId))
      );

    return results.map((r) => r.permission as PermissionLevel);
  }

  public async setPermissions(bucketId: BucketId, userId: string, permissions: PermissionLevel[]) {
    return database.transaction(async (tx) => {
      await tx
        .delete(bucketPermissionTable)
        .where(
          and(
            eq(bucketPermissionTable.bucketId, bucketId),
            eq(bucketPermissionTable.userId, userId)
          )
        );

      if (permissions.length > 0) {
        await tx.insert(bucketPermissionTable).values(
          permissions.map((permission) => ({
            bucketId,
            userId,
            permission
          }))
        );
      }
    });
  }

  public async grantFullPermissions(bucketId: BucketId, userId: string) {
    const allPermissions: PermissionLevel[] = ['view', 'edit', 'delete'];

    await this.setPermissions(bucketId, userId, allPermissions);
  }
}
