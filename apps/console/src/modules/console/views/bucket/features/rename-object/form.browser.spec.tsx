import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { FileObject, ObjectAlreadyExistsError } from '@buckethub/rpc-contract';
import { generateBucketId } from '@/services/buckets';
import { createMockOrpcClient, DialogTestWrapper, suppressMutationErrors } from '@/test/browser';
import { RenameObjectForm } from './form';

describe('RenameObjectForm', () => {
  const bucketId = generateBucketId();
  const object: FileObject = {
    key: 'old-file.txt',
    name: 'old-file.txt',
    type: 'file' as const,
    size: 100,
    lastModified: new Date().toISOString()
  };

  async function setup(mockOrpc = createMockOrpcClient()) {
    const screen = await render(
      <DialogTestWrapper mockOrpc={mockOrpc}>
        <RenameObjectForm bucketId={bucketId} object={object} />
      </DialogTestWrapper>
    );

    return { screen, mockOrpc };
  }

  it('shows field error on ObjectAlreadyExistsError', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();
    const error = new ObjectAlreadyExistsError();

    mockOrpc.objects.rename.mockRejectedValueOnce(error);

    const { screen } = await setup(mockOrpc);

    const input = screen.getByLabelText('Object key');

    await input.clear();
    await input.fill('new-file.txt');

    await screen.getByRole('button', { name: 'Rename' }).click();

    await expect.element(screen.getByText(error.message)).toBeVisible();
  });

  it('shows ErrorAlert on non-ORPC error', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();

    mockOrpc.objects.rename.mockRejectedValueOnce(new Error('Network failure'));

    const { screen } = await setup(mockOrpc);

    const input = screen.getByLabelText('Object key');

    await input.clear();
    await input.fill('new-file.txt');

    await screen.getByRole('button', { name: 'Rename' }).click();

    await expect.element(screen.getByRole('alert')).toBeVisible();
    await expect.element(screen.getByText('Failed to rename object')).toBeVisible();
  });
});
