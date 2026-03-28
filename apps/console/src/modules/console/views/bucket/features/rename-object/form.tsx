import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { Button, ResponsiveDialog } from '@buckethub/ui';
import { ORPCError } from '@orpc/client';
import { useRenameObject } from '@/services/objects';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';
import { renameObjectSchema } from './schema';

interface RenameObjectFormProps {
  bucketId: BucketId;
  object: FileObject;
  onSuccess?: () => void;
}

export const RenameObjectForm: React.FunctionComponent<RenameObjectFormProps> = ({
  bucketId,
  object,
  onSuccess
}) => {
  const { mutateAsync: rename, error, isPending } = useRenameObject();

  const form = useAppForm({
    defaultValues: {
      oldKey: object.key || '',
      newKey: object.key || ''
    },
    validators: {
      onSubmit: renameObjectSchema
    },
    onSubmit: async ({ value: { oldKey, newKey }, formApi }) => {
      await rename(
        {
          bucketId,
          oldKey,
          newKey
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
          onError: (error) => {
            if (!(error instanceof ORPCError)) {
              return;
            }

            formApi.setErrorMap({
              onSubmit: {
                fields: {
                  newKey: { message: error.message }
                }
              }
            });
          }
        }
      );
    }
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <ResponsiveDialog.Body>
        <ErrorAlert
          show={!!error && !(error instanceof ORPCError)}
          title="Failed to rename object"
          description="An unexpected error occurred. Please try again."
          css={{
            marginBottom: '5'
          }}
        />

        <form.AppField name="newKey">
          {(field) => <field.TextInput label="Object key" placeholder="Enter new object key" />}
        </form.AppField>
      </ResponsiveDialog.Body>

      <ResponsiveDialog.Footer>
        <ResponsiveDialog.CloseTrigger
          render={(props) => (
            <Button variant="secondary" disabled={isPending} {...props}>
              Cancel
            </Button>
          )}
        />

        <form.Subscribe
          selector={(form) => ({
            canSubmit: form.canSubmit,
            isDirty: form.isDirty,
            isSubmitting: form.isSubmitting
          })}
        >
          {({ canSubmit, isDirty, isSubmitting }) => (
            <Button variant="primary" disabled={!canSubmit || !isDirty} loading={isSubmitting}>
              Rename
            </Button>
          )}
        </form.Subscribe>
      </ResponsiveDialog.Footer>
    </form>
  );
};
