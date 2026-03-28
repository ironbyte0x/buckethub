import { Avatar } from '@base-ui/react/avatar';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledAvatarRoot = styled(Avatar.Root, {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: 'background-button-secondary',
    border: 'base',
    color: 'text-muted'
  },
  variants: {
    size: {
      sm: {
        width: '8',
        height: '8',
        textStyle: 'body-medium',
        borderRadius: 'md'
      },
      md: {
        width: '9',
        height: '9',
        textStyle: 'body-large',
        borderRadius: 'lg'
      },
      lg: {
        width: '10',
        height: '10',
        textStyle: 'body-large',
        borderRadius: 'lg'
      },
      xl: {
        width: '12',
        height: '12',
        textStyle: 'heading-medium',
        borderRadius: 'xl'
      },
      '2xl': {
        width: '14',
        height: '14',
        textStyle: 'heading-large',
        borderRadius: 'xl'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const StyledAvatarImage = styled(Avatar.Image, {
  base: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
});

export const StyledAvatarFallback = styled(Avatar.Fallback, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontWeight: 'medium',
    textTransform: 'uppercase'
  }
});
