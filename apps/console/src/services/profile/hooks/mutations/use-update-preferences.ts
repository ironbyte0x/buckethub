import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

export function useUpdatePreferences() {
  const { orpcQuery } = useServicesContext();
  const queryClient = useQueryClient();

  const mutationOptions = orpcQuery.profile.updatePreferences.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.profile.getPreferences.queryOptions({
          input: undefined
        }).queryKey
      });
    }
  });

  return useMutation(mutationOptions);
}
