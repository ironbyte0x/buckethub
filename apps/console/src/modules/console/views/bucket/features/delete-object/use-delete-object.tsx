import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { alert, Text, toast } from '@buckethub/ui';
import { ORPCError } from '@orpc/client';
import { useDeleteObject as useDeleteObjectMutation } from '@/services/objects';

export function useDeleteObject() {
  const { mutateAsync: deleteObject } = useDeleteObjectMutation();

  return (object: FileObject, bucketId: BucketId) => {
    alert({
      title: 'Delete Object',
      description: (
        <>
          Are you sure you want to delete the object{' '}
          <Text color="base" variant="body-large-emphasized">
            "{object.key}"
          </Text>
          ?
          <br />
          This action cannot be undone.
        </>
      ),
      actions: {
        confirm: {
          label: 'Delete',
          variant: 'destructive',
          onClick: async () => {
            try {
              await deleteObject({
                bucketId,
                key: object.key || ''
              });
            } catch (error) {
              if (error instanceof ORPCError) {
                toast.error({
                  title: 'Error deleting object',
                  description: error.message
                });
              }
            }
          }
        }
      }
    });
  };
}
