import { InvitationRepository } from '../features/invitations';

const invitationRepository = new InvitationRepository();

// eslint-disable-next-line import/no-default-export -- Bun cron requires a default export with a scheduled() handler
export default {
  async scheduled() {
    await invitationRepository.deleteExpired();
  }
};
