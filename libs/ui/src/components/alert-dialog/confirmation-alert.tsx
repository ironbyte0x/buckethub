'use client';

import { useEffect, useState } from 'react';
import { Button } from '../button';
import { ResponsiveAlertDialog } from '../responsive-alert-dialog';
import { RenderAlert, useConfirmationAlert } from './use-alert-dialog';

const ConfirmationAlertItem = ({
  title,
  description,
  actions: { confirm },
  dismiss,
  open,
  ...props
}: RenderAlert) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(frameId);
  }, []);

  const onClick =
    (handler: (event: React.MouseEvent) => void | Promise<void>, dismiss: () => void) =>
    (event: React.MouseEvent) => {
      event.preventDefault();

      const result = handler(event);

      if (result instanceof Promise) {
        setIsLoading(true);

        result.finally(() => {
          setIsLoading(false);
          dismiss();
        });
      } else {
        dismiss();
      }
    };

  return (
    <ResponsiveAlertDialog {...props} open={open && mounted}>
      <ResponsiveAlertDialog.Content>
        <ResponsiveAlertDialog.Header>
          <ResponsiveAlertDialog.Title>{title}</ResponsiveAlertDialog.Title>
          <ResponsiveAlertDialog.Description>{description}</ResponsiveAlertDialog.Description>
        </ResponsiveAlertDialog.Header>

        <ResponsiveAlertDialog.Footer>
          <ResponsiveAlertDialog.CloseTrigger
            render={(props) => (
              <Button {...props} variant="secondary">
                Cancel
              </Button>
            )}
          />

          {confirm && (
            <Button
              disabled={confirm.disabled}
              variant={confirm.variant}
              loading={isLoading}
              onClick={onClick(confirm.onClick, dismiss)}
            >
              {confirm.label}
            </Button>
          )}
        </ResponsiveAlertDialog.Footer>
      </ResponsiveAlertDialog.Content>
    </ResponsiveAlertDialog>
  );
};

export function ConfirmationAlert() {
  const { alerts } = useConfirmationAlert();

  return alerts.map((props) => <ConfirmationAlertItem key={props.id} {...props} />);
}
