import { UserRole } from '@buckethub/core';
import { ORPCError, os } from '@orpc/server';
import { auth } from '../../instances';

export const authMiddleware = os
  .$context<{
    headers: Headers;
  }>()
  .middleware(async ({ next, context }) => {
    const session = await auth.api.getSession({
      headers: context.headers
    });

    if (!session) {
      throw new ORPCError('UNAUTHORIZED');
    }

    return next({
      context: {
        ...context,
        user: session.user as typeof session.user & { role: UserRole },
        session: session.session
      }
    });
  });
