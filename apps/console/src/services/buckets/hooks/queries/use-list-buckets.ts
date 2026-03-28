import { ConnectionId } from '@buckethub/rpc-contract';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

export function useListBuckets(connectionId: ConnectionId) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.buckets.listBuckets.queryOptions({
    input: { connectionId }
  });

  return useSuspenseQuery(queryOptions);
}
