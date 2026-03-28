import { AlertCircleIcon } from 'lucide-react';
import { Button, Icon, ResponsiveDialog, State } from '@buckethub/ui';

interface ErrorBoundaryFallbackProps {
  onReset: () => void;
}

export const ErrorBoundaryFallback: React.FunctionComponent<ErrorBoundaryFallbackProps> = ({
  onReset
}) => {
  return (
    <ResponsiveDialog.Body>
      <State>
        <State.Header>
          <State.Media variant="icon">
            <Icon as={AlertCircleIcon} size="xl" color="error" />
          </State.Media>

          <State.Title>Something went wrong</State.Title>

          <State.Description>An unexpected error occurred.</State.Description>
        </State.Header>

        <State.Content>
          <State.Actions>
            <ResponsiveDialog.CloseTrigger>
              <Button type="button" size="sm">
                Cancel
              </Button>
            </ResponsiveDialog.CloseTrigger>

            <Button variant="primary" size="sm" onClick={onReset}>
              Try Again
            </Button>
          </State.Actions>
        </State.Content>
      </State>
    </ResponsiveDialog.Body>
  );
};
