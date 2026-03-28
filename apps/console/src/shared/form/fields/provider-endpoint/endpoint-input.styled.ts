import { styled } from '@buckethub/styled-system/jsx';

export const StyledEditableInput = styled('div', {
  base: {
    width: '100%',
    height: '9',
    paddingBlock: '9px',
    paddingInline: '3',
    border: '1px solid {colors.border-input}',
    borderRadius: 'lg',
    textStyle: 'input',
    color: 'text-base',
    outline: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    cursor: 'text',
    transition: 'border-color 0.15s ease-out, box-shadow 0.15s ease-out',

    '&:focus': {
      borderColor: 'border-input-focus',
      boxShadow: '0 0 0 3px {colors.border-input-focus/20}'
    },

    '&[aria-invalid="true"]': {
      borderColor: 'border-error',

      '&:focus': {
        boxShadow: '0 0 0 3px {colors.border-error/20}'
      }
    },

    '&[aria-disabled="true"]': {
      opacity: 0.5,
      cursor: 'not-allowed'
    },

    '&:empty::before': {
      content: 'attr(data-placeholder)',
      color: 'text-placeholder',
      pointerEvents: 'none'
    },

    '& mark': {
      backgroundColor: 'background-button-secondary',
      color: 'text-base',
      border: '1px solid {colors.border-mark-input}',
      borderRadius: 'md',
      paddingInline: '0.5',
      paddingBlock: '1px',

      '&::selection': {
        backgroundColor: 'background-button-primary',
        color: 'text-button-primary'
      }
    }
  }
});

export const StyledProviderTags = styled('div', {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5',
    marginTop: '2'
  }
});

export const StyledProviderTag = styled('button', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingBlock: '0.5',
    paddingInline: '2',
    borderRadius: 'lg',
    textStyle: 'body-xsmall-emphasized',
    color: 'text-muted',
    backgroundColor: 'background-button-secondary',
    border: '1px solid {colors.border-button-secondary}',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',

    '&:hover': {
      backgroundColor: 'background-button-secondary/80',
      borderColor: 'border-input-focus'
    }
  }
});
