import { Combobox } from '@base-ui/react/combobox';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledComboboxTriggerContainer = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2',
    minHeight: '9',
    backgroundColor: 'background-button-secondary',
    border: '1px solid {colors.border-button-secondary}',
    borderRadius: 'lg',
    textStyle: 'input',
    color: 'text-base',
    cursor: 'pointer',
    transition: 'background-color 0.3s {easings.ease-out-quart}',

    '&:hover:not(:disabled)': {
      backgroundColor: 'background-button-secondary-hover'
    },

    '&:disabled': {
      backgroundColor: 'background-button-secondary-disabled',
      cursor: 'default',
      opacity: '0.5'
    },

    '&:has([data-slot="combobox-chips"])': {
      paddingLeft: '2',

      '& input': {
        paddingLeft: '2'
      }
    },

    '&:not(:has([data-slot="combobox-chips"])):not(:has(input))': {
      paddingLeft: '4'
    }
  },

  variants: {
    variant: {
      default: {},
      error: {
        borderColor: 'border-error'
      }
    }
  },

  defaultVariants: {
    variant: 'default'
  }
});

export const StyledTrigger = styled(Combobox.Trigger, {
  base: {
    display: 'flex',
    alignItems: 'center'
  }
});

export const StyledComboboxValue = styled(Combobox.Value, {
  base: {}
});

export const StyledComboboxIcon = styled(Combobox.Icon, {
  base: {
    display: 'flex',
    alignItems: 'center',
    color: 'text-muted',
    paddingInline: '3',
    transition: 'transform 0.15s ease-out',

    '&[data-popup-open]': {
      transform: 'rotate(180deg)'
    }
  }
});

export const StyledComboboxInput = styled(Combobox.Input, {
  base: {
    flex: '1',
    height: '100%',
    paddingInline: '4',
    color: 'text-base',
    textStyle: 'body-medium',
    outline: 'none',
    transition: 'all 0.3s {easings.ease-out-quart}',

    '&::placeholder': {
      color: 'text-placeholder'
    },

    '&:disabled': {
      cursor: 'default',
      opacity: '0.5'
    }
  },

  variants: {
    variant: {
      default: {
        width: 'auto',
        flex: '1',
        minWidth: '80px',
        border: 'none',
        borderRadius: '0',
        backgroundColor: 'transparent',

        '&:focus': {
          borderColor: 'transparent',
          boxShadow: 'none'
        }
      },
      popup: {
        paddingBlock: '3',
        borderBottom: 'base'
      }
    }
  },

  defaultVariants: {
    variant: 'default'
  }
});

export const StyledComboboxClear = styled(Combobox.Clear, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text-muted',
    cursor: 'pointer',
    transition: 'color 0.1s ease-out',

    '&:hover': {
      color: 'text-base'
    },

    '&:disabled': {
      cursor: 'default',
      opacity: '0.5'
    }
  }
});

export const StyledComboboxChips = styled(Combobox.Chips, {
  base: {
    display: 'flex',
    gap: '1',
    paddingBlock: '1.5',
    width: 'fit-content',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
});

export const StyledComboboxChip = styled(Combobox.Chip, {
  base: {
    width: 'fit-content',
    height: 'fit-content'
  }
});

export const StyledComboboxChipRemove = styled(Combobox.ChipRemove, {
  base: {}
});

export const StyledComboboxPortal = Combobox.Portal;

export const StyledComboboxBackdrop = styled(Combobox.Backdrop, {
  base: {
    position: 'fixed',
    inset: '0',
    zIndex: '1000'
  }
});

export const StyledComboboxPositioner = styled(Combobox.Positioner, {
  base: {
    zIndex: 1001
  }
});

export const StyledComboboxPopup = styled(Combobox.Popup, {
  base: {
    backgroundColor: 'background-base',
    border: 'base',
    borderRadius: 'lg',
    boxShadow: 'lg',
    outline: 'none',
    transform: 'scale(1)',
    transformOrigin: 'var(--transform-origin)',
    transition: 'all 0.2s {easings.ease-out-quint}',

    '&[data-ending-style]': {
      opacity: 0,
      transform: 'scale(0.96)'
    },

    '&[data-starting-style]': {
      opacity: 0,
      transform: 'scale(0.96)'
    }
  }
});

export const StyledComboboxList = styled(Combobox.List, {
  base: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxHeight: '300px',
    padding: '1'
  }
});

export const StyledComboboxItem = styled(Combobox.Item, {
  base: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '{spacing.3} 1fr',
    gap: '2',
    paddingInline: '2.5',
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
      opacity: 0.5,
      cursor: 'default',
      color: 'text-muted'
    }
  }
});

export const StyledComboboxItemText = styled('span', {
  base: {
    flex: '1',
    gridColumnStart: '2'
  }
});

export const StyledComboboxItemIndicator = styled(Combobox.ItemIndicator, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3',
    height: '4',
    gridColumnStart: '1'
  }
});

export const StyledComboboxEmpty = styled('div', {
  base: {
    padding: '3',
    color: 'text-muted',
    textStyle: 'body-medium',
    lineHeight: '1.2rem',
    textAlign: 'center'
  }
});

export const StyledComboboxGroup = styled(Combobox.Group, {
  base: {}
});

export const StyledComboboxGroupLabel = styled(Combobox.GroupLabel, {
  base: {
    paddingInline: '3',
    paddingBlock: '2',
    textStyle: 'body-small-emphasized',
    color: 'text-muted'
  }
});

export const StyledComboboxSeparator = styled(Combobox.Separator, {
  base: {
    height: '1px',
    backgroundColor: 'border-base',
    marginBlock: '1'
  }
});

export const StyledComboboxLabel = styled(Combobox.Label, {
  base: {
    marginBottom: '2',
    width: 'fit-content',
    textStyle: 'body-large-emphasized',
    color: 'text-base',
    cursor: 'pointer'
  }
});

export const StyledComboboxInputGroup = styled(Combobox.InputGroup, {
  base: {}
});
