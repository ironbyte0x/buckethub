import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServicesContext } from '../../../context';

export function useSendInvitation() {
  const { orpcQuery } = useServicesContext();
  const queryClient = useQueryClient();

  const mutationOptions = orpcQuery.invitations.send.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.invitations.list.queryOptions({ input: undefined }).queryKey
      });
    }
  });

  return useMutation(mutationOptions);
}
