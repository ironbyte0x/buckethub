import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  InvalidCredentialsError,
  InvalidUrlError,
  ProviderUnreachableError
} from '@buckethub/rpc-contract';
import { userEvent } from '@vitest/browser/context';
import { createCollections } from '@/services/collections';
import {
  createMockOrpcClient,
  createTestQueryClient,
  DialogTestWrapper,
  preloadCollections,
  suppressMutationErrors
} from '@/test/browser';
import { NewConnectionStep } from './new-connection';

describe('NewConnectionStep', () => {
  const onNext = vi.fn();

  async function setup(
    mockOrpc = createMockOrpcClient(),
    queryClient?: Parameters<typeof DialogTestWrapper>[0]['queryClient'],
    collections?: Parameters<typeof DialogTestWrapper>[0]['collections']
  ) {
    const screen = await render(
      <DialogTestWrapper mockOrpc={mockOrpc} queryClient={queryClient} collections={collections}>
        <NewConnectionStep onNext={onNext} />
      </DialogTestWrapper>
    );

    return { screen, mockOrpc };
  }

  async function fillForm(screen: Awaited<ReturnType<typeof render>>) {
    await screen.getByLabelText('Label').fill('Test Connection');
    await screen.getByLabelText('Access Key ID').fill('AKIATEST123');
    await screen.getByLabelText('Secret Access Key').fill('secret123');

    const endpoint = screen.getByRole('textbox', { name: 'Endpoint' });

    await userEvent.click(endpoint);
    await userEvent.type(endpoint, 'https://s3.amazonaws.com');
  }

  it('renders form fields', async () => {
    const { screen } = await setup();

    await expect.element(screen.getByLabelText('Label')).toBeVisible();
    await expect.element(screen.getByLabelText('Access Key ID')).toBeVisible();
    await expect.element(screen.getByLabelText('Secret Access Key')).toBeVisible();
  });

  it('shows Back button when onBack is provided', async () => {
    const screen = await render(
      <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
        <NewConnectionStep onBack={vi.fn()} onNext={onNext} />
      </DialogTestWrapper>
    );

    await expect.element(screen.getByRole('button', { name: 'Back', exact: true })).toBeVisible();
  });

  it('shows Cancel button when onBack is omitted', async () => {
    const { screen } = await setup();

    await expect.element(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  it('renders tags input section', async () => {
    const { screen } = await setup();

    await expect.element(screen.getByText('Tags', { exact: true })).toBeVisible();
  });

  it('shows field error on InvalidCredentialsError', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();
    const error = new InvalidCredentialsError();

    mockOrpc.connections.create.mockRejectedValueOnce(error);

    const { screen } = await setup(mockOrpc);

    await fillForm(screen);

    await screen.getByRole('button', { name: 'Next' }).click();

    await expect.element(screen.getByText(error.message)).toBeVisible();
  });

  it('shows field error on InvalidUrlError', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();
    const error = new InvalidUrlError();

    mockOrpc.connections.create.mockRejectedValueOnce(error);

    const { screen } = await setup(mockOrpc);

    await fillForm(screen);

    await screen.getByRole('button', { name: 'Next' }).click();

    await expect.element(screen.getByText(error.message)).toBeVisible();
  });

  it('shows ErrorAlert on ProviderUnreachableError', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();
    const error = new ProviderUnreachableError();

    mockOrpc.connections.create.mockRejectedValueOnce(error);

    const { screen } = await setup(mockOrpc);

    await fillForm(screen);

    await screen.getByRole('button', { name: 'Next' }).click();

    await expect.element(screen.getByText('Failed to add connection')).toBeVisible();
    await expect.element(screen.getByText(/provider is unreachable/i)).toBeVisible();
  });

  it('retries successfully after backend error', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();
    const queryClient = createTestQueryClient();
    const collections = createCollections({ orpcClient: mockOrpc, queryClient });

    await preloadCollections(collections);

    mockOrpc.connections.create.mockRejectedValueOnce(new Error('Server error'));
    mockOrpc.connections.create.mockResolvedValueOnce({} as never);

    const { screen } = await setup(mockOrpc, queryClient, collections);

    await fillForm(screen);

    await screen.getByRole('button', { name: 'Next' }).click();

    await expect.element(screen.getByRole('alert')).toBeVisible();

    await screen.getByRole('button', { name: 'Next' }).click();

    await expect.poll(() => mockOrpc.connections.create.mock.calls.length).toBe(2);
    await expect.element(screen.getByRole('alert')).not.toBeInTheDocument();
  });

  it('retries successfully after InvalidCredentialsError', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();
    const queryClient = createTestQueryClient();
    const collections = createCollections({ orpcClient: mockOrpc, queryClient });

    await preloadCollections(collections);

    const error = new InvalidCredentialsError();

    mockOrpc.connections.create.mockRejectedValueOnce(error);
    mockOrpc.connections.create.mockResolvedValueOnce({} as never);

    const { screen } = await setup(mockOrpc, queryClient, collections);

    await fillForm(screen);

    await screen.getByRole('button', { name: 'Next' }).click();

    await expect.element(screen.getByText(error.message)).toBeVisible();

    await screen.getByRole('button', { name: 'Next' }).click();

    await expect.poll(() => mockOrpc.connections.create.mock.calls.length).toBe(2);
    await expect.element(screen.getByText(error.message)).not.toBeInTheDocument();
  });

  it('shows ErrorAlert on non-ORPC error', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();

    mockOrpc.connections.create.mockRejectedValueOnce(new Error('Network failure'));

    const { screen } = await setup(mockOrpc);

    await fillForm(screen);

    await screen.getByRole('button', { name: 'Next' }).click();

    await expect.element(screen.getByRole('alert')).toBeVisible();
    await expect.element(screen.getByText('Failed to add connection')).toBeVisible();
  });
});
