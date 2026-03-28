import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

export const profile: HandlerRegistry<'profile'> = {
  getProfile: async () => {
    return demoState.profile;
  },

  updateProfile: async (input) => {
    if (input.name !== undefined) {
      demoState.profile.name = input.name;
    }

    if (input.email !== undefined) {
      demoState.profile.email = input.email;
    }

    if (input.image !== undefined) {
      demoState.profile.image = input.image;
    }

    return demoState.profile;
  },

  getPreferences: async () => {
    return demoState.preferences;
  },

  updatePreferences: async (input) => {
    if (input.theme !== undefined) {
      demoState.preferences.theme = input.theme;
    }

    return demoState.preferences;
  }
};
