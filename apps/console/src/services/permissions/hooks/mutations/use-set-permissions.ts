import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServicesContext } from '../../../context';

export function useSetPermissions() {
  const { orpcQuery } = useServicesContext();
  const queryClient = useQueryClient();

  const mutationOptions = orpcQuery.permissions.setPermissions.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.permissions.list.queryOptions({ input: undefined }).queryKey
      });
    }
  });

  return useMutation(mutationOptions);
}
