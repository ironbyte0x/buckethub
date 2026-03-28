import { Contract, os } from '../../rpc/contract';
import { authMiddleware } from '../../rpc/middleware/auth';
import { ConnectionGuard } from './connection.guard';
import { ConnectionService } from './connection.service';

export function createConnectionRPCHandlers(
  connectionService: ConnectionService,
  connectionGuard: ConnectionGuard
): Contract['connections'] {
  const base = os.use(authMiddleware);

  const create = base.connections.create.handler(async ({ context, input }) => {
    return await connectionService.create(input, context.user.id);
  });

  const getAll = base.connections.getAll.handler(async ({ context }) => {
    return await connectionService.getAll(context.user.id, context.user.role);
  });

  const update = base.connections.update.handler(async ({ context, input }) => {
    await connectionGuard.requireAccess(context.user.id, context.user.role, input.id);

    return await connectionService.update(input);
  });

  const delete_ = base.connections.delete.handler(async ({ context, input }) => {
    await connectionGuard.requireAccess(context.user.id, context.user.role, input.id);

    return await connectionService.deleteConnection(input.id);
  });

  return {
    create,
    getAll,
    update,
    delete: delete_
  };
}
