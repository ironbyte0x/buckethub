import { useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

export function useProfile() {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.profile.getProfile.queryOptions({
    input: undefined
  });

  return useSuspenseQuery(queryOptions);
}
