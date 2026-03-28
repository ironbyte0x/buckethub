import { styled } from '@buckethub/styled-system/jsx';

export const StyledProgressTrack = styled('div', {
  base: {
    width: '100%',
    height: '5px',
    backgroundColor: 'border-base',
    borderRadius: 'full',
    overflow: 'hidden',
    marginTop: '2'
  }
});

export const StyledProgressIndicator = styled('div', {
  base: {
    height: '100%',
    borderRadius: 'full',
    transition: 'width 0.3s ease'
  },

  variants: {
    variant: {
      default: {
        backgroundColor: 'background-button-primary'
      },
      warning: {
        backgroundColor: 'warning.500'
      },
      destructive: {
        backgroundColor: 'error.500'
      }
    }
  }
});
