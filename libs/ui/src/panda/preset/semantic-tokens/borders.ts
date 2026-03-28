import { defineSemanticTokens } from '@pandacss/dev';

export const borders = defineSemanticTokens.borders({
  base: {
    value: '1px solid {colors.border-base}'
  },
  surface: {
    value: '1px solid {colors.border-surface}'
  },
  active: {
    value: '2px solid {colors.border-active}'
  }
});
