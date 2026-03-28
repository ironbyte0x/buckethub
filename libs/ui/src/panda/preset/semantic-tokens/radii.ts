import { defineSemanticTokens } from '@pandacss/dev';

export const radii = defineSemanticTokens.radii({
  xs: { value: '0.125rem' /* 2px */ },
  sm: { value: '0.25rem' /* 4px */ },
  md: { value: '0.375rem' /* 6px */ },
  lg: { value: '0.5rem' /* 8px */ },
  xl: { value: '0.75rem' /* 12px */ },
  '2xl': { value: '1rem' /* 16px */ },
  '3xl': { value: '1.5rem' /* 24px */ },
  '4xl': { value: '2rem' /* 32px */ },
  full: { value: '9999px' }
});
