import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServicesContext } from '../../../context';

export function useUpdateUserRole() {
  const { orpcQuery } = useServicesContext();
  const queryClient = useQueryClient();

  const mutationOptions = orpcQuery.users.updateRole.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.users.list.queryOptions({ input: undefined }).queryKey
      });
    }
  });

  return useMutation(mutationOptions);
}
