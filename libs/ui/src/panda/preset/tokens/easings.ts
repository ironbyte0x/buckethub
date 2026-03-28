import { defineTokens } from '@pandacss/dev';

export const easings = defineTokens.easings({
  'ease-out-quart': {
    value: 'cubic-bezier(0.23, 1, 0.32, 1)'
  },
  'ease-out-quint': {
    value: 'cubic-bezier(.165, .84, .44, 1)'
  }
});
