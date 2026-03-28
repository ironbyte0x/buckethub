import { Dialog } from '@base-ui/react/dialog';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledDialogTrigger = styled(Dialog.Trigger, {
  base: {}
});

export const StyledDialogBackdrop = styled(Dialog.Backdrop, {
  base: {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '1000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s {easings.ease-out-quart}',

    '&[data-ending-style]': {
      opacity: '0'
    },

    '&[data-starting-style]': {
      opacity: '0'
    }
  }
});

export const StyledDialogPopup = styled(Dialog.Popup, {
  base: {
    display: 'flex',
    position: 'fixed',
    top: '50%',
    left: '50%',
    flexDirection: 'column',
    transform: 'translate(-50%, -50%) scale(calc(1 - 0.1 * var(--nested-dialogs)))',
    backgroundColor: 'background-base',
    border: 'base',
    borderRadius: '2xl',
    boxShadow: 'lg',
    maxWidth: 'min({sizes.md}, calc(100dvw - {spacing.4}))',
    width: 'full',
    maxHeight: '90dvh',
    outline: 'none',
    transition: 'all 0.3s {easings.ease-out-quart}',
    zIndex: '1001',

    '&[data-nested-dialog-open]': {
      '&::after': {
        content: '""',
        inset: '0',
        position: 'absolute',
        borderRadius: 'inherit',
        backgroundColor: 'rgb(0 0 0 / 0.05)'
      }
    },

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

export const StyledDialogTitle = styled(Dialog.Title, {
  base: {
    gridArea: 'title',
    textStyle: 'body-large-emphasized',
    color: 'text-base'
  }
});

export const StyledDialogDescription = styled(Dialog.Description, {
  base: {
    gridArea: 'description',
    textStyle: 'body-medium',
    color: 'text-muted'
  }
});

export const StyledDialogClose = styled(Dialog.Close, {
  base: {}
});

export const StyledDialogHeader = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: '1fr min-content',
    gridTemplateAreas: `
          "title close"
          "description description"
        `,
    columnGap: '4',
    rowGap: '1',
    padding: '5',
    borderBottom: 'base',

    '&:has([data-slot="icon-container"])': {
      gridTemplateColumns: 'min-content 1fr min-content',
      gridTemplateAreas: `
          "icon title close"
          "icon description description"
        `,
      gridTemplateRows: '{spacing.5} 1fr'
    }
  }
});

export const StyledDialogBody = styled('div', {
  base: {
    flex: '1',
    padding: '5',
    overflowY: 'auto'
  }
});

export const StyledDialogFooter = styled('div', {
  base: {
    display: 'flex',
    gap: '2.5',
    justifyContent: 'flex-end',
    padding: '5',
    borderTop: 'base'
  }
});
