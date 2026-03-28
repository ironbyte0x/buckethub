import { styled } from '@buckethub/styled-system/jsx';

export const StyledTextInput = styled('input', {
  base: {
    display: 'flex',
    width: 'full',
    height: '9',
    paddingInline: '4',
    borderRadius: 'lg',
    border: '1px solid {colors.border-input}',
    textStyle: 'input',
    color: 'text-base',
    outline: 'none',
    transition:
      'border-color 0.3s {easings.ease-out-quart}, box-shadow 0.3s {easings.ease-out-quart}',

    '&::placeholder': {
      color: 'text-placeholder'
    },

    '&:focus': {
      borderColor: 'border-input-focus',
      boxShadow: '0 0 0 3px {colors.border-input-focus/20}'
    },

    '&:disabled': {
      opacity: '0.5',
      cursor: 'not-allowed'
    },

    '&:read-only': {
      opacity: '0.7'
    },

    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
      boxShadow: '0 0 0 1000px {colors.background-input} inset !important',
      WebkitTextFillColor: '{colors.text-base} !important',
      caretColor: '{colors.text-base} !important',
      transition:
        'background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s, border-color 0.3s {easings.ease-out-quart}, box-shadow 0.3s {easings.ease-out-quart} !important'
    },

    // Support for InputGroup - apply data-slot for future InputGroup integration
    '&[data-slot="input-group-control"]': {
      // Styles will be overridden by InputGroup when needed
    }
  },

  variants: {
    size: {
      sm: {
        height: '8',
        paddingInline: '2.5',
        textStyle: 'body-medium'
      },
      md: {
        height: '9',
        paddingInline: '3',
        textStyle: 'input'
      },
      lg: {
        height: '10',
        paddingInline: '4',
        textStyle: 'body-large'
      }
    },
    variant: {
      primary: {
        backgroundColor: 'transparent'
      },
      secondary: {
        backgroundColor: 'background-input'
      }
    },
    error: {
      true: {
        borderColor: 'border-error',

        '&:focus': {
          borderColor: 'border-error',
          boxShadow: '0 0 0 3px {colors.border-error/20}'
        }
      }
    }
  },

  defaultVariants: {
    size: 'md',
    variant: 'primary'
  }
});
