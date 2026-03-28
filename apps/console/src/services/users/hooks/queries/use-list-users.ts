import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { ORPCQuery } from '@/services/rpc';
import { useServicesContext } from '../../../context';

export function preloadUsers(queryClient: QueryClient, orpcQuery: ORPCQuery) {
  const queryOptions = orpcQuery.users.list.queryOptions({
    input: undefined
  });

  queryClient.ensureQueryData(queryOptions);
}

export function useListUsers() {
  const { orpcQuery } = useServicesContext();

  return useSuspenseQuery(
    orpcQuery.users.list.queryOptions({
      input: undefined
    })
  );
}
