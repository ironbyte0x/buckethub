import { QueryClient, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';
import { ORPCQuery, RouterInputs } from '@/services/rpc';

type Data = RouterInputs['objects']['getAllByBucketId'];

export function objectsQueryOptions(orpcQuery: ORPCQuery, data: Data) {
  return orpcQuery.objects.getAllByBucketId.experimental_liveOptions({
    input: data
  });
}

export function preloadObjects(queryClient: QueryClient, orpcQuery: ORPCQuery, data: Data) {
  const queryOptions = objectsQueryOptions(orpcQuery, data);

  queryClient.ensureQueryData(queryOptions);
}

export function useObjects(data: Data) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = objectsQueryOptions(orpcQuery, data);

  return useSuspenseQuery(queryOptions);
}

export function useObjectsLazy(data: Data) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = objectsQueryOptions(orpcQuery, data);

  return useQuery(queryOptions);
}

export function useObjectsImperative() {
  const queryClient = useQueryClient();
  const { orpcQuery } = useServicesContext();

  return (data: Data) => {
    const queryOptions = objectsQueryOptions(orpcQuery, data);

    return queryClient.fetchQuery(queryOptions);
  };
}
