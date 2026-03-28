import { useCallback, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthClient } from '@/services/auth/auth';
import { AuthContext, AuthContextValue } from '@/services/auth/context';
import { useCollections } from '@/services/collections';
import { createDemoAuthClient } from './auth';

interface DemoAuthProviderProps {
  children: React.ReactNode;
}

const demoAuthClient: AuthClient = createDemoAuthClient();

const { useSession } = demoAuthClient;

export const DemoAuthProvider: React.FunctionComponent<DemoAuthProviderProps> = ({ children }) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const collections = useCollections();

  const refetchSession_ = session.refetch;

  const refetchSession = useCallback(() => {
    refetchSession_();
  }, [refetchSession_]);

  const value: AuthContextValue = useMemo(
    () =>
      session.data
        ? {
            isAuthenticated: true,
            isPending: session.isPending,
            user: session.data.user,
            session: session.data.session,
            authClient: demoAuthClient,
            refetchSession
          }
        : {
            isAuthenticated: false,
            isPending: session.isPending,
            user: null,
            session: null,
            authClient: demoAuthClient,
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
