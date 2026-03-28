import { useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';
import { RouterInputs } from '@/services/rpc';

export function useObject(data: RouterInputs['objects']['getById']) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.objects.getById.queryOptions({
    input: data
  });

  return useSuspenseQuery(queryOptions);
}
