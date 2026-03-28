import { Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { ProviderType } from '@buckethub/core';
import { ConnectionId } from '@buckethub/rpc-contract';
import { generateConnectionId } from '@/services/connections';
import { createMockOrpcClient, DialogTestWrapper, MockOrpcClient } from '@/test/browser';
import { Form } from './form';

vi.mock('./steps/select-connection-type', () => ({
  SelectConnectionTypeStep: (props: { onNext: (value: string) => void }) => (
    <div data-testid="select-connection-type-step">
      <button onClick={() => props.onNext('new')}>Next New</button>
      <button onClick={() => props.onNext('existing')}>Next Existing</button>
    </div>
  )
}));

vi.mock('./steps/new-connection', () => ({
  NewConnectionStep: (props: { onBack?: () => void; onNext: (value: { id: string }) => void }) => (
    <div data-testid="new-connection-step">
      {props.onBack && <button onClick={props.onBack}>Back</button>}
      <button onClick={() => props.onNext({ id: generateConnectionId() })}>Next</button>
    </div>
  )
}));

vi.mock('./steps/select-connection', () => ({
  SelectConnectionStep: (props: {
    onBack: () => void;
    onNext: (value: { id: string }) => void;
  }) => (
    <div data-testid="select-connection-step">
      <button onClick={props.onBack}>Back</button>
      <button onClick={() => props.onNext({ id: generateConnectionId() })}>Next</button>
    </div>
  )
}));

vi.mock('./steps/select-buckets', () => ({
  SelectBucketsStep: () => <div data-testid="select-buckets-step" />
}));

vi.mock('./steps/add-buckets', () => ({
  AddBucketsStep: () => <div data-testid="add-buckets-step" />
}));

vi.mock('./error-boundary-fallback', () => ({
  ErrorBoundaryFallback: () => <div data-testid="error-fallback" />
}));

function withConnections(
  mockOrpc: MockOrpcClient,
  connections: Array<{ id: ConnectionId; label: string }>
) {
  mockOrpc.connections.getAll.mockResolvedValue(
    connections.map((connection) => ({
      id: connection.id,
      label: connection.label,
      endpoint: 'https://s3.amazonaws.com',
      providerType: ProviderType.AmazonS3
    }))
  );

  return mockOrpc;
}

describe('Form', () => {
  describe('when connections exist', () => {
    it('renders SelectConnectionTypeStep', async () => {
      const mockOrpc = withConnections(createMockOrpcClient(), [
        { id: generateConnectionId(), label: 'Test' }
      ]);

      const screen = await render(
        <DialogTestWrapper mockOrpc={mockOrpc}>
          <Suspense fallback={<div>Loading...</div>}>
            <Form onClose={vi.fn()} />
          </Suspense>
        </DialogTestWrapper>
      );

      await expect.element(screen.getByTestId('select-connection-type-step')).toBeVisible();
    });

    it('NewConnectionStep shows Back button when navigated from initial', async () => {
      const mockOrpc = withConnections(createMockOrpcClient(), [
        { id: generateConnectionId(), label: 'Test' }
      ]);

      const screen = await render(
        <DialogTestWrapper mockOrpc={mockOrpc}>
          <Suspense fallback={<div>Loading...</div>}>
            <Form onClose={vi.fn()} />
          </Suspense>
        </DialogTestWrapper>
      );

      await screen.getByText('Next New').click();
      await expect.element(screen.getByTestId('new-connection-step')).toBeVisible();
      await expect.element(screen.getByRole('button', { name: 'Back' })).toBeVisible();
    });
  });

  describe('when no connections exist', () => {
    it('renders NewConnectionStep directly', async () => {
      const screen = await render(
        <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
          <Suspense fallback={<div>Loading...</div>}>
            <Form onClose={vi.fn()} />
          </Suspense>
        </DialogTestWrapper>
      );

      await expect.element(screen.getByTestId('new-connection-step')).toBeVisible();
    });

    it('NewConnectionStep has no Back button', async () => {
      const screen = await render(
        <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
          <Suspense fallback={<div>Loading...</div>}>
            <Form onClose={vi.fn()} />
          </Suspense>
        </DialogTestWrapper>
      );

      await expect.element(screen.getByTestId('new-connection-step')).toBeVisible();
      await expect.element(screen.getByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    });
  });
});
