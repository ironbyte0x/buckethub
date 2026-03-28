import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledRadioGroupRoot = styled(RadioGroup, {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2'
  }
});

export const StyledRadioGroupItem = styled(Radio.Root, {
  base: {
    all: 'unset',
    boxSizing: 'border-box',
    display: 'flex',
    width: '4',
    height: '4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'full',
    outline: '0',
    padding: '0',
    margin: '0',
    border: 'none',
    transition: 'background-color 0.15s ease-out',

    '&[data-unchecked]': {
      border: '1px solid',
      borderColor: 'border-mark-input',
      backgroundColor: 'transparent'
    },

    '&[data-checked]': {
      backgroundColor: 'background-button-primary'
    },

    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'border-focus',
      outlineOffset: '2px'
    }
  }
});

export const StyledRadioGroupIndicator = styled(Radio.Indicator, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.15s ease-out',

    '&[data-checked]': {
      opacity: '1',

      '&::before': {
        transform: 'scale(1)'
      }
    },

    '&[data-unchecked]': {
      opacity: '0',

      '&::before': {
        transform: 'scale(0)'
      }
    },

    _before: {
      content: '""',
      borderRadius: 'full',
      width: '1.5',
      height: '1.5',
      backgroundColor: 'background-base',
      transition: 'transform 0.3s ease-out'
    }
  }
});
