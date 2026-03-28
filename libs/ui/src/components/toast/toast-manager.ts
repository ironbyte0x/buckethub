import type { ToastManagerAddOptions } from '@base-ui/react/toast';
import { Toast } from '@base-ui/react/toast';

export const toastManager = Toast.createToastManager();
export const anchoredToastManager = Toast.createToastManager();

type ToastOptions = Omit<ToastManagerAddOptions<object>, 'type'>;

export const toast = {
  add: toastManager.add,
  close: toastManager.close,
  update: toastManager.update,
  promise: toastManager.promise,
  success: (options: ToastOptions) => toastManager.add({ ...options, type: 'success' }),
  error: (options: ToastOptions) => toastManager.add({ ...options, type: 'error' }),
  warning: (options: ToastOptions) => toastManager.add({ ...options, type: 'warning' }),
  info: (options: ToastOptions) => toastManager.add({ ...options, type: 'info' })
};

export const anchoredToast = anchoredToastManager;
