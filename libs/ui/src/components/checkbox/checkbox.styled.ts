import { Checkbox } from '@base-ui/react/checkbox';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledCheckboxRoot = styled(Checkbox.Root, {
  base: {
    all: 'unset',
    boxSizing: 'border-box',
    display: 'flex',
    width: '4.5',
    height: '4.5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'md',
    outline: '0',
    padding: '0',
    margin: '0',
    border: '1px solid',
    borderColor: 'border-mark-input',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s {easings.ease-out-quart}',

    '&[data-checked]': {
      backgroundColor: 'background-button-primary',
      borderColor: 'border-button-primary'
    },

    '&[data-indeterminate]': {
      backgroundColor: 'background-button-primary',
      borderColor: 'border-button-primary'
    },

    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'border-focus',
      outlineOffset: '2px'
    },

    '&[data-disabled]': {
      cursor: 'not-allowed',
      opacity: '0.5'
    },

    '&[data-readonly]': {
      cursor: 'default'
    }
  }
});

export const StyledCheckboxIndicator = styled(Checkbox.Indicator, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text-button-primary',
    transition: 'opacity 0.2s {easings.ease-out-quart}, transform 0.2s {easings.ease-out-quart}',
    willChange: 'transform, opacity',

    '&[data-checked], &[data-indeterminate]': {
      opacity: '1',
      transform: 'scale(1)'
    },

    '&[data-unchecked]': {
      opacity: '0',
      transform: 'scale(0.5)'
    }
  }
});
