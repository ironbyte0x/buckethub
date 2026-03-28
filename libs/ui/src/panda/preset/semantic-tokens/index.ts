import { defineSemanticTokens } from '@pandacss/dev';
import { borders } from './borders';
import { colors } from './colors';
import { radii } from './radii';
import { shadows } from './shadows';
import { sizes } from './sizes';

export const semanticTokens = defineSemanticTokens({
  colors,
  borders,
  radii,
  sizes,
  shadows
});
