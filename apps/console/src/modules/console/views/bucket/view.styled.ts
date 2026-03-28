import { styled } from '@buckethub/styled-system/jsx';

export const StyledContainer = styled('div', {
  base: {
    position: 'relative',
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    width: '100%',
    minWidth: '0',

    '&::after': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'background-button-primary/10',
      border: '2px dashed',
      borderColor: 'border-button-primary',
      borderRadius: 'lg',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.15s ease-out',
      zIndex: '10'
    }
  },

  variants: {
    dragging: {
      true: {
        '&::after': {
          opacity: '1',
          pointerEvents: 'all'
        }
      }
    }
  }
});
