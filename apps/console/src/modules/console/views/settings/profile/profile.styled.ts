import { styled } from '@buckethub/styled-system/jsx';

export const StyledProfileForm = styled('form', {
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

export const StyledSectionFields = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6'
  }
});

export const StyledAvatarSection = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '4'
  }
});

export const StyledAvatarActions = styled('div', {
  base: {
    display: 'flex',
    gap: '2'
  }
});
