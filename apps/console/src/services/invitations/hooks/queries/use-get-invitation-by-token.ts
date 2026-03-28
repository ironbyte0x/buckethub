import { useQuery } from '@tanstack/react-query';
import { useServicesContext } from '../../../context';

export function useGetInvitationByToken(token: string) {
  const { orpc } = useServicesContext();

  return useQuery({
    queryKey: ['invitation', token],
    queryFn: () => orpc.invitations.getByToken({ token }),
    enabled: !!token
  });
}
