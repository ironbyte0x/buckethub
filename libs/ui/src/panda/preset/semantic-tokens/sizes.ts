import { defineSemanticTokens } from '@pandacss/dev';

export const sizes = defineSemanticTokens.sizes({
  'input-height-large': { value: '{sizes.12}' },
  'input-height-default': { value: '{sizes.10}' },
  'button-height-lg': { value: '2.5rem' },
  'button-height-md': { value: '2.375rem' },
  'button-height-sm': { value: '{sizes.8}' },
  'button-height-xs': { value: '{sizes.7}' },
  'button-height-2xs': { value: '{sizes.6}' }
});
