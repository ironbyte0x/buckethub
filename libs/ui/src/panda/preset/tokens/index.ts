import { defineTokens } from '@pandacss/dev';
import pandaPreset from '@pandacss/preset-panda';
import { animations } from './animations';
import { colors } from './colors';
import { durations } from './durations';
import { easings } from './easings';
import { fonts } from './fonts';
import { radii } from './radii';

export const tokens = defineTokens({
  colors,
  fonts,
  radii,
  durations,
  easings,
  animations,
  sizes: pandaPreset.theme.tokens.sizes,
  spacing: pandaPreset.theme.tokens.spacing
});
