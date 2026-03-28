import { Menu } from '@base-ui/react/menu';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledMenuTrigger = styled(Menu.Trigger, {
  base: {}
});

export const StyledMenuPortal = Menu.Portal;

export const StyledMenuBackdrop = styled(Menu.Backdrop, {
  base: {
    position: 'fixed',
    inset: '0',
    zIndex: '1000'
  }
});

export const StyledMenuPositioner = styled(Menu.Positioner, {
  base: {
    zIndex: '1001'
  }
});

export const StyledMenuPopup = styled(Menu.Popup, {
  base: {
    backgroundColor: 'background-base',
    border: 'base',
    borderRadius: 'lg',
    boxShadow: 'lg',
    outline: 'none',
    transform: 'scale(1)',
    transformOrigin: 'var(--transform-origin)',
    transition: 'all 0.2s {easings.ease-out-quint}',
    minWidth: '200px',
    padding: '1',

    '&[data-ending-style]': {
      opacity: '0',
      transform: 'scale(0.96)'
    },

    '&[data-starting-style]': {
      opacity: '0',
      transform: 'scale(0.96)'
    },

    '&[data-nested]': {
      '&[data-side="inline-start"]': {
        '&[data-align="start"]': {
          transform: 'translate(5px, -5px)'
        },

        '&[data-align="end"]': {
          transform: 'translate(5px, 5px)'
        }
      },

      '&[data-side="inline-end"]': {
        '&[data-align="start"]': {
          transform: 'translate(-5px, -4px)'
        },

        '&[data-align="end"]': {
          transform: 'translate(-5px, 4px)'
        }
      }
    }
  }
});

export const StyledMenuItem = styled(Menu.Item, {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    paddingInline: '2.5',
    paddingBlock: '2',
    borderRadius: 'md',
    textStyle: 'body-medium',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease-out',
    outline: 'none',

    '&:disabled': {
      opacity: '0.5',
      cursor: 'default',
      color: 'text-muted'
    }
  },

  variants: {
    variant: {
      default: {
        color: 'text-base',

        '&:hover:not(:disabled)': {
          backgroundColor: 'background-button-secondary-hover'
        },

        '&[data-highlighted]': {
          backgroundColor: 'background-button-secondary-hover'
        }
      },
      destructive: {
        color: 'text-base-error',

        '&:hover:not(:disabled)': {
          backgroundColor: 'background-surface-error'
        },

        '&[data-highlighted]': {
          backgroundColor: 'background-surface-error'
        }
      }
    }
  },

  defaultVariants: {
    variant: 'default'
  }
});

export const StyledMenuItemIndicator = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto'
  }
});

export const StyledMenuSeparator = styled(Menu.Separator, {
  base: {
    height: '1px',
    backgroundColor: 'border-input',
    marginBlock: '1'
  }
});

export const StyledMenuGroup = styled(Menu.Group, {
  base: {}
});

export const StyledMenuGroupLabel = styled(Menu.GroupLabel, {
  base: {
    paddingInline: '2.5',
    paddingBlock: '2',
    textStyle: 'body-small-emphasized',
    color: 'text-muted'
  }
});

export const StyledMenuSubmenuTrigger = styled(Menu.SubmenuTrigger, {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    paddingInline: '2.5',
    paddingBlock: '2',
    borderRadius: 'md',
    textStyle: 'body-medium',
    color: 'text-base',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease-out',
    outline: 'none',

    '& > .submenu-trigger-chevron': {
      color: 'text-muted',
      transition: 'color 0.1s ease-out'
    },

    '&:hover:not(:disabled)': {
      backgroundColor: 'background-button-secondary-hover'
    },

    '&[data-highlighted]': {
      backgroundColor: 'background-button-secondary-hover'
    },

    '&[data-popup-open]': {
      backgroundColor: 'background-button-secondary-hover',

      '& > .submenu-trigger-chevron': {
        color: 'text-base'
      }
    },

    '&:disabled': {
      opacity: '0.5',
      cursor: 'default',
      color: 'text-muted'
    }
  }
});

export const StyledMenuCheckboxItem = styled(Menu.CheckboxItem, {
  base: {
    display: 'grid',
    gap: '2',
    alignItems: 'center',
    gridTemplateColumns: '{spacing.3} 1fr',
    outline: '0',
    cursor: 'default',
    userSelect: 'none',
    paddingBlock: '2',
    paddingLeft: '1',
    paddingRight: '3',
    textStyle: 'body-medium',
    borderRadius: 'md',
    color: 'text-base',
    transition: 'background-color 0.1s ease-out',

    '&[data-disabled]': {
      opacity: '0.5',
      cursor: 'default',
      color: 'text-muted'
    },

    '&:hover:not(:disabled)': {
      backgroundColor: 'background-button-secondary-hover'
    },

    '&[data-highlighted]': {
      backgroundColor: 'background-button-secondary-hover'
    },

    '&:disabled': {
      opacity: '0.5',
      cursor: 'default',
      color: 'text-muted'
    }
  }
});

export const StyledCheckboxItemText = styled('div', {
  base: {
    display: 'flex',
    gap: '2',
    gridColumnStart: '2'
  }
});

export const StyledMenuCheckboxItemIndicator = styled(Menu.CheckboxItemIndicator, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4',
    height: '4',
    gridColumnStart: '1'
  }
});

export const StyledMenuRadioGroup = styled(Menu.RadioGroup, {
  base: {}
});

export const StyledMenuRadioItem = styled(Menu.RadioItem, {
  base: {
    display: 'grid',
    gap: '2',
    alignItems: 'center',
    gridTemplateColumns: '{spacing.3} 1fr',
    paddingRight: '3',
    paddingLeft: '1',
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

    '&:disabled': {
      opacity: '0.5',
      cursor: 'default',
      color: 'text-muted'
    }
  }
});

export const StyledRadioItemText = styled('div', {
  base: {
    display: 'flex',
    gap: '2',
    gridColumnStart: '2',
    alignItems: 'center'
  }
});

export const StyledMenuRadioItemIndicator = styled(Menu.RadioItemIndicator, {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4',
    height: '4',
    marginRight: '2'
  }
});

export const StyledMenuShortcut = styled('div', {
  base: {
    marginLeft: 'auto',
    textStyle: 'body-small',
    color: 'text-muted',
    letterSpacing: 'wider'
  }
});

export const StyledMenuViewport = styled(Menu.Viewport, {
  base: {}
});
