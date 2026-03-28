import { UserRole } from '@buckethub/core';
import { Contract, os } from '../../rpc/contract';
import { authMiddleware, roleMiddleware } from '../../rpc/middleware';
import { InvitationService } from './invitation.service';

export function createInvitationRPCHandlers(
  invitationService: InvitationService
): Contract['invitations'] {
  const base = os.use(authMiddleware).use(roleMiddleware([UserRole.Admin]));
  const publicOs = os;

  const send = base.invitations.send.handler(async ({ context, input }) => {
    return await invitationService.sendInvitation({
      email: input.email,
      invitedById: context.user.id
    });
  });

  const list = base.invitations.list.handler(async () => {
    return await invitationService.listInvitations();
  });

  const revoke = base.invitations.revoke.handler(async ({ input }) => {
    return await invitationService.revokeInvitation(input.id);
  });

  const getByToken = publicOs.invitations.getByToken.handler(async ({ input }) => {
    return await invitationService.getInvitationByToken(input.token);
  });

  const accept = publicOs.invitations.accept.handler(async ({ input }) => {
    return await invitationService.acceptInvitation(input);
  });

  return {
    send,
    list,
    revoke,
    getByToken,
    accept
  };
}
