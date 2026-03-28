import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

export const users: HandlerRegistry<'users'> = {
  list: async () => {
    return Array.from(demoState.users.values());
  },

  getById: async (input) => {
    return demoState.users.get(input.id) ?? null;
  },

  updateRole: async (input) => {
    const user = demoState.users.get(input.userId);

    if (user) {
      demoState.users.set(input.userId, { ...user, role: input.role });
    }
  },

  ban: async (input) => {
    const user = demoState.users.get(input.userId);

    if (user) {
      const banExpires = input.expiresIn ? new Date(Date.now() + input.expiresIn * 1000) : null;

      demoState.users.set(input.userId, {
        ...user,
        banned: true,
        banReason: input.reason ?? null,
        banExpires
      });
    }
  },

  unban: async (input) => {
    const user = demoState.users.get(input.userId);

    if (user) {
      demoState.users.set(input.userId, {
        ...user,
        banned: false,
        banReason: null,
        banExpires: null
      });
    }
  },

  remove: async (input) => {
    demoState.users.delete(input.userId);
  }
};
