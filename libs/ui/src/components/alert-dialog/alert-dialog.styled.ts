import { AlertDialog } from '@base-ui/react/alert-dialog';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledAlertDialogTrigger = styled(AlertDialog.Trigger, {
  base: {}
});

export const StyledAlertDialogBackdrop = styled(AlertDialog.Backdrop, {
  base: {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '1000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s {easings.ease-out-quart}',

    '&[data-starting-style], &[data-ending-style]': {
      opacity: '0'
    }
  }
});

export const StyledAlertDialogPopup = styled(AlertDialog.Popup, {
  base: {
    display: 'flex',
    position: 'fixed',
    top: '50%',
    left: '50%',
    flexDirection: 'column',
    transform: 'translate(-50%, -50%) scale(1)',
    backgroundColor: 'background-base',
    opacity: '1',
    border: 'base',
    borderRadius: '2xl',
    boxShadow: 'lg',
    maxWidth: 'min({sizes.md}, calc(100dvw - {spacing.4}))',
    width: 'full',
    maxHeight: '90dvh',
    outline: 'none',
    transition: 'all 0.3s {easings.ease-out-quart}',
    zIndex: '1001',

    '&[data-starting-style], &[data-ending-style]': {
      opacity: '0',
      transform: 'translate(-50%, -48%) scale(0.96)'
    }
  }
});

export const StyledIconContainer = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gridArea: 'icon',
    color: 'text-muted',
    width: '10',
    height: '10',
    padding: '2',
    border: 'base',
    borderRadius: 'full',

    '& svg:not([data-size])': {
      width: '5',
      height: '5'
    }
  }
});

export const StyledAlertDialogTitle = styled(AlertDialog.Title, {
  base: {
    gridArea: 'title',
    textStyle: 'title-medium',
    color: 'text-base'
  }
});

export const StyledAlertDialogDescription = styled(AlertDialog.Description, {
  base: {
    gridArea: 'description',
    textStyle: 'body-large',
    color: 'text-muted'
  }
});

export const StyledAlertDialogClose = styled(AlertDialog.Close, {
  base: {}
});

export const StyledAlertDialogHeader = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: '1fr min-content',
    gridTemplateAreas: `
          "title close"
          "description description"
        `,
    columnGap: '4',
    rowGap: '1.5',
    padding: '5',

    '&:has([data-slot="icon-container"])': {
      gridTemplateColumns: 'min-content 1fr min-content',
      gridTemplateAreas: `
          "icon title close"
          "icon description description"
        `
    }
  }
});

export const StyledAlertDialogBody = styled('div', {
  base: {
    flex: '1',
    padding: '5',
    overflowY: 'auto'
  }
});

export const StyledAlertDialogFooter = styled('div', {
  base: {
    display: 'flex',
    gap: '2.5',
    justifyContent: 'flex-end',
    paddingInline: '5',
    paddingBottom: '5'
  }
});
