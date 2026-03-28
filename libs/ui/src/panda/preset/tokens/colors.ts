import { defineTokens } from '@pandacss/dev';
import pandaPreset from '@pandacss/preset-panda';

export const colors = defineTokens.colors({
  grey: pandaPreset.theme.tokens.colors.zinc,
  info: pandaPreset.theme.tokens.colors.zinc,
  success: pandaPreset.theme.tokens.colors.green,
  warning: pandaPreset.theme.tokens.colors.orange,
  error: pandaPreset.theme.tokens.colors.red
});
