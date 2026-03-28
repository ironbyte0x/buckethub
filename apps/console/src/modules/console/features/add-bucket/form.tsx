import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ConnectionId, ListBucketsAccessDeniedError } from '@buckethub/rpc-contract';
import { ORPCError } from '@orpc/client';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useConnections } from '@/services/connections';
import { ErrorBoundaryFallback } from './error-boundary-fallback';
import { AddBucketsStep } from './steps/add-buckets';
import { NewConnectionStep } from './steps/new-connection';
import { SelectBucketsStep } from './steps/select-buckets';
import { SelectConnectionStep } from './steps/select-connection';
import { SelectConnectionTypeStep } from './steps/select-connection-type';

export enum Step {
  Initial,
  NewConnection,
  SelectConnection,
  BucketSelection
}

interface TState {
  connection?: { id: ConnectionId };
}

interface NewBucketFormProps {
  onClose: () => void;
  onDirty?: () => void;
}

export const Form: React.FunctionComponent<NewBucketFormProps> = ({ onClose, onDirty }) => {
  const { data: connections } = useConnections();
  const hasConnections = connections.length > 0;

  const [step, setStep] = useState(hasConnections ? Step.Initial : Step.NewConnection);
  const [state, setState] = useState<TState>({});

  switch (step) {
    case Step.Initial: {
      return (
        <SelectConnectionTypeStep
          onNext={(type) => setStep(type === 'new' ? Step.NewConnection : Step.SelectConnection)}
        />
      );
    }

    case Step.SelectConnection: {
      return (
        <SelectConnectionStep
          onBack={() => setStep(Step.Initial)}
          onNext={(data) => {
            setStep(Step.BucketSelection);
            setState((previous) => ({ ...previous, connection: data }));
          }}
        />
      );
    }

    case Step.NewConnection: {
      return (
        <NewConnectionStep
          {...(hasConnections ? { onBack: () => setStep(Step.Initial) } : {})}
          onDirty={onDirty}
          onNext={(data) => {
            setStep(Step.BucketSelection);
            setState((previous) => ({ ...previous, connection: data }));
          }}
        />
      );
    }

    case Step.BucketSelection: {
      if (!state.connection) {
        throw new Error('Connection is required for bucket selection step');
      }

      return (
        <QueryErrorResetBoundary>
          {({ reset }) => {
            if (!state.connection) {
              throw new Error('Connection is required for bucket selection step');
            }

            return (
              <ErrorBoundary
                fallbackRender={({ error, resetErrorBoundary }) => {
                  if (
                    error instanceof ORPCError &&
                    error.code === ListBucketsAccessDeniedError.code
                  ) {
                    if (!state.connection) {
                      throw new Error('Connection is required for bucket selection step');
                    }

                    return (
                      <AddBucketsStep
                        connectionId={state.connection.id}
                        onDirty={onDirty}
                        onSuccess={onClose}
                      />
                    );
                  }

                  return <ErrorBoundaryFallback onReset={resetErrorBoundary} />;
                }}
                onReset={reset}
              >
                <SelectBucketsStep connectionId={state.connection.id} onSuccess={onClose} />
              </ErrorBoundary>
            );
          }}
        </QueryErrorResetBoundary>
      );
    }

    default: {
      const _exhaustiveCheck: never = step;

      throw new Error('Invalid step: ' + _exhaustiveCheck);
    }
  }
};
