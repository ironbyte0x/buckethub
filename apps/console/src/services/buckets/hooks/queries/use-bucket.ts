import { BucketId, GetBucketRequest } from '@buckethub/rpc-contract';
import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';
import { ORPCQuery } from '@/services/rpc';

export function preloadBucket(queryClient: QueryClient, orpcQuery: ORPCQuery, bucketId: BucketId) {
  const queryOptions = orpcQuery.buckets.getBucket.queryOptions({
    input: {
      id: bucketId
    }
  });

  queryClient.ensureQueryData(queryOptions);
}

export function useBucket(data: GetBucketRequest) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.buckets.getBucket.queryOptions({
    input: data
  });

  return useSuspenseQuery(queryOptions);
}
