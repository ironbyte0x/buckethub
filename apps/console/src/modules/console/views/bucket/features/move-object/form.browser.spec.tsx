import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  FileObject,
  ObjectAlreadyExistsError,
  ObjectMovePartialError
} from '@buckethub/rpc-contract';
import { generateBucketId } from '@/services/buckets';
import { createMockOrpcClient, DialogTestWrapper, suppressMutationErrors } from '@/test/browser';
import { MoveObjectForm } from './form';

vi.mock('../../../../components/folder-select', () => ({
  FolderSelect: () => <div data-testid="folder-select">Mock FolderSelect</div>
}));

describe('MoveObjectForm', () => {
  const bucketId = generateBucketId();
  const object: FileObject = {
    key: 'folder/test-file.txt',
    name: 'test-file.txt',
    type: 'file' as const,
    size: 100,
    lastModified: new Date().toISOString()
  };

  async function setup(mockOrpc = createMockOrpcClient()) {
    const screen = await render(
      <DialogTestWrapper mockOrpc={mockOrpc}>
        <MoveObjectForm bucketId={bucketId} object={object} />
      </DialogTestWrapper>
    );

    return { screen, mockOrpc };
  }

  it('shows field error on ObjectAlreadyExistsError', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();
    const error = new ObjectAlreadyExistsError();

    mockOrpc.objects.moveObject.mockRejectedValueOnce(error);

    const { screen } = await setup(mockOrpc);

    const input = screen.getByLabelText('Object name');

    await input.clear();
    await input.fill('moved-file.txt');

    await screen.getByRole('button', { name: 'Move' }).click();

    await expect.element(screen.getByText(error.message)).toBeVisible();
  });

  it('shows field error on ObjectMovePartialError', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();
    const error = new ObjectMovePartialError();

    mockOrpc.objects.moveObject.mockRejectedValueOnce(error);

    const { screen } = await setup(mockOrpc);

    const input = screen.getByLabelText('Object name');

    await input.clear();
    await input.fill('moved-file.txt');

    await screen.getByRole('button', { name: 'Move' }).click();

    await expect.element(screen.getByText(error.message)).toBeVisible();
  });

  it('shows ErrorAlert on non-ORPC error', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();

    mockOrpc.objects.moveObject.mockRejectedValueOnce(new Error('Network failure'));

    const { screen } = await setup(mockOrpc);

    const input = screen.getByLabelText('Object name');

    await input.clear();
    await input.fill('moved-file.txt');

    await screen.getByRole('button', { name: 'Move' }).click();

    await expect.element(screen.getByRole('alert')).toBeVisible();
    await expect.element(screen.getByText('Failed to move object')).toBeVisible();
  });
});
