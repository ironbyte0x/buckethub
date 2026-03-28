import { UserRole } from '@buckethub/core';
import { ORPCError } from '@orpc/server';
import { Contract, os } from '../../rpc/contract';
import { authMiddleware, roleMiddleware } from '../../rpc/middleware';
import { UserService } from './user.service';

export function createUserRPCHandlers(userService: UserService): Contract['users'] {
  const base = os.use(authMiddleware).use(roleMiddleware([UserRole.Admin]));

  function preventSelfModification(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Cannot modify your own account'
      });
    }
  }

  const list = base.users.list.handler(async ({ context }) => {
    return userService.listUsers(context.headers);
  });

  const getById = base.users.getById.handler(async ({ context, input }) => {
    return userService.getUserById(input.id, context.headers);
  });

  const updateRole = base.users.updateRole.handler(async ({ context, input }) => {
    preventSelfModification(context.user.id, input.userId);
    await userService.updateRole(input.userId, input.role, context.headers);
  });

  const ban = base.users.ban.handler(async ({ context, input }) => {
    preventSelfModification(context.user.id, input.userId);

    await userService.banUser(input.userId, context.headers, input.reason, input.expiresIn);
  });

  const unban = base.users.unban.handler(async ({ context, input }) => {
    preventSelfModification(context.user.id, input.userId);

    await userService.unbanUser(input.userId, context.headers);
  });

  const remove = base.users.remove.handler(async ({ context, input }) => {
    preventSelfModification(context.user.id, input.userId);
    await userService.removeUser(input.userId, context.headers);
  });

  return {
    list,
    getById,
    updateRole,
    ban,
    unban,
    remove
  };
}
