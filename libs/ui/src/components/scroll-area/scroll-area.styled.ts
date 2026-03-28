import { ScrollArea } from '@base-ui/react/scroll-area';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledScrollAreaRoot = styled(ScrollArea.Root, {
  base: {
    '--scrollbar-size': '{spacing.2.5}',

    position: 'relative',
    overflow: 'hidden',

    '&[data-overflow-y-start] [data-slot="scroll-area-gradient-top"]': {
      opacity: '1'
    },

    '&[data-overflow-y-end] [data-slot="scroll-area-gradient-bottom"]': {
      opacity: '1'
    },

    '&[data-overflow-x-start] [data-slot="scroll-area-gradient-left"]': {
      opacity: '1'
    },

    '&[data-overflow-x-end] [data-slot="scroll-area-gradient-right"]': {
      opacity: '1'
    }
  },

  variants: {
    type: {
      hover: {
        '& [data-slot="scroll-area-scrollbar"]': {
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.15s ease-out',

          '&[data-scrolling]': {
            transitionDuration: '0ms'
          },

          '&[data-hovering], &[data-scrolling]': {
            opacity: 1,
            pointerEvents: 'auto'
          }
        }
      }
    }
  }
});

export const StyledScrollAreaViewport = styled(ScrollArea.Viewport, {
  base: {
    width: '100%',
    height: '100%',
    overflow: 'scroll',
    scrollbarWidth: 'none',

    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
});

export const StyledScrollAreaContent = styled(ScrollArea.Content, {
  base: {}
});

export const StyledScrollAreaScrollbar = styled(ScrollArea.Scrollbar, {
  base: {
    display: 'none',
    userSelect: 'none',
    touchAction: 'none',
    borderRadius: 'full',
    padding: '1px',
    backgroundColor: 'background-surface',
    transition: 'background 0.15s ease-out',

    '&[data-orientation="vertical"]': {
      width: 'var(--scrollbar-size, {spacing.2.5})',
      height: '100%',

      '&[data-has-overflow-y]': {
        display: 'flex'
      }
    },

    '&[data-orientation="horizontal"]': {
      flexDirection: 'column',
      height: 'var(--scrollbar-size, {spacing.2.5})',
      width: '100%',

      '&[data-has-overflow-x]': {
        display: 'flex'
      }
    },

    '&:hover': {
      backgroundColor: 'background-subtle'
    },

    '&[data-scrolling]': {
      backgroundColor: 'background-subtle'
    }
  }
});

export const StyledScrollAreaThumb = styled(ScrollArea.Thumb, {
  base: {
    flex: '1',
    backgroundColor: 'grey.300',
    borderRadius: 'full',
    position: 'relative',
    transition: 'background 0.15s ease-out',
    zIndex: '10',

    _dark: {
      backgroundColor: 'grey.600'
    },

    '&[data-orientation="vertical"]': {
      width: '100%',
      minHeight: '7'
    },

    '&[data-orientation="horizontal"]': {
      height: '100%',
      minWidth: '7'
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      minWidth: '11',
      minHeight: '11'
    },

    '&:hover': {
      backgroundColor: 'border-hover'
    },

    '&:active': {
      backgroundColor: 'border-hover'
    }
  }
});

export const StyledScrollAreaCorner = styled(ScrollArea.Corner, {
  base: {
    backgroundColor: 'background-base'
  }
});

export const StyledScrollAreaGradient = styled('div', {
  base: {
    position: 'absolute',
    pointerEvents: 'none',
    transition: 'opacity 0.15s ease-out',
    opacity: '0',
    zIndex: '1'
  },

  variants: {
    position: {
      top: {
        top: '0',
        left: '0',
        right: '0',
        height: '8',
        background: 'linear-gradient(to bottom, {colors.background-base}, transparent)'
      },
      bottom: {
        bottom: '0',
        left: '0',
        right: '0',
        height: '8',
        background: 'linear-gradient(to top, {colors.background-base}, transparent)'
      },
      left: {
        top: '0',
        bottom: '0',
        left: '0',
        width: '8',
        background: 'linear-gradient(to right, {colors.background-base}, transparent)'
      },
      right: {
        top: '0',
        bottom: '0',
        right: '0',
        width: '8',
        background: 'linear-gradient(to left, {colors.background-base}, transparent)'
      }
    }
  }
});
