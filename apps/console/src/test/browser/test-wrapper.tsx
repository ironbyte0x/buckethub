import { Suspense } from 'react';
import { UIProvider } from '@buckethub/ui';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Collections, CollectionsContext, createCollections } from '@/services/collections';
import { ServiceContext, Services } from '@/services/context';
import { createTestQueryClient, MockOrpcClient } from './utils';

export interface TestWrapperProps {
  children: React.ReactNode;
  mockOrpc: MockOrpcClient;
  queryClient?: QueryClient;
  collections?: Collections;
}

export const TestWrapper: React.FunctionComponent<TestWrapperProps> = ({
  children,
  mockOrpc,
  queryClient,
  collections
}) => {
  const client = queryClient ?? createTestQueryClient();
  const orpcQuery = createTanstackQueryUtils(mockOrpc);

  const services: Services = {
    orpc: mockOrpc,
    orpcQuery: orpcQuery
  };

  const realCollections =
    collections ??
    createCollections({
      orpcClient: mockOrpc,
      queryClient: client
    });

  return (
    <QueryClientProvider client={client}>
      <ServiceContext.Provider value={services}>
        <CollectionsContext.Provider value={realCollections}>
          <Suspense fallback={null}>
            <UIProvider>{children}</UIProvider>
          </Suspense>
        </CollectionsContext.Provider>
      </ServiceContext.Provider>
    </QueryClientProvider>
  );
};
