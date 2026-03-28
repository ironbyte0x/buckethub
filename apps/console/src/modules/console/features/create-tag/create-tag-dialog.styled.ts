import { Dialog } from '@base-ui/react/dialog';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledDialogBackdrop = styled(Dialog.Backdrop, {
  base: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    '&[data-starting-style], &[data-ending-style]': {
      animation: 'fadeIn 0.2s'
    }
  }
});

export const StyledDialogPopup = styled(Dialog.Popup, {
  base: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '450px',
    backgroundColor: 'background-surface',
    border: 'base',
    borderRadius: 'lg',
    boxShadow: 'lg',
    padding: '6',
    zIndex: 1001,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '4'
  }
});

export const StyledDialogTitle = styled(Dialog.Title, {
  base: {
    fontSize: 'xl',
    fontWeight: 'semibold',
    color: 'text-base',
    margin: 0
  }
});

export const StyledDialogDescription = styled(Dialog.Description, {
  base: {
    fontSize: 'md',
    color: 'text-muted',
    margin: 0
  }
});

export const StyledDialogInput = styled('input', {
  base: {
    width: '100%',
    height: '9',
    paddingInline: '3',
    paddingBlock: '2',
    borderRadius: 'lg',
    border: 'base',
    backgroundColor: 'background-input',
    color: 'text-base',
    fontSize: 'md',
    lineHeight: '1.5',
    outline: 'none',
    transition: 'all 0.2s',
    '&:focus': {
      borderColor: 'border-input-focus',
      boxShadow: '0 0 0 3px {colors.border-input-focus/20}'
    },
    '&::placeholder': {
      color: 'text-placeholder'
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  }
});

export const StyledDialogButton = styled('button', {
  base: {
    height: '9',
    paddingInline: '4',
    borderRadius: 'lg',
    fontSize: 'md',
    fontWeight: 'medium',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    border: 'none',
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'background-button-primary',
        color: 'text-on-primary',
        '&:hover:not(:disabled)': {
          backgroundColor: 'background-button-primary-hover'
        }
      },
      secondary: {
        backgroundColor: 'background-button-secondary',
        color: 'text-base',
        border: 'base',
        '&:hover:not(:disabled)': {
          backgroundColor: 'background-button-secondary-hover'
        }
      }
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
});
