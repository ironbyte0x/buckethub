import { defineConfig } from '@pandacss/dev';
import { breakpoints } from './breakpoints';
import { globalStyles } from './global-styles';
import { keyframes } from './keyframes';
import { semanticTokens } from './semantic-tokens';
import { textStyles } from './text-styles';
import { tokens } from './tokens';

export const designSystem = defineConfig({
  theme: {
    tokens,
    semanticTokens,
    breakpoints,
    textStyles,
    keyframes
  },
  globalCss: globalStyles
});
