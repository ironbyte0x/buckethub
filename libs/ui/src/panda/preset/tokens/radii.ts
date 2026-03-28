import { defineTokens } from '@pandacss/dev';
import { preset } from '@pandacss/preset-panda';

export const radii = defineTokens.radii({
  ...preset.theme.tokens.radii
});
