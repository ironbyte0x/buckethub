import { styled } from '@buckethub/styled-system/jsx';

export const StyledInputGroup = styled('div', {
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: 'full',
    minWidth: '0',
    border: '1px solid {colors.border-input}',
    borderRadius: 'lg',
    overflow: 'hidden',
    transition: 'border-color 0.15s ease-out, box-shadow 0.15s ease-out',

    // Focus state - when input inside is focused
    '&:has([data-slot="input-group-control"]:focus)': {
      borderColor: 'border-input-focus',
      boxShadow: '0 0 0 3px {colors.border-input-focus/20}',
      outline: 'none'
    },

    // Error state - when input has aria-invalid
    '&:has([aria-invalid="true"])': {
      borderColor: 'border-error'
    },

    '&:has([aria-invalid="true"]:focus)': {
      borderColor: 'border-error',
      boxShadow: '0 0 0 3px {colors.border-error/20}'
    },

    // Auto height for textarea
    '&:has(textarea)': {
      height: 'auto',
      alignItems: 'stretch'
    },

    // Flex column when block-start or block-end addon is present
    '&:has([data-align="block-start"])': {
      height: 'auto',
      flexDirection: 'column'
    },

    '&:has([data-align="block-end"])': {
      height: 'auto',
      flexDirection: 'column'
    },

    // Disabled state
    '&:has([data-slot="input-group-control"]:disabled)': {
      opacity: '0.5',
      cursor: 'not-allowed'
    },

    // Reduce input padding when inline-start addon is present
    '&:has([data-align="inline-start"]) [data-slot="input-group-control"]': {
      paddingInlineStart: '2'
    },

    // Reduce input padding when inline-end addon is present
    '&:has([data-align="inline-end"]) [data-slot="input-group-control"]': {
      paddingInlineEnd: '2'
    },

    // Adjust input padding when block-start addon is present
    '&:has([data-align="block-start"]) input[data-slot="input-group-control"]': {
      paddingTop: '2.5'
    },

    // Adjust textarea padding when block-start addon is present
    '&:has([data-align="block-start"]) textarea[data-slot="input-group-control"]': {
      paddingTop: '2.5'
    },

    // Adjust input padding when block-end addon is present
    '&:has([data-align="block-end"]) input[data-slot="input-group-control"]': {
      paddingBottom: '2.5'
    },

    // Adjust textarea padding when block-end addon is present
    '&:has([data-align="block-end"]) textarea[data-slot="input-group-control"]': {
      paddingBottom: '2.5'
    }
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'transparent'
      },
      secondary: {
        backgroundColor: 'background-input'
      }
    },
    size: {
      md: {
        height: '9',

        '& [data-slot="input-group-control"]': {
          paddingInline: '3'
        }
      },
      lg: {
        height: '10',

        '& [data-slot="input-group-control"]': {
          paddingInline: '4'
        }
      }
    }
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
});

export const StyledInputGroupAddon = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    paddingBlock: '1.5',
    color: 'text-muted',
    textStyle: 'input',
    whiteSpace: 'nowrap',
    cursor: 'text',
    userSelect: 'none',
    height: 'auto',

    '& svg:not([data-size])': {
      width: '4',
      height: '4'
    }
  },

  variants: {
    align: {
      'inline-start': {
        order: '-1',
        paddingInlineStart: '3',
        paddingInlineEnd: '0'
      },
      'inline-end': {
        order: '999',
        paddingInlineStart: '0',
        paddingInlineEnd: '3'
      },
      'block-start': {
        order: '-1',
        width: 'full',
        justifyContent: 'flex-start',
        paddingTop: '3',
        paddingInline: '3',
        borderBottom: '1px solid {colors.border-input}'
      },
      'block-end': {
        order: '999',
        width: 'full',
        justifyContent: 'flex-start',
        paddingBottom: '3',
        paddingInline: '3',
        borderTop: '1px solid {colors.border-input}'
      }
    }
  },

  defaultVariants: {
    align: 'inline-start'
  }
});

export const StyledInputGroupInput = styled('input', {
  base: {
    flex: '1',
    minWidth: '0',
    height: 'full',
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    textStyle: 'input',
    color: 'text-base',
    outline: 'none',

    '&::placeholder': {
      color: 'text-placeholder'
    },

    '&:disabled': {
      cursor: 'not-allowed'
    },

    '&:focus': {
      boxShadow: 'none'
    },

    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
      boxShadow: '0 0 0 1000px {colors.background-input} inset !important',
      WebkitTextFillColor: '{colors.text-base} !important',
      caretColor: '{colors.text-base} !important',
      transition: 'background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s !important'
    }
  }
});

export const StyledInputGroupTextarea = styled('textarea', {
  base: {
    flex: '1',
    minWidth: '0',
    minHeight: '20',
    paddingBlock: '3',
    border: 'none',
    backgroundColor: 'transparent',
    textStyle: 'input',
    color: 'text-base',
    outline: 'none',
    resize: 'none',

    '&::placeholder': {
      color: 'text-placeholder'
    },

    '&:disabled': {
      cursor: 'not-allowed'
    },

    '&:read-only': {
      opacity: '0.7'
    }
  }
});

export const StyledInputGroupButton = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    height: '6',
    border: 'none',
    borderRadius: 'md',
    backgroundColor: 'transparent',
    color: 'text-base',
    textStyle: 'input',
    fontSize: '0.875rem',
    paddingInline: '2',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease-out',
    outline: 'none',
    boxShadow: 'none',

    '&:hover:not(:disabled)': {
      backgroundColor: 'background-button-secondary-hover'
    },

    '&:disabled': {
      opacity: '0.5',
      cursor: 'not-allowed'
    },

    '&:focus-visible': {
      outline: '2px solid {colors.border-input-focus}',
      outlineOffset: '-2px'
    },

    // Icons sizing
    '& svg:not([class*="size"])': {
      width: '3.5',
      height: '3.5'
    }
  },

  variants: {
    size: {
      xs: {
        height: '6',
        gap: '1',
        paddingInline: '2',
        fontSize: '0.875rem',
        borderRadius: 'sm',

        '& svg:not([class*="size"])': {
          width: '3.5',
          height: '3.5'
        }
      },
      sm: {
        height: '8',
        paddingInline: '2.5',
        gap: '1.5',
        fontSize: '0.875rem',
        borderRadius: 'md'
      },
      'icon-xs': {
        width: '6',
        height: '6',
        padding: '0',
        borderRadius: 'sm'
      },
      'icon-sm': {
        width: '8',
        height: '8',
        padding: '0',
        borderRadius: 'md'
      }
    },
    variant: {
      default: {
        color: 'text-base'
      },
      ghost: {
        '&:hover:not(:disabled)': {
          backgroundColor: 'background-button-secondary-hover'
        }
      }
    }
  },

  defaultVariants: {
    variant: 'ghost',
    size: 'xs'
  }
});

export const StyledInputGroupText = styled('span', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2',
    color: 'text-muted',
    textStyle: 'input',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',

    '&:not(:has(button))': {
      pointerEvents: 'none'
    },

    '& svg:not([class*="size"])': {
      width: '4',
      height: '4'
    }
  }
});
