import { styled } from '@buckethub/styled-system/jsx';

export const StyledSidebar = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    maxHeight: '100dvh',
    paddingBlock: '5',
    paddingInline: '4',
    backgroundColor: 'background-secondary'
  }
});
