import { styled } from '@buckethub/styled-system/jsx';

export const StyledSecurityForm = styled('form', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8'
  }
});

export const StyledSection = styled('section', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6'
  }
});

export const StyledSectionHeader = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1'
  }
});

export const StyledSectionTitle = styled('h3', {
  base: {
    textStyle: 'title-medium',
    color: 'text-base'
  }
});

export const StyledSectionDescription = styled('p', {
  base: {
    textStyle: 'body-small-emphasized',
    color: 'text-muted'
  }
});

export const StyledSuccessMessage = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    padding: '3',
    borderRadius: 'md',
    backgroundColor: 'green.50',
    color: 'green.700',
    textStyle: 'body-small-emphasized',

    _dark: {
      backgroundColor: 'green.900/20',
      color: 'green.400'
    }
  }
});
