import { styled } from '@buckethub/styled-system/jsx';

export const StyledLayout = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    width: '100%',
    height: '100%',
    backgroundColor: 'background-base',

    lg: {
      gridTemplateColumns: '255px 1fr',
      backgroundColor: 'background-secondary'
    }
  }
});

export const StyledSidebarContainer = styled('div', {
  base: {
    lgDown: {
      display: 'none'
    }
  }
});

export const StyledContentContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'auto',

    lg: {
      paddingRight: '2',
      paddingBlock: '2'
    }
  }
});
