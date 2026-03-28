import { Drawer } from '@base-ui/react/drawer';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledDrawerTrigger = styled(Drawer.Trigger, {
  base: {}
});

export const StyledDrawerBackdrop = styled(Drawer.Backdrop, {
  base: {
    position: 'absolute',
    inset: '0',
    bottom: 'calc(var(--drawer-internal-offset-bottom, 0px) * -1)',
    minHeight: 'calc(100dvh + var(--drawer-bottom-offset, 0px))',
    backgroundColor: 'black',
    opacity: 'calc(0.2 * (1 - var(--drawer-swipe-progress)))',
    zIndex: '1000',
    transitionDuration: '450ms',
    transitionProperty: 'opacity',
    transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',

    '&[data-starting-style], &[data-ending-style]': {
      opacity: '0'
    },

    '&[data-swiping]': {
      transitionDuration: '0ms'
    },

    '&[data-ending-style]': {
      pointerEvents: 'none',
      transitionDuration: 'calc(var(--drawer-swipe-strength) * 400ms)'
    }
  }
});

export const StyledDrawerViewport = styled(Drawer.Viewport, {
  base: {
    position: 'absolute',
    inset: '0',
    display: 'flex',
    zIndex: '1001',
    overflow: 'hidden'
  },
  variants: {
    position: {
      left: {
        left: '0',
        bottom: 'calc(var(--drawer-internal-offset-bottom, 0px) * -1)'
      },
      right: {
        justifyContent: 'flex-end',
        right: '0',
        bottom: 'calc(var(--drawer-internal-offset-bottom, 0px) * -1)'
      },
      bottom: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        bottom: 'calc(var(--drawer-internal-offset-bottom, 0px) * -1)'
      },
      top: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        top: '0'
      }
    }
  },
  defaultVariants: {
    position: 'right'
  }
});

export const StyledDrawerPopup = styled(Drawer.Popup, {
  base: {
    '--bleed': '3rem',
    '--peek': '1rem',
    '--stack-progress': 'clamp(0, var(--drawer-swipe-progress), 1)',
    '--stack-step': '0.05',
    '--stack-peek-offset':
      'max(0px, calc((var(--nested-drawers) - var(--stack-progress)) * var(--peek)))',
    '--stack-scale-base': 'max(0, calc(1 - (var(--nested-drawers) * var(--stack-step))))',
    '--stack-scale': 'calc(var(--stack-scale-base) + (var(--stack-step) * var(--stack-progress)))',
    '--stack-shrink': 'calc(1 - var(--stack-scale))',
    '--stack-height':
      'max(0px, calc(var(--drawer-frontmost-height, var(--drawer-height)) - var(--bleed)))',

    boxSizing: 'border-box',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: 'background-base',
    boxShadow: 'lg',
    outline: 'none',
    willChange: 'transform',
    transitionProperty: 'transform, border-radius',
    transitionDuration: '450ms',
    transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',

    '&::after': {
      content: '""',
      inset: '0',
      position: 'absolute',
      borderRadius: 'inherit',
      backgroundColor: 'transparent',
      pointerEvents: 'none',
      transition: 'background-color 450ms cubic-bezier(0.32, 0.72, 0, 1)'
    },

    '&[data-nested-drawer-open]': {
      overflow: 'hidden',

      '&::after': {
        backgroundColor: 'rgb(0 0 0 / 0.05)'
      }
    },

    '&[data-swiping], &[data-nested-drawer-swiping]': {
      transitionDuration: '0ms'
    },

    '&[data-swiping]': {
      userSelect: 'none'
    },

    '&[data-ending-style]': {
      transitionDuration: 'calc(var(--drawer-swipe-strength) * 400ms)'
    },

    '&:not(:has([data-slot="drawer-footer"])) [data-slot="drawer-body"]': {
      '& [data-slot="scroll-area-content"]': {
        paddingBottom: 'var(--drawer-bottom-offset, 0px)'
      },

      '&:not(:has([data-slot="scroll-area-content"]))': {
        paddingBottom: 'var(--drawer-bottom-offset, 0px)'
      }
    }
  },
  variants: {
    position: {
      left: {
        '--translate-x':
          'calc(var(--drawer-swipe-movement-x) + var(--stack-peek-offset) + (var(--stack-shrink) * var(--stack-height)))',

        width: '320px',
        maxWidth: 'calc(100dvw - {spacing.12})',
        height: '100%',
        borderRight: 'base',
        transformOrigin: '0% 50%',
        transform: 'translateX(var(--translate-x)) scale(var(--stack-scale))',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          bottom: '0',
          width: 'var(--bleed)',
          transform: 'translateX(-100%)',
          background: 'inherit'
        },

        '&[data-starting-style], &[data-ending-style]': {
          transform: 'translateX(-100%)'
        },

        '&[data-nested-drawer-open]': {
          borderRightRadius: 'xl'
        }
      },
      right: {
        '--translate-x':
          'calc(var(--drawer-swipe-movement-x) - var(--stack-peek-offset) - (var(--stack-shrink) * var(--stack-height)))',

        width: '320px',
        maxWidth: 'calc(100dvw - {spacing.12})',
        height: '100%',
        borderLeft: 'base',
        transformOrigin: '100% 50%',
        transform: 'translateX(var(--translate-x)) scale(var(--stack-scale))',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          width: 'var(--bleed)',
          transform: 'translateX(100%)',
          background: 'inherit'
        },

        '&[data-starting-style], &[data-ending-style]': {
          transform: 'translateX(100%)'
        },

        '&[data-nested-drawer-open]': {
          borderLeftRadius: 'xl'
        }
      },
      bottom: {
        '--translate-y':
          'calc(var(--drawer-swipe-movement-y) - var(--stack-peek-offset) - (var(--stack-shrink) * var(--stack-height)))',

        width: '100%',
        maxHeight: 'calc(80dvh + var(--bleed) + var(--drawer-bottom-offset, 0px))',
        height: 'var(--drawer-height, auto)',
        marginBottom: 'calc(-1 * var(--bleed))',
        paddingBottom: 'var(--bleed)',
        borderTop: 'base',
        borderTopLeftRadius: 'xl',
        borderTopRightRadius: 'xl',
        overscrollBehavior: 'contain',
        transformOrigin: '50% calc(100% - var(--bleed))',
        transitionProperty: 'transform, height, box-shadow',
        transform: 'translateY(var(--translate-y)) scale(var(--stack-scale))',

        '&[data-nested-drawer-open]': {
          height: 'calc(var(--stack-height) + var(--bleed))'
        },

        '&[data-starting-style], &[data-ending-style]': {
          transform: 'translateY(calc(100% - var(--bleed)))'
        },

        '&[data-ending-style]': {
          boxShadow: '0 2px 10px rgb(0 0 0 / 0)'
        }
      },
      top: {
        '--translate-y':
          'calc(var(--drawer-swipe-movement-y) + var(--stack-peek-offset) + (var(--stack-shrink) * var(--stack-height)))',

        width: '100%',
        maxHeight: 'calc(80dvh + var(--bleed))',
        height: 'var(--drawer-height, auto)',
        marginTop: 'calc(-1 * var(--bleed))',
        paddingTop: 'var(--bleed)',
        borderBottom: 'base',
        borderBottomLeftRadius: 'xl',
        borderBottomRightRadius: 'xl',
        overscrollBehavior: 'contain',
        transformOrigin: '50% var(--bleed)',
        transitionProperty: 'transform, height, box-shadow',
        transform: 'translateY(var(--translate-y)) scale(var(--stack-scale))',

        '&[data-nested-drawer-open]': {
          height: 'calc(var(--stack-height) + var(--bleed))'
        },

        '&[data-starting-style], &[data-ending-style]': {
          transform: 'translateY(calc(-100% + var(--bleed)))'
        },

        '&[data-ending-style]': {
          boxShadow: '0 2px 10px rgb(0 0 0 / 0)'
        }
      }
    }
  },
  defaultVariants: {
    position: 'right'
  }
});

export const StyledDrawerTitle = styled(Drawer.Title, {
  base: {
    gridArea: 'title',
    textStyle: 'body-large-emphasized',
    color: 'text-base'
  }
});

export const StyledDrawerDescription = styled(Drawer.Description, {
  base: {
    gridArea: 'description',
    textStyle: 'body-medium',
    color: 'text-muted'
  }
});

export const StyledDrawerClose = styled(Drawer.Close, {
  base: {}
});

export const StyledDrawerHeader = styled('div', {
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

export const StyledDrawerBody = styled('div', {
  base: {
    flex: '1',
    padding: '5',
    overflowY: 'auto'
  }
});

export const StyledDrawerFooter = styled('div', {
  base: {
    display: 'flex',
    gap: '2.5',
    justifyContent: 'flex-end',
    paddingInline: '5',
    paddingTop: '5',
    paddingBottom: 'calc(var(--drawer-bottom-offset, 0px) + {spacing.5})',
    borderTop: 'base'
  }
});

export const StyledDrawerSwipeArea = styled(Drawer.SwipeArea, {
  base: {}
});
