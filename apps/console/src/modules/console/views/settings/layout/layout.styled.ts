import { styled } from '@buckethub/styled-system/jsx';

export const StyledSettingsContent = styled('div', {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4',
    paddingInline: '3',
    paddingBlock: '4',

    md: {
      flexDirection: 'row',
      gap: '8',
      paddingInline: '6'
    }
  }
});

export const StyledSettingsNav = styled('nav', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1',
    overflowX: 'auto',

    md: {
      flexDirection: 'column',
      width: '48',
      flexShrink: 0
    }
  }
});

export const StyledSettingsNavItem = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    whiteSpace: 'nowrap',
    paddingInline: '3',
    paddingBlock: '2',
    borderRadius: 'md',
    textStyle: 'body-medium',
    color: 'text-muted',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.1s ease-out',

    md: {
      width: '100%'
    }
  },
  variants: {
    active: {
      true: {
        backgroundColor: 'background-button-primary',
        color: 'text-button-primary'
      },
      false: {
        '&:hover': {
          backgroundColor: 'background-button-secondary-hover',
          color: 'text-base'
        }
      }
    }
  }
});

export const StyledSettingsPanel = styled('div', {
  base: {
    flex: 1,
    maxWidth: 'md'
  }
});
