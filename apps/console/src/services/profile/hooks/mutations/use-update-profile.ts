import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/services/auth';
import { useServicesContext } from '@/services/context';

export function useUpdateProfile() {
  const { orpcQuery } = useServicesContext();
  const { refetchSession } = useAuth();
  const queryClient = useQueryClient();

  const mutationOptions = orpcQuery.profile.updateProfile.mutationOptions({
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.profile.getProfile.queryOptions({
          input: undefined
        }).queryKey
      });

      refetchSession();
    }
  });

  return useMutation(mutationOptions);
}
