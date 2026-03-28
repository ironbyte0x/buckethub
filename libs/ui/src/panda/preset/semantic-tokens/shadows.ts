import { defineSemanticTokens } from '@pandacss/dev';
import pandaPreset from '@pandacss/preset-panda';

export const shadows = defineSemanticTokens.shadows({
  ...pandaPreset.theme.tokens.shadows
});
