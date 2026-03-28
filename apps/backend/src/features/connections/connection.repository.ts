import { count, eq, inArray } from 'drizzle-orm';
import { ProviderType, UserRole } from '@buckethub/core';
import { ConnectionId } from '@buckethub/rpc-contract';
import {
  bucketPermissionTable,
  bucketTable,
  connectionTable,
  database,
  user
} from '../../shared/db';

export class ConnectionRepository {
  public async getById(id: ConnectionId) {
    const result = await database.select().from(connectionTable).where(eq(connectionTable.id, id));

    return result[0];
  }

  public async getByIdWithCreator(id: ConnectionId) {
    const result = await database
      .select({
        id: connectionTable.id,
        providerType: connectionTable.providerType,
        label: connectionTable.label,
        endpoint: connectionTable.endpoint,
        createdBy: connectionTable.createdBy,
        creatorRole: user.role
      })
      .from(connectionTable)
      .leftJoin(user, eq(connectionTable.createdBy, user.id))
      .where(eq(connectionTable.id, id));

    return result[0];
  }

  public async getByOwner(userId: string) {
    const result = await database
      .select({
        id: connectionTable.id,
        providerType: connectionTable.providerType,
        label: connectionTable.label,
        endpoint: connectionTable.endpoint,
        createdBy: connectionTable.createdBy
      })
      .from(connectionTable)
      .where(eq(connectionTable.createdBy, userId));

    return result;
  }

  public async getByOwnerWithCredentials(userId: string) {
    const result = await database
      .select({
        accessKeyId: connectionTable.accessKeyId,
        endpoint: connectionTable.endpoint
      })
      .from(connectionTable)
      .where(eq(connectionTable.createdBy, userId));

    return result;
  }

  public async getByAdminCreators() {
    const adminUsers = await database
      .select({ id: user.id })
      .from(user)
      .where(eq(user.role, 'admin'));

    const adminIds = adminUsers.map((u) => u.id);

    if (adminIds.length === 0) {
      return [];
    }

    const result = await database
      .select({
        id: connectionTable.id,
        providerType: connectionTable.providerType,
        label: connectionTable.label,
        endpoint: connectionTable.endpoint,
        createdBy: connectionTable.createdBy
      })
      .from(connectionTable)
      .where(inArray(connectionTable.createdBy, adminIds));

    return result;
  }

  public async getByUserBucketPermissions(userId: string) {
    const permissionResults = await database
      .select({ connectionId: bucketTable.connectionId })
      .from(bucketPermissionTable)
      .innerJoin(bucketTable, eq(bucketPermissionTable.bucketId, bucketTable.id))
      .where(eq(bucketPermissionTable.userId, userId));

    const connectionIds = [
      ...new Set(permissionResults.map((permission) => permission.connectionId))
    ];

    if (connectionIds.length === 0) {
      return [];
    }

    const result = await database
      .select({
        id: connectionTable.id,
        providerType: connectionTable.providerType,
        label: connectionTable.label,
        endpoint: connectionTable.endpoint,
        createdBy: connectionTable.createdBy
      })
      .from(connectionTable)
      .where(inArray(connectionTable.id, connectionIds));

    return result;
  }

  public async getAllForUser(userId: string, role: string) {
    if (role === UserRole.Admin) {
      return this.getByAdminCreators();
    }

    const [ownedConnections, permissionConnections] = await Promise.all([
      this.getByOwner(userId),
      this.getByUserBucketPermissions(userId)
    ]);

    const connectionMap = new Map(
      ownedConnections.map((connection) => [connection.id, connection])
    );

    for (const connection of permissionConnections) {
      if (!connectionMap.has(connection.id)) {
        connectionMap.set(connection.id, connection);
      }
    }

    return Array.from(connectionMap.values());
  }

  public async deleteConnection(id: ConnectionId) {
    return database.transaction(async (tx) => {
      await tx.delete(bucketTable).where(eq(bucketTable.connectionId, id));
      await tx.delete(connectionTable).where(eq(connectionTable.id, id));
    });
  }

  public async getCountByProviderType(providerType: ProviderType) {
    const [result] = await database
      .select({ count: count() })
      .from(connectionTable)
      .where(eq(connectionTable.providerType, providerType));

    return result.count;
  }

  public async create(data: {
    id: ConnectionId;
    providerType: ProviderType;
    label: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    createdBy: string;
  }) {
    const [connection] = await database.insert(connectionTable).values(data).returning({
      id: connectionTable.id,
      providerType: connectionTable.providerType,
      label: connectionTable.label,
      endpoint: connectionTable.endpoint
    });

    return connection;
  }

  public async update(data: {
    id: ConnectionId;
    label?: string;
    providerType?: ProviderType;
    accessKeyId?: string;
    secretAccessKey?: string;
    endpoint?: string;
  }) {
    const [connection] = await database
      .update(connectionTable)
      .set({
        ...(data.label !== undefined && { label: data.label }),
        ...(data.providerType !== undefined && { providerType: data.providerType }),
        ...(data.accessKeyId !== undefined && {
          accessKeyId: data.accessKeyId
        }),
        ...(data.secretAccessKey !== undefined && {
          secretAccessKey: data.secretAccessKey
        }),
        ...(data.endpoint !== undefined && { endpoint: data.endpoint })
      })
      .where(eq(connectionTable.id, data.id))
      .returning({
        id: connectionTable.id,
        label: connectionTable.label,
        providerType: connectionTable.providerType,
        endpoint: connectionTable.endpoint
      });

    return connection;
  }
}
