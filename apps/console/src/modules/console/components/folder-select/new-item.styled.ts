import { styled } from '@buckethub/styled-system/jsx';

export const StyledNewItem = styled('div', {
  base: {
    width: 'full',
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    paddingInline: '3',
    paddingBlock: '2',
    borderBottom: '1px solid {colors.border-input}'
  }
});
