import { styled } from '@buckethub/styled-system/jsx';

export const StyledBadge = styled('span', {
  base: {
    display: 'inline-flex',
    gap: '0.5',
    alignItems: 'center',
    borderRadius: 'lg',
    width: 'fit-content',
    height: 'fit-content',
    whiteSpace: 'nowrap'
  },
  variants: {
    variant: {
      primary: {
        color: 'text-button-primary',
        backgroundColor: 'background-button-primary'
      },
      secondary: {
        color: 'text-muted',
        backgroundColor: 'background-button-secondary',
        border: '1px solid {colors.border-button-secondary}'
      }
    },
    size: {
      sm: {
        paddingBlock: '0.5',
        paddingInline: '2',
        textStyle: 'body-xsmall-emphasized'
      },
      md: {
        paddingBlock: '1',
        paddingInline: '2',
        textStyle: 'body-small-emphasized'
      }
    }
  },

  defaultVariants: {
    size: 'sm'
  }
});
