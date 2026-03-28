import { styled } from '@buckethub/styled-system/jsx';

export const StyledBucket = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5',
    border: 'base',
    borderRadius: 'xl',
    padding: '3',
    backgroundColor: 'background-base',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease-out'
  },

  variants: {
    active: {
      true: {
        borderColor: 'border-active'
      }
    }
  }
});
