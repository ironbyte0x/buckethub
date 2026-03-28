import { styled } from '@buckethub/styled-system/jsx';

export const StyledButton = styled('button', {
  base: {
    display: 'flex',
    flexShrink: '0',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s {easings.ease-out-quart}',
    textStyle: 'input',
    height: 'var(--button-height)',
    gap: 'var(--button-gap)',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  },

  variants: {
    variant: {
      primary: {
        color: 'text-button-primary',
        backgroundColor: 'background-button-primary',
        borderRadius: 'lg',
        border: '1px solid {colors.border-button-primary}',

        '&:hover:not(:disabled), &[data-popup-open]': {
          backgroundColor: 'background-button-primary-hover'
        },

        '&:disabled': {
          backgroundColor: 'background-button-primary-disabled',
          cursor: 'default'
        }
      },
      secondary: {
        color: 'text-button-secondary',
        backgroundColor: 'background-button-secondary',
        borderRadius: 'lg',
        border: '1px solid {colors.border-button-secondary}',

        '&:hover:not(:disabled), &[data-popup-open]': {
          backgroundColor: 'background-button-secondary-hover'
        },

        '&:disabled': {
          backgroundColor: 'background-button-secondary-disabled',
          cursor: 'default'
        }
      },
      ghost: {
        color: 'text-base',
        borderRadius: 'lg',

        '&:hover:not(:disabled), &[data-popup-open]': {
          backgroundColor: 'background-button-secondary-hover'
        },

        '&:disabled': {
          cursor: 'default'
        }
      },
      destructive: {
        color: 'text-button-destructive',
        backgroundColor: 'background-button-destructive',
        borderRadius: 'lg',
        border: '1px solid {colors.border-button-destructive}',

        '&:hover:not(:disabled), &[data-popup-open]': {
          backgroundColor: 'background-button-destructive-hover'
        },

        '&:disabled': {
          backgroundColor: 'background-button-destructive-disabled',
          cursor: 'default'
        }
      }
    },
    size: {
      lg: {
        '--button-height': '{sizes.button-height-lg}',
        '--button-gap': '{spacing.2}',
        paddingInline: '5'
      },
      md: {
        '--button-height': '{sizes.button-height-md}',
        '--button-gap': '{spacing.2}',
        paddingInline: '4'
      },
      sm: {
        '--button-height': '{sizes.button-height-sm}',
        '--button-gap': '{spacing.2}',
        paddingInline: '3'
      },
      xs: {
        '--button-height': '{sizes.button-height-xs}',
        '--button-gap': '{spacing.1.5}',
        paddingInline: '2'
      },
      '2xs': {
        '--button-height': '{sizes.button-height-2xs}',
        '--button-gap': '{spacing.1}',
        paddingInline: '1'
      }
    }
  },

  defaultVariants: {
    variant: 'secondary',
    size: 'md'
  }
});
