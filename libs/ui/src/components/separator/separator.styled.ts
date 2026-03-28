import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledSeparator = styled(SeparatorPrimitive, {
  base: {
    backgroundColor: 'border-base',
    border: 'none',
    flexShrink: 0
  },
  variants: {
    orientation: {
      horizontal: {
        height: '1px',
        width: '100%'
      },
      vertical: {
        width: '1px',
        height: '100%'
      }
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
});
