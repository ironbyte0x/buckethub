import { styled } from '@buckethub/styled-system/jsx';

export const StyledItem = styled('button', {
  base: {
    width: 'full',
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    paddingInline: '3',
    paddingBlock: '3',
    textAlign: 'left',
    cursor: 'pointer',
    borderBottom: '1px solid {colors.border-input}',
    backgroundColor: 'transparent',
    transition: 'background-color 0.15s',

    '&:hover': {
      backgroundColor: 'background-surface'
    },

    '&:last-child': {
      borderBottom: 'none'
    }
  }
});
