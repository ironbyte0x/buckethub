import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
  enter: {
    from: {
      opacity: 'var(--ds-enter-opacity, 1)',
      transform:
        'translate3d(var(--ds-enter-translate-x, 0), var(--ds-enter-translate-y, 0), 0) scale3d(var(--ds-enter-scale, 1), var(--ds-enter-scale, 1), var(--ds-enter-scale, 1)) rotate(var(--ds-enter-rotate, 0))'
    }
  },
  exit: {
    to: {
      opacity: 'var(--ds-exit-opacity, 1)',
      transform:
        'translate3d(var(--ds-exit-translate-x, 0), var(--ds-exit-translate-y, 0), 0) scale3d(var(--ds-exit-scale, 1), var(--ds-exit-scale, 1), var(--ds-exit-scale, 1)) rotate(var(--ds-exit-rotate, 0))'
    }
  },
  'collapsible-down': {
    from: { height: '0px', opacity: '0' },
    to: { height: 'var(--radix-collapsible-content-height)', opacity: '1' }
  },
  'collapsible-up': {
    from: { height: 'var(--radix-collapsible-content-height)', opacity: '1' },
    to: { height: '0px', opacity: '0' }
  },
  spin: {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  },
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  },
  'fade-out': {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' }
  },
  'modal-in': {
    '0%': {
      opacity: '0',
      transform: 'translate3d(-50%, calc(var(--transform-y, -50%) + 50%), 0px)'
    },
    '100%': {
      opacity: '1',
      transform: 'translate3d(-50%, var(--transform-y, -50%), 0px)'
    }
  },
  'modal-out': {
    '0%': {
      opacity: '1',
      transform: 'translate3d(-50%, var(--transform-y, -50%), 0px), 0px)'
    },
    '100%': {
      opacity: '0',
      transform: 'translate3d(-50%, calc(var(--transform-y, -50%) - 50%), 0px)'
    }
  },
  'slide-in-from-left': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(0%)' }
  },
  'slide-out-to-left': {
    '0%': { transform: 'translateX(0%)' },
    '100%': { transform: 'translateX(-100%)' }
  },
  'slide-in-from-right': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0%)' }
  },
  'slide-out-to-right': {
    '0%': { transform: 'translateX(0%)' },
    '100%': { transform: 'translateX(100%)' }
  },
  'slide-in-from-top': {
    '0%': { transform: 'translateY(-100%)' },
    '100%': { transform: 'translateY(0%)' }
  },
  'slide-out-to-top': {
    '0%': { transform: 'translateY(0%)' },
    '100%': { transform: 'translateY(-100%)' }
  },
  'slide-in-from-bottom': {
    '0%': { transform: 'translateY(100%)' },
    '100%': { transform: 'translateY(0%)' }
  },
  'slide-out-to-bottom': {
    '0%': { transform: 'translateY(0%)' },
    '100%': { transform: 'translateY(100%)' }
  },
  'popover-in': {
    '0%': {
      opacity: '0',
      transform: 'translate(var(--translate-x-from, 0px), var(--translate-y-from, 0px)) scale(0.95)'
    },
    '100%': { opacity: '1', transform: 'translate(0px, 0px) scale(1)' }
  },
  'popover-out': {
    '0%': {
      opacity: '1',
      transform: 'translate(0px, 0px) scale(1)'
    },
    '100%': {
      opacity: '0',
      transform: 'translate(var(--translate-x-from, 0px), var(--translate-y-from, 0px)) scale(0.95)'
    }
  },
  skeleton: {
    '0%': {
      backgroundPosition: '100% 0'
    },

    '100%': {
      backgroundPosition: '-100% 0'
    }
  },
  'animated-gradient': {
    '0%': {
      backgroundPosition: '0% 50%'
    },

    '50%': {
      backgroundPosition: '100% 50%'
    },

    '100%': {
      backgroundPosition: '0% 50%'
    }
  },
  'highlighted-pulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(29, 89, 255, 0.7)'
    },
    '70%': {
      boxShadow: '0 0 0 10px rgba(29, 89, 255, 0)'
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(29, 89, 255, 0)'
    }
  }
});
