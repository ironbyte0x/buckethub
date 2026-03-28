import { UserRole } from '@buckethub/core';
import { ORPCError, os } from '@orpc/server';

export const roleMiddleware = (requiredRoles: UserRole[]) =>
  os
    .$context<{
      user: {
        role: UserRole;
      };
    }>()
    .middleware(async ({ next, context }) => {
      if (!requiredRoles.includes(context.user.role)) {
        throw new ORPCError('FORBIDDEN', {
          message: `Insufficient permissions. Required role: ${requiredRoles.join(' or ')}`
        });
      }

      return next();
    });
