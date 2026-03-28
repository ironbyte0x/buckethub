import { useQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';
import { RouterInputs } from '@/services/rpc';

export function useShareUrl(data: RouterInputs['objects']['generateShareUrl']) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.objects.generateShareUrl.queryOptions({
    input: data
  });

  return useQuery(queryOptions);
}
