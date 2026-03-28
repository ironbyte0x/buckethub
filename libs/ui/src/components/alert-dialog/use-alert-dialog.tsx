import { create } from 'zustand/react';
import { useShallow } from 'zustand/shallow';
import { Button } from '../button';
import { ResponsiveAlertDialog } from '../responsive-alert-dialog';

interface AlertStore {
  alerts: RenderAlert[];
  add: (alert: RenderAlert) => void;
  dismiss: (alertId?: RenderAlert['id']) => void;
  remove: (alertId: RenderAlert['id']) => void;
}

const useAlertStore = create<AlertStore>()((set) => ({
  alerts: [],
  add: (alert: RenderAlert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts]
    }));
  },
  dismiss: (alertId?: RenderAlert['id']) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId || alertId === undefined
          ? {
              ...alert,
              open: false
            }
          : alert
      )
    }));
  },
  remove: (alertId: RenderAlert['id']) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== alertId)
    }));
  }
}));

interface Actions {
  confirm?: {
    color?: React.ComponentProps<typeof Button>['color'];
    variant?: React.ComponentProps<typeof Button>['variant'];
    label: string;
    onClick: () => void | Promise<void>;
    disabled?: boolean;
  };
}

export interface RenderAlert extends React.ComponentProps<typeof ResponsiveAlertDialog> {
  id: string;
  title: React.ReactNode;
  description: React.ReactNode;
  actions: Actions;
  dismiss: () => void;
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;

  return count.toString();
}

type Alert = Omit<RenderAlert, 'id' | 'dismiss'>;

export function alert({ ...props }: Alert) {
  return new Promise<void>((resolve) => {
    const id = genId();

    const dismiss = () => {
      useAlertStore.getState().dismiss(id);
      resolve();
    };

    useAlertStore.getState().add({
      ...props,
      id,
      open: true,
      dismiss,
      onOpenChange: (open: boolean) => {
        if (!open) {
          dismiss();
        }
      }
    });
  });
}

export function useConfirmationAlert() {
  return useAlertStore(useShallow(({ alerts }) => ({ alerts })));
}
