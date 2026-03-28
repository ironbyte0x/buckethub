import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCollections } from '@/services/collections';
import { AuthClient, authClient } from './auth';

interface UnauthenticatedContextValue {
  isAuthenticated: false;
  isPending: boolean;
  user: null;
  session: null;
  authClient: AuthClient;
  refetchSession: () => void;
}

interface AuthenticatedContextValue {
  isAuthenticated: true;
  isPending: boolean;
  user: AuthClient['$Infer']['Session']['user'];
  session: AuthClient['$Infer']['Session']['session'];
  authClient: AuthClient;
  refetchSession: () => void;
}

export type AuthContextValue = UnauthenticatedContextValue | AuthenticatedContextValue;

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

const { useSession } = authClient;

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({ children }) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const collections = useCollections();

  const refetchSession_ = session.refetch;

  const refetchSession = useCallback(() => {
    refetchSession_({ query: { disableCookieCache: true } });
  }, [refetchSession_]);

  const value: AuthContextValue = useMemo(
    () =>
      session.data
        ? {
            isAuthenticated: true,
            isPending: session.isPending,
            user: session.data.user,
            session: session.data.session,
            authClient,
            refetchSession
          }
        : {
            isAuthenticated: false,
            isPending: session.isPending,
            user: null,
            session: null,
            authClient,
            refetchSession
          },
    [session.data, session.isPending, refetchSession]
  );

  useEffect(() => {
    const isLoggedOut = !session.isPending && !session.data;

    if (isLoggedOut) {
      queryClient.clear();
      Object.values(collections).forEach((collection) => collection.cleanup());
    }
  }, [queryClient, session.isPending, session.data, collections]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext should be used within AuthProvider');
  }

  return context;
}
