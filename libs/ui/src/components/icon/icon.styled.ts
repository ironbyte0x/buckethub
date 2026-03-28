import { styled } from '@buckethub/styled-system/jsx';

export const StyledIcon = styled('i', {
  base: {
    flexShrink: 0
  },
  variants: {
    color: {
      base: {
        color: 'text-base'
      },
      neutral: {
        color: 'text-muted'
      },
      success: {
        color: 'success'
      },
      info: {
        color: 'info'
      },
      warning: {
        color: 'warning'
      },
      error: {
        color: 'error.500'
      }
    },
    size: {
      '4xl': {
        height: '2.25rem', // 36px
        width: '2.25rem' // 36px
      },
      '3xl': {
        height: '2rem', // 32px
        width: '2rem' // 32px
      },
      '2xl': {
        height: '1.8rem', // 28px
        width: '1.8rem' // 28px
      },
      xl: {
        height: '1.5rem', // 24px
        width: '1.5rem' // 24px
      },
      lg: {
        height: '1.25rem', // 20px
        width: '1.25rem' // 20px
      },
      md: {
        height: '1rem', // 16px
        width: '1rem' // 16px
      },
      sm: {
        height: '0.875rem', // 14px
        width: '0.875rem' // 14px
      },
      xs: {
        height: '0.75rem', // 12px
        width: '0.75rem' // 12px
      },
      '2xs': {
        height: '0.625rem', // 10px
        width: '0.625rem' // 10px
      }
    },
    fillCurrent: {
      true: {
        fill: 'currentColor'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    fillCurrent: false
  }
});
