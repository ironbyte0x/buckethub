import { BucketId, GetBucketMetricsRequest } from '@buckethub/rpc-contract';
import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';
import { ORPCQuery } from '@/services/rpc';

export function preloadBucketMetrics(
  queryClient: QueryClient,
  orpcQuery: ORPCQuery,
  bucketId: BucketId
) {
  const queryOptions = orpcQuery.buckets.getBucketMetrics.queryOptions({
    input: { id: bucketId }
  });

  queryClient.ensureQueryData(queryOptions);
}

export function useBucketMetrics(data: GetBucketMetricsRequest) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.buckets.getBucketMetrics.queryOptions({
    input: data
  });

  return useSuspenseQuery(queryOptions);
}
