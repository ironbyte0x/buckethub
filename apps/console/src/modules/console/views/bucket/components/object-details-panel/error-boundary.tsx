import { ErrorBoundary as BaseErrorBoundary } from 'react-error-boundary';
import { AlertCircleIcon } from 'lucide-react';
import { Button, Icon, State } from '@buckethub/ui';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

interface ErrorBoundaryProps {
  wrapper: React.FunctionComponent<{ children: React.ReactNode }>;
  children: React.ReactNode;
}

export const ErrorBoundary: React.FunctionComponent<ErrorBoundaryProps> = ({
  wrapper: Wrapper,
  children
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <BaseErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <Wrapper>
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
                    <Button variant="primary" size="sm" onClick={resetErrorBoundary}>
                      Try Again
                    </Button>
                  </State.Actions>
                </State.Content>
              </State>
            </Wrapper>
          )}
          onReset={reset}
        >
          {children}
        </BaseErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
