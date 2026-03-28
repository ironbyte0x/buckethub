import { styled } from '@buckethub/styled-system/jsx';

export const StyledClose = styled('div', {
  base: {
    position: 'absolute',
    display: 'flex',
    right: '4',
    top: '0',
    width: '6',
    height: '6',
    justifyContent: 'center',
    alignItems: 'center',
    outline: 'unset',
    transition: 'all',
    cursor: 'pointer',

    '&:hover': {
      opacity: '1'
    },

    '&:disabled': {
      pointerEvents: 'none'
    }
  }
});
