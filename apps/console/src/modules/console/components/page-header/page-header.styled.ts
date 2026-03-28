import { styled } from '@buckethub/styled-system/jsx';

export const StyledContainer = styled('header', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4',
    paddingBottom: '2',
    paddingInline: 'var(--view-inline-padding)',

    lg: {
      paddingBlock: '4'
    }
  }
});

export const StyledInfoContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px'
  }
});

export const StyledActionsContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '2'
  }
});

export const StyledTitle = styled('h1', {
  base: {
    color: 'text-base',
    textStyle: 'title-large'
  }
});

export const StyledSubtitle = styled('p', {
  base: {
    color: 'text-muted',
    textStyle: 'subtitle-large'
  }
});
