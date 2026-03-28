import { UserRole } from '@buckethub/core';
import type { Auth } from '../../auth';
import { S3Storage } from '../../shared/storage';
import { ConnectionRepository } from '../connections';

export class UserService {
  constructor(
    private readonly auth: Auth,
    private readonly connectionRepository: ConnectionRepository,
    private readonly s3Storage: S3Storage
  ) {}

  public async listUsers(headers: Headers) {
    const response = await this.auth.api.listUsers({
      headers,
      query: {}
    });

    return response.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: (user.role as UserRole) ?? null,
      banned: user.banned ?? null,
      banReason: user.banReason ?? null,
      banExpires: user.banExpires ? new Date(user.banExpires) : null,
      createdAt: new Date(user.createdAt)
    }));
  }

  public async getUserById(id: string, headers: Headers) {
    const response = await this.auth.api.listUsers({
      headers,
      query: {
        filterField: 'id',
        filterOperator: 'eq',
        filterValue: id
      }
    });

    const user = response.users[0];

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: (user.role as UserRole) ?? null,
      banned: user.banned ?? null,
      banReason: user.banReason ?? null,
      banExpires: user.banExpires ? new Date(user.banExpires) : null,
      createdAt: new Date(user.createdAt)
    };
  }

  public async updateRole(userId: string, role: UserRole, headers: Headers) {
    await this.auth.api.setRole({
      headers,
      body: { userId, role }
    });
  }

  public async banUser(userId: string, headers: Headers, reason?: string, expiresIn?: number) {
    await this.auth.api.banUser({
      headers,
      body: {
        userId,
        banReason: reason,
        banExpiresIn: expiresIn
      }
    });
  }

  public async unbanUser(userId: string, headers: Headers) {
    await this.auth.api.unbanUser({
      headers,
      body: { userId }
    });
  }

  public async removeUser(userId: string, headers: Headers) {
    let connections: { accessKeyId: string; endpoint: string }[] = [];

    try {
      connections = await this.connectionRepository.getByOwnerWithCredentials(userId);
    } catch {
      // Proceed with deletion even if connection fetch fails
    }

    await this.auth.api.removeUser({
      headers,
      body: { userId }
    });

    for (const connection of connections) {
      this.s3Storage.invalidateClientCache({
        accessKeyId: connection.accessKeyId,
        endpoint: connection.endpoint
      });
    }
  }
}
