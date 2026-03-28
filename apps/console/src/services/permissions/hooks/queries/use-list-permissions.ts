import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { ORPCQuery } from '@/services/rpc';
import { useServicesContext } from '../../../context';

export function preloadPermissions(queryClient: QueryClient, orpcQuery: ORPCQuery) {
  const queryOptions = orpcQuery.permissions.list.queryOptions({
    input: undefined
  });

  queryClient.ensureQueryData(queryOptions);
}

export function useListPermissions() {
  const { orpcQuery } = useServicesContext();

  return useSuspenseQuery(
    orpcQuery.permissions.list.queryOptions({
      input: undefined
    })
  );
}
