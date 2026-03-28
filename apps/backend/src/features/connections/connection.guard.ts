import { UserRole } from '@buckethub/core';
import { ConnectionId } from '@buckethub/rpc-contract';
import { ORPCError } from '@orpc/server';
import { ConnectionRepository } from './connection.repository';

export class ConnectionGuard {
  constructor(private connectionRepository: ConnectionRepository) {}

  public async requireAccess(
    userId: string,
    userRole: UserRole,
    connectionId: ConnectionId
  ): Promise<void> {
    if (userRole === UserRole.Admin) {
      return;
    }

    const connection = await this.connectionRepository.getByIdWithCreator(connectionId);

    if (!connection) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Connection not found'
      });
    }

    if (connection.createdBy !== userId) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You do not have access to this connection'
      });
    }
  }
}
