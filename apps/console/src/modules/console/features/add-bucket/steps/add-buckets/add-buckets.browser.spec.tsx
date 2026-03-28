import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { generateConnectionId } from '@/services/connections';
import { createMockOrpcClient, DialogTestWrapper } from '@/test/browser';
import { AddBucketsStep } from './add-buckets';

vi.mock('@/modules/console/features/tag-manager', () => ({
  TagManager: () => <div data-testid="tag-manager" />
}));

const connectionId = generateConnectionId();

describe('AddBucketsStep', () => {
  it('renders one empty input field and "Add another" button', async () => {
    const screen = await render(
      <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
        <AddBucketsStep connectionId={connectionId} onSuccess={vi.fn()} />
      </DialogTestWrapper>
    );

    await expect.element(screen.getByPlaceholder('db-backup')).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'Add another' })).toBeVisible();
  });

  it('clicking "Add another" adds a new input field', async () => {
    const screen = await render(
      <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
        <AddBucketsStep connectionId={connectionId} onSuccess={vi.fn()} />
      </DialogTestWrapper>
    );

    await screen.getByRole('button', { name: 'Add another' }).click();
    await expect.element(screen.getByPlaceholder('db-backup')).toBeVisible();
    await expect.element(screen.getByPlaceholder('user-uploads')).toBeVisible();
  });

  it('clicking trash icon removes a field', async () => {
    const screen = await render(
      <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
        <AddBucketsStep connectionId={connectionId} onSuccess={vi.fn()} />
      </DialogTestWrapper>
    );

    await screen.getByRole('button', { name: 'Add another' }).click();

    const removeButtons = screen.getByRole('button', { name: 'Remove bucket' });

    const deleteButton = removeButtons.elements()[0];

    if (!(deleteButton instanceof HTMLElement)) {
      throw new Error('Delete button is not an HTMLElement');
    }

    deleteButton.click();

    await expect.element(screen.getByPlaceholder('db-backup')).toBeVisible();
    await expect.element(screen.getByPlaceholder('user-uploads')).not.toBeInTheDocument();
  });

  it('shows access denied info alert', async () => {
    const screen = await render(
      <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
        <AddBucketsStep connectionId={connectionId} onSuccess={vi.fn()} />
      </DialogTestWrapper>
    );

    await expect.element(screen.getByText('Failed to list buckets')).toBeVisible();
  });
});
