import { styled } from '@buckethub/styled-system/jsx';

export const StyledAlert = styled('div', {
  base: {
    display: 'flex',
    gap: '3',
    padding: '3',
    borderRadius: 'lg',
    border: 'base',
    textStyle: 'body-medium'
  },
  variants: {
    variant: {
      error: {
        backgroundColor: 'background-surface-error',
        borderColor: 'border-error',
        color: 'text-base-error'
      },
      warning: {
        backgroundColor: 'background-surface-warning',
        borderColor: 'border-warning',
        color: 'text-base-warning'
      },
      info: {
        backgroundColor: 'background-surface-info',
        borderColor: 'border-info',
        color: 'text-base-info'
      },
      success: {
        backgroundColor: 'background-surface-success',
        borderColor: 'border-success',
        color: 'text-base-success'
      }
    }
  },
  defaultVariants: {
    variant: 'error'
  }
});

export const StyledAlertIcon = styled('div', {
  base: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '0.5'
  }
});

export const StyledAlertContent = styled('div', {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1'
  }
});

export const StyledAlertTitle = styled('div', {
  base: {
    textStyle: 'body-large-emphasized'
  }
});

export const StyledAlertDescription = styled('div', {
  base: {
    textStyle: 'body-medium'
  }
});
