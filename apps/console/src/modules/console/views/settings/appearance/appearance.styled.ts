import { styled } from '@buckethub/styled-system/jsx';

export const StyledAppearanceSection = styled('section', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4'
  }
});

export const StyledSectionTitle = styled('h2', {
  base: {
    textStyle: 'body-large-emphasized',
    color: 'text-base',
    marginBottom: '2'
  }
});

export const StyledThemeOptions = styled('div', {
  base: {
    display: 'flex',
    gap: '4'
  }
});

export const StyledThemeOption = styled('button', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2',
    padding: '4',
    borderRadius: 'lg',
    border: '1px solid',
    borderColor: 'border-input',
    backgroundColor: 'background-surface',
    cursor: 'pointer',
    transition: 'all 0.1s ease-out',
    minWidth: '24',

    '&:hover': {
      borderColor: 'border-input-focus'
    }
  },
  variants: {
    selected: {
      true: {
        borderColor: 'border-button-primary',
        backgroundColor: 'background-button-primary/10'
      }
    }
  }
});

export const StyledThemePreview = styled('div', {
  base: {
    width: '16',
    height: '12',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'border-base'
  },
  variants: {
    theme: {
      light: {
        backgroundColor: 'white'
      },
      dark: {
        backgroundColor: '#18181b'
      },
      system: {
        background: 'linear-gradient(135deg, white 50%, #18181b 50%)'
      }
    }
  }
});

export const StyledThemeLabel = styled('span', {
  base: {
    textStyle: 'body-small-emphasized',
    color: 'text-base'
  }
});
