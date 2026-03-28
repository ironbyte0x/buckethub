import { Toast } from '@base-ui/react/toast';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledToastViewport = styled(Toast.Viewport, {
  base: {
    position: 'fixed',
    bottom: '4',
    right: '4',
    display: 'flex',
    flexDirection: 'column',
    gap: '3',
    width: 'sm',
    maxWidth: 'calc(100vw - {spacing.8})',
    zIndex: '1001',
    outline: 'none'
  }
});

export const StyledToastRoot = styled(Toast.Root, {
  base: {
    position: 'relative',
    display: 'flex',
    transition: 'all 0.3s ease-out',
    transformOrigin: 'bottom right',

    '&[data-starting-style]': {
      opacity: '0',
      transform: 'translateX(calc(100% + {spacing.4}))'
    },

    '&[data-ending-style]': {
      opacity: '0',
      transform: 'translateX(calc(100% + {spacing.4}))'
    },

    '&[data-swipe-direction="right"]': {
      transform: 'translateX(var(--toast-swipe-movement-x))'
    },

    '&[data-swipe-direction="down"]': {
      transform: 'translateY(var(--toast-swipe-movement-y))'
    }
  }
});

export const StyledToastContent = styled(Toast.Content, {
  base: {
    display: 'flex',
    gap: '3',
    width: 'full',
    padding: '3',
    borderRadius: 'lg',
    border: 'base',
    backgroundColor: 'background-surface',
    boxShadow: 'lg',
    textStyle: 'body-medium'
  },
  variants: {
    variant: {
      default: {
        backgroundColor: 'background-base',
        borderColor: 'border-base',
        color: 'text-base'
      },
      success: {
        backgroundColor: 'background-base',
        borderColor: 'border-base',
        color: 'text-base',

        '& [data-slot="toast-type-icon"]': {
          color: 'text-base-success'
        }
      },
      error: {
        backgroundColor: 'background-base',
        borderColor: 'border-base',
        color: 'text-base',

        '& [data-slot="toast-type-icon"]': {
          color: 'text-base-error'
        }
      },
      warning: {
        backgroundColor: 'background-base',
        borderColor: 'border-base',
        color: 'text-base',

        '& [data-slot="toast-type-icon"]': {
          color: 'text-base-warning'
        }
      },
      info: {
        backgroundColor: 'background-base',
        borderColor: 'border-base',
        color: 'text-base',

        '& [data-slot="toast-type-icon"]': {
          color: 'text-base-info'
        }
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export const StyledToastIcon = styled('div', {
  base: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '0.5'
  }
});

export const StyledToastBody = styled('div', {
  base: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1'
  }
});

export const StyledToastTitle = styled(Toast.Title, {
  base: {
    textStyle: 'body-medium-emphasized'
  }
});

export const StyledToastDescription = styled(Toast.Description, {
  base: {
    textStyle: 'body-small',
    color: 'text-muted'
  }
});

export const StyledToastClose = styled(Toast.Close, {
  base: {
    position: 'absolute',
    top: '2',
    right: '2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '6',
    height: '6',
    borderRadius: 'sm',
    color: 'text-muted',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease-out',

    '&:hover': {
      backgroundColor: 'background-button-secondary-hover'
    }
  }
});

export const StyledToastAction = styled(Toast.Action, {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '7',
    paddingInline: '2.5',
    borderRadius: 'md',
    textStyle: 'body-small-emphasized',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease-out',
    backgroundColor: 'background-button-secondary',
    border: 'base',

    '&:hover': {
      backgroundColor: 'background-button-secondary-hover'
    }
  }
});
