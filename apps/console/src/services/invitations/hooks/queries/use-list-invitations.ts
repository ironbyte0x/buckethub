import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { ORPCQuery } from '@/services/rpc';
import { useServicesContext } from '../../../context';

export function preloadInvitations(queryClient: QueryClient, orpcQuery: ORPCQuery) {
  const queryOptions = orpcQuery.invitations.list.queryOptions({
    input: undefined
  });

  queryClient.ensureQueryData(queryOptions);
}

export function useListInvitations() {
  const { orpcQuery } = useServicesContext();

  return useSuspenseQuery(
    orpcQuery.invitations.list.queryOptions({
      input: undefined
    })
  );
}
