import { useSyncExternalStore } from 'react';
import { BetterFetchResponse, createAuthClient } from 'better-auth/react';
import { UserRole } from '@buckethub/core';
import { authClientOptions } from '@/services/auth/config';
import { getSession, setSession, subscribe } from './session-store';
import { demoState } from './state';

type DemoAuthClient = ReturnType<typeof createAuthClient<typeof authClientOptions>>;
type DemoSession = DemoAuthClient['$Infer']['Session'];

function createDemoSession(): DemoSession {
  const profile = demoState.profile;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    user: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.image,
      createdAt: new Date('2024-01-01'),
      updatedAt: now,
      emailVerified: true,
      role: UserRole.Admin,
      banned: false
    },
    session: {
      id: 'demo-session-id',
      userId: profile.id,
      token: 'demo-token',
      expiresAt,
      createdAt: now,
      updatedAt: now,
      ipAddress: null,
      userAgent: null
    }
  };
}

function createSuccessResponse<T>(data: T): BetterFetchResponse<T, Record<string, unknown>, false> {
  return { data, error: null };
}

export function createDemoAuthClient(): DemoAuthClient {
  return {
    $Infer: {} as DemoAuthClient['$Infer'],

    $store: {
      atoms: {
        session: {
          get: () => {
            const session = getSession();

            return session ? { data: session } : null;
          }
        }
      }
    },

    useSession: () => {
      const session = useSyncExternalStore(subscribe, getSession, () => null);

      return {
        data: session,
        isPending: false,
        isRefetching: false,
        error: null,
        refetch: () => {
          setSession(createDemoSession());

          return Promise.resolve();
        }
      };
    },

    signIn: {
      email: async (_data: { email: string; password: string; rememberMe?: boolean }) => {
        const session = createDemoSession();

        setSession(session);

        return createSuccessResponse({
          redirect: false,
          token: session.session.token,
          user: session.user
        });
      }
    },

    signUp: {
      email: async (_data: { name: string; email: string; password: string }) => {
        const session = createDemoSession();

        setSession(session);

        return createSuccessResponse({
          token: session.session.token,
          user: session.user
        });
      }
    },

    signOut: async () => {
      setSession(null);

      return createSuccessResponse({ success: true });
    },

    changePassword: async (_data: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    }) => {
      const session = getSession();

      return createSuccessResponse({
        token: session?.session.token ?? 'demo-token',
        user: session?.user ?? createDemoSession().user
      });
    },

    forgetPassword: async (_data: { email: string; redirectTo?: string }) => {
      return createSuccessResponse({ status: true });
    },

    resetPassword: async (_data: { newPassword: string; token?: string }) => {
      return createSuccessResponse({ status: true });
    }
  } as unknown as DemoAuthClient;
}
