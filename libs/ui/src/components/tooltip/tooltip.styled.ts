import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledTrigger = styled(TooltipPrimitive.Trigger, {
  base: {
    cursor: 'pointer'
  }
});

export const StyledPopup = styled(TooltipPrimitive.Popup, {
  base: {
    textStyle: 'body-medium',
    color: 'text-subtle',
    backgroundColor: 'background-base',
    border: 'base',
    paddingBlock: '1.5',
    paddingInline: '2',
    borderRadius: 'lg',
    boxShadow: 'md',

    '&[data-open]': {
      animation: 'fade-in 0.3s {easings.ease-out-quart}'
    },

    '&[data-closed]': {
      animation: 'fade-out 0.3s {easings.ease-out-quart}'
    },

    '&[data-instant]': {
      animation: 'none'
    }
  }
});
