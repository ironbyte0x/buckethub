import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { ProviderType } from '@buckethub/core';
import { ConnectionId } from '@buckethub/rpc-contract';
import { generateConnectionId } from '@/services/connections';
import { createMockOrpcClient, DialogTestWrapper } from '@/test/browser';
import { SelectConnectionStep } from './select-connection';

function createMockWithConnections(connections: Array<{ id: ConnectionId; label: string }>) {
  const mockOrpc = createMockOrpcClient();

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

describe('SelectConnectionStep', () => {
  it('renders connection list', async () => {
    const mockOrpc = createMockWithConnections([
      { id: generateConnectionId(), label: 'My AWS' },
      { id: generateConnectionId(), label: 'My GCP' }
    ]);

    const screen = await render(
      <DialogTestWrapper mockOrpc={mockOrpc}>
        <SelectConnectionStep onBack={vi.fn()} onNext={vi.fn()} />
      </DialogTestWrapper>
    );

    await expect.element(screen.getByText('My AWS')).toBeVisible();
    await expect.element(screen.getByText('My GCP')).toBeVisible();
  });

  it('Back button calls onBack', async () => {
    const mockOrpc = createMockWithConnections([{ id: generateConnectionId(), label: 'Test' }]);
    const onBack = vi.fn();

    const screen = await render(
      <DialogTestWrapper mockOrpc={mockOrpc}>
        <SelectConnectionStep onBack={onBack} onNext={vi.fn()} />
      </DialogTestWrapper>
    );

    await screen.getByRole('button', { name: 'Back' }).click();
    expect(onBack).toHaveBeenCalled();
  });

  it('shows search input when enough connections', async () => {
    const connections = Array.from({ length: 6 }, (_, index) => ({
      id: generateConnectionId(),
      label: `Connection ${index}`
    }));
    const mockOrpc = createMockWithConnections(connections);

    const screen = await render(
      <DialogTestWrapper mockOrpc={mockOrpc}>
        <SelectConnectionStep onBack={vi.fn()} onNext={vi.fn()} />
      </DialogTestWrapper>
    );

    await expect.element(screen.getByPlaceholder('Search connections...')).toBeVisible();
  });

  it('hides search input when few connections', async () => {
    const mockOrpc = createMockWithConnections([{ id: generateConnectionId(), label: 'Only One' }]);

    const screen = await render(
      <DialogTestWrapper mockOrpc={mockOrpc}>
        <SelectConnectionStep onBack={vi.fn()} onNext={vi.fn()} />
      </DialogTestWrapper>
    );

    await expect.element(screen.getByText('Only One')).toBeVisible();
    await expect.element(screen.getByPlaceholder('Search connections...')).not.toBeInTheDocument();
  });
});
