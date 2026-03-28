import { styled } from '@buckethub/styled-system/jsx';

export const StyledAuthPage = styled('div', {
  base: {
    display: 'flex',
    minHeight: '100vh'
  }
});

export const StyledHeroPanel = styled('div', {
  base: {
    display: 'none',
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '12',
    backgroundColor: 'background-button-primary',
    color: 'text-button-primary',

    md: {
      display: 'flex',
      width: '50%'
    },

    lg: {
      padding: '16'
    },

    _before: {
      content: '""',
      position: 'absolute',
      width: '500px',
      height: '500px',
      borderRadius: 'full',
      border: '60px solid',
      borderColor: 'text-button-primary',
      opacity: 0.04,
      top: '-150px',
      right: '-100px'
    },

    _after: {
      content: '""',
      position: 'absolute',
      width: '350px',
      height: '350px',
      borderRadius: 'full',
      border: '40px solid',
      borderColor: 'text-button-primary',
      opacity: 0.04,
      bottom: '-80px',
      left: '-50px'
    }
  }
});

export const StyledHeroContent = styled('div', {
  base: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '400px',
    marginInline: 'auto'
  }
});

export const StyledHeroBrand = styled('span', {
  base: {
    fontSize: '1.125rem',
    fontWeight: '600',
    letterSpacing: '-0.01em'
  }
});

export const StyledHeroTitle = styled('h1', {
  base: {
    fontSize: '2rem',
    fontWeight: '600',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    marginBottom: '3'
  }
});

export const StyledHeroDescription = styled('p', {
  base: {
    fontSize: '0.9375rem',
    lineHeight: '1.6',
    opacity: 0.6
  }
});

export const StyledFormPanel = styled('div', {
  base: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6',
    backgroundColor: 'background-base',

    md: {
      padding: '12'
    }
  }
});

export const StyledFormCard = styled('div', {
  base: {
    width: 'full',
    maxWidth: 'sm'
  }
});

export const StyledFormHeader = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    marginBottom: '8',

    md: {
      textAlign: 'left',
      alignItems: 'flex-start'
    }
  }
});

export const StyledIcon = styled('div', {
  base: {
    width: '14',
    height: '14',
    borderRadius: '2xl',
    backgroundColor: 'background-button-primary',
    color: 'text-button-primary',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5',

    md: {
      display: 'none'
    }
  }
});
