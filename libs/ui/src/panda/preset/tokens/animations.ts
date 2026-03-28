import { defineTokens } from '@pandacss/dev';

export const animations = defineTokens.animations({
  'collapsible-down': {
    value: 'collapsible-down {durations.5} {easings.ease-out-quint}'
  },
  'collapsible-up': {
    value: 'collapsible-up {durations.5} {easings.ease-out-quint}'
  },
  'slide-in-from-left': {
    value: 'slide-in-from-left {durations.5} {easings.ease-out-quint}'
  },
  'slide-out-to-left': {
    value: 'slide-out-to-left {durations.5} {easings.ease-out-quint}'
  },
  'slide-in-from-right': {
    value: 'slide-in-from-right {durations.5} {easings.ease-out-quint}'
  },
  'slide-out-to-right': {
    value: 'slide-out-to-right {durations.5} {easings.ease-out-quint}'
  },
  'slide-in-from-top': {
    value: 'slide-in-from-top {durations.5} {easings.ease-out-quint}'
  },
  'slide-out-to-top': {
    value: 'slide-out-to-top {durations.5} {easings.ease-out-quint}'
  },
  'slide-in-from-bottom': {
    value: 'slide-in-from-bottom {durations.5} {easings.ease-out-quint}'
  },
  'slide-out-to-bottom': {
    value: 'slide-out-to-bottom {durations.5} {easings.ease-out-quint}'
  },
  'popover-in': {
    value: 'popover-in {durations.1} {easings.ease-out-quart}'
  },
  'popover-out': {
    value: 'popover-out {durations.1} {easings.ease-out-quart}'
  },
  'modal-in': {
    value: 'modal-in cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s'
  },
  'modal-out': {
    value: 'modal-out cubic-bezier(0.2, 0, 0.66, -0.56) 0.4s'
  },
  'overlay-in': { value: 'fade-in {durations.5} {easings.ease-out-quint}' },
  'overlay-out': {
    value: 'fade-out {durations.5} {easings.ease-out-quint}'
  }
});
