import { ConfirmationAlert } from './components/alert-dialog/confirmation-alert';
import { Toast, toastManager } from './components/toast';
import { AnchoredToasts } from './components/toast/anchored-toast';
import { anchoredToastManager } from './components/toast/toast-manager';
import { Tooltip } from './components/tooltip';

interface UIProviderProps {
  children: React.ReactNode;
}

export const UIProvider: React.FunctionComponent<UIProviderProps> = ({ children }) => {
  return (
    <Tooltip.Provider>
      {children}

      <ConfirmationAlert />

      <Toast.Provider toastManager={anchoredToastManager}>
        <AnchoredToasts />
      </Toast.Provider>

      <Toast.Provider toastManager={toastManager}>
        <Toast.Viewport />
      </Toast.Provider>
    </Tooltip.Provider>
  );
};
