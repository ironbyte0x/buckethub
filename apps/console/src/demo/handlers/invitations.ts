import { UserRole } from '@buckethub/core';
import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

export const invitations: HandlerRegistry<'invitations'> = {
  send: async (input) => {
    const id = `inv-${Date.now()}`;

    demoState.invitations.set(id, {
      id,
      email: input.email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return { id };
  },

  list: async () => {
    return Array.from(demoState.invitations.values());
  },

  revoke: async (input) => {
    demoState.invitations.delete(input.id);
  },

  getByToken: async (input) => {
    for (const invitation of demoState.invitations.values()) {
      if (invitation.id === input.token) {
        return { email: invitation.email };
      }
    }

    return null;
  },

  accept: async (input) => {
    const invitation = demoState.invitations.get(input.token);

    if (invitation) {
      const userId = `user-${Date.now()}`;

      demoState.users.set(userId, {
        id: userId,
        name: input.name,
        email: invitation.email,
        image: null,
        role: UserRole.User,
        banned: false,
        banReason: null,
        banExpires: null,
        createdAt: new Date()
      });

      demoState.invitations.delete(input.token);
    }
  }
};
