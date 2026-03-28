import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AccessDeniedError, BucketId, FileObject } from '@buckethub/rpc-contract';
import { generateBucketId } from '@/services/buckets';
import { createMockOrpcClient, suppressMutationErrors, TestWrapper } from '@/test/browser';
import { useDeleteObject } from './use-delete-object';

// Auto-confirm alert dialogs to bypass Drawer overlay issues
vi.mock('@buckethub/ui', async (importOriginal) => {
  const original = await importOriginal<typeof import('@buckethub/ui')>();

  return {
    ...original,
    alert: vi.fn(({ actions }: { actions?: { confirm?: { onClick?: () => void } } }) => {
      if (actions?.confirm?.onClick) {
        return actions.confirm.onClick();
      }
    })
  };
});

const DeleteObjectTrigger: React.FunctionComponent<{
  bucketId: BucketId;
  object: FileObject;
}> = ({ bucketId, object }) => {
  const triggerDelete = useDeleteObject();

  return <button onClick={() => triggerDelete(object, bucketId)}>Delete Object</button>;
};

describe('useDeleteObject', () => {
  const bucketId = generateBucketId();
  const object: FileObject = {
    key: 'test-file.txt',
    name: 'test-file.txt',
    type: 'file' as const,
    size: 100,
    lastModified: new Date().toISOString()
  };

  async function setup(mockOrpc = createMockOrpcClient()) {
    const screen = await render(
      <TestWrapper mockOrpc={mockOrpc}>
        <DeleteObjectTrigger bucketId={bucketId} object={object} />
      </TestWrapper>
    );

    return { screen, mockOrpc };
  }

  it('shows toast on ORPC error', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();
    const error = new AccessDeniedError();

    mockOrpc.objects.deleteObject.mockRejectedValueOnce(error);

    const { screen } = await setup(mockOrpc);

    await screen.getByRole('button', { name: 'Delete Object' }).click();

    await expect.element(screen.getByText('Error deleting object')).toBeVisible();
    await expect.element(screen.getByText(error.message)).toBeVisible();
  });

  it('does not show toast on non-ORPC error', async () => {
    suppressMutationErrors();

    const mockOrpc = createMockOrpcClient();

    mockOrpc.objects.deleteObject.mockRejectedValueOnce(new Error('Network failure'));

    const { screen } = await setup(mockOrpc);

    await screen.getByRole('button', { name: 'Delete Object' }).click();

    await expect.element(screen.getByText('Error deleting object')).not.toBeInTheDocument();
  });
});
