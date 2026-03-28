import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { ProviderType } from '@buckethub/core';
import { InvalidCredentialsError } from '@buckethub/rpc-contract';
import { generateConnectionId } from '@/services/connections';
import { createMockOrpcClient, DialogTestWrapper, suppressMutationErrors } from '@/test/browser';

describe('EditConnectionForm', () => {
  const connection = {
    id: generateConnectionId(),
    providerType: ProviderType.AmazonS3,
    label: 'Test Connection',
    endpoint: 'https://s3.amazonaws.com'
  };
  const onSuccess = vi.fn();

  it('shows field error on ORPC error', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();

    const error = new InvalidCredentialsError();

    mockOrpc.connections.update.mockRejectedValueOnce(error);

    const { FormContent } = await import('./form');

    const screen = await render(
      <DialogTestWrapper mockOrpc={mockOrpc}>
        <FormContent connection={connection} onSuccess={onSuccess} />
      </DialogTestWrapper>
    );

    const label = screen.getByLabelText('Label');

    await label.clear();
    await label.fill('Updated Connection');

    await screen.getByRole('button', { name: 'Save' }).click();

    await expect.element(screen.getByText(error.message)).toBeVisible();
  });

  it('shows ErrorAlert on non-ORPC error', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();

    mockOrpc.connections.update.mockRejectedValueOnce(new Error('Network failure'));

    const { FormContent } = await import('./form');

    const screen = await render(
      <DialogTestWrapper mockOrpc={mockOrpc}>
        <FormContent connection={connection} onSuccess={onSuccess} />
      </DialogTestWrapper>
    );

    const label = screen.getByLabelText('Label');

    await label.clear();
    await label.fill('Updated Connection');

    await screen.getByRole('button', { name: 'Save' }).click();

    await expect.element(screen.getByRole('alert')).toBeVisible();
    await expect.element(screen.getByText('Failed to update connection')).toBeVisible();
  });
});
