import { Contract, os } from '../../rpc/contract';
import { authMiddleware } from '../../rpc/middleware';
import { ProfileService } from './profile.service';

export function createProfileRPCHandlers(profileService: ProfileService): Contract['profile'] {
  const base = os.use(authMiddleware);

  const getProfile = base.profile.getProfile.handler(async ({ context }) => {
    return await profileService.getProfile(context.user.id, context.headers);
  });

  const updateProfile = base.profile.updateProfile.handler(async ({ context, input }) => {
    return await profileService.updateProfile(context.user.id, input, context.headers);
  });

  const getPreferences = base.profile.getPreferences.handler(async ({ context }) => {
    return await profileService.getPreferences(context.user.id);
  });

  const updatePreferences = base.profile.updatePreferences.handler(async ({ context, input }) => {
    return await profileService.updatePreferences(context.user.id, input);
  });

  return {
    getProfile,
    updateProfile,
    getPreferences,
    updatePreferences
  };
}
