import { styled } from '@buckethub/styled-system/jsx';

export const StyledList = styled('dl', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    containerType: 'inline-size',
    gap: '2.5'
  }
});

export const StyledItem = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'minmax(100px, token(sizes.xs)) repeat(2, 1fr)',
    rowGap: '0.5',
    columnGap: '0.5',

    '@container (max-width: token(sizes.xl))': {
      display: 'flex !important',
      flexDirection: 'column'
    }
  }
});

export const StyledTerm = styled('dt', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1',
    textStyle: 'body-medium',
    color: 'text-muted'
  }
});

export const StyledDescription = styled('dd', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gridColumn: '2 / 4',
    textStyle: 'body-medium-emphasized',
    color: 'text-base',
    width: '100%'
  }
});
