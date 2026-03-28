import { ConnectionId } from '@buckethub/rpc-contract';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

export function useListBucketsMetrics(connectionId: ConnectionId, bucketNames: string[]) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.buckets.listBucketsMetrics.queryOptions({
    input: { connectionId, bucketNames }
  });

  return useSuspenseQuery(queryOptions);
}
