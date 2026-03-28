import { useMutation } from '@tanstack/react-query';
import { useServicesContext } from '../../../context';

export function useAcceptInvitation() {
  const { orpc } = useServicesContext();

  return useMutation({
    mutationFn: async (data: { token: string; name: string; password: string }) => {
      return orpc.invitations.accept(data);
    }
  });
}
