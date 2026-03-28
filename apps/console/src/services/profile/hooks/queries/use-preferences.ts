import { useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

export function usePreferences() {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.profile.getPreferences.queryOptions({
    input: undefined
  });

  return useSuspenseQuery(queryOptions);
}
