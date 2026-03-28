import { Select } from '@base-ui/react/select';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledSelectTrigger = styled(Select.Trigger, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2',
    height: '9',
    paddingInline: '4',
    backgroundColor: 'background-button-secondary',
    border: '1px solid {colors.border-button-secondary}',
    borderRadius: 'lg',
    textStyle: 'input',
    color: 'text-base',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease-out',

    '&:hover:not(:disabled)': {
      backgroundColor: 'background-button-secondary-hover'
    },

    '&:disabled': {
      backgroundColor: 'background-button-secondary-disabled',
      cursor: 'default',
      opacity: '0.5'
    },

    '&[data-open]': {
      backgroundColor: 'background-button-secondary-hover'
    }
  },

  variants: {
    variant: {
      default: {},
      error: {}
    }
  }
});

export const StyledSelectValue = styled(Select.Value, {
  base: {
    flex: '1',
    textAlign: 'left',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});

export const StyledSelectIcon = styled(Select.Icon, {
  base: {
    display: 'flex',
    alignItems: 'center',
    color: 'text-muted',
    marginRight: '-1',
    transition: 'transform 0.15s ease-out',

    '&[data-open]': {
      transform: 'rotate(180deg)'
    }
  }
});

export const StyledSelectPortal = Select.Portal;

export const StyledSelectBackdrop = styled(Select.Backdrop, {
  base: {
    position: 'fixed',
    inset: '0',
    zIndex: '1000'
  }
});

export const StyledSelectPositioner = styled(Select.Positioner, {
  base: {
    zIndex: '1001'
  }
});

export const StyledSelectPopup = styled(Select.Popup, {
  base: {
    backgroundColor: 'background-base',
    border: 'base',
    borderRadius: 'lg',
    boxShadow: 'lg',
    outline: 'none',
    transition: 'all 0.1s ease-out',
    minWidth: 'var(--anchor-width)',
    maxHeight: '300px',
    overflow: 'hidden',

    '&[data-ending-style]': {
      opacity: '0',
      transform: 'translateY(-4px)'
    },

    '&[data-starting-style]': {
      opacity: '0',
      transform: 'translateY(-4px)'
    }
  }
});

export const StyledSelectList = styled(Select.List, {
  base: {
    padding: '1',
    overflowY: 'auto',
    maxHeight: '300px'
  }
});

export const StyledSelectItem = styled(Select.Item, {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    paddingInline: '3',
    paddingBlock: '2',
    borderRadius: 'md',
    textStyle: 'body-medium',
    color: 'text-base',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease-out',
    outline: 'none',

    '&:hover:not(:disabled)': {
      backgroundColor: 'background-button-secondary-hover'
    },

    '&[data-highlighted]': {
      backgroundColor: 'background-button-secondary-hover'
    },

    '&[data-selected]': {
      backgroundColor: 'background-button-secondary'
    },

    '&:disabled': {
      opacity: '0.5',
      cursor: 'default'
    }
  }
});

export const StyledSelectItemText = styled(Select.ItemText, {
  base: {
    flex: '1'
  }
});

export const StyledSelectItemIndicator = styled(Select.ItemIndicator, {
  base: {
    display: 'flex',
    alignItems: 'center',
    color: 'text-accent'
  }
});

export const StyledSelectGroup = styled(Select.Group, {
  base: {}
});

export const StyledSelectGroupLabel = styled(Select.GroupLabel, {
  base: {
    paddingInline: '3',
    paddingBlock: '2',
    textStyle: 'body-small-emphasized',
    color: 'text-muted'
  }
});

export const StyledSelectSeparator = styled(Select.Separator, {
  base: {
    height: '1px',
    backgroundColor: 'border-base',
    marginBlock: '1'
  }
});

export const StyledSelectScrollUpArrow = styled(Select.ScrollUpArrow, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '6',
    backgroundColor: 'background-base',
    color: 'text-muted',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: 'background-button-secondary-hover'
    }
  }
});

export const StyledSelectScrollDownArrow = styled(Select.ScrollDownArrow, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '6',
    backgroundColor: 'background-base',
    color: 'text-muted',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: 'background-button-secondary-hover'
    }
  }
});

export const StyledSelectLabel = styled(Select.Label, {
  base: {
    marginBottom: '2',
    width: 'fit-content',
    textStyle: 'body-large-emphasized',
    color: 'text-base',
    cursor: 'pointer'
  }
});
