import * as v from 'valibot';
import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Button, Field, ResponsiveDialog } from '@buckethub/ui';
import { ORPCError } from '@orpc/client';
import { useMoveObject } from '@/services/objects';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';
import { FolderSelect } from '../../../../components/folder-select';
import { moveObjectSchema } from './schema';

interface MoveObjectFormProps {
  bucketId: BucketId;
  object: FileObject;
  onSuccess?: () => void;
}

export const MoveObjectForm: React.FunctionComponent<MoveObjectFormProps> = ({
  bucketId,
  object,
  onSuccess
}) => {
  const { mutateAsync: move, error, isPending } = useMoveObject();

  if (!object.key) {
    throw new Error('Object key is undefined');
  }

  const fileName = object.key.split('/').pop() || '';
  const currentFolder = object.key.replace(fileName, '');

  const form = useAppForm({
    defaultValues: {
      sourceKey: object.key || '',
      destinationFolder: object.key.replace(fileName, ''),
      fileName
    },
    validators: {
      onSubmit: v.pipe(
        moveObjectSchema,
        v.forward(
          v.check((value) => {
            const newKey = value.destinationFolder + value.fileName;

            return newKey !== object.key;
          }, 'New object name or folder must be different'),
          ['fileName']
        )
      )
    },
    onSubmit: async ({ value: { sourceKey, destinationFolder, fileName }, formApi }) => {
      const destinationKey = destinationFolder + fileName;

      await move(
        {
          bucketId,
          sourceKey,
          destinationKey
        },
        {
          onError: (error) => {
            if (error instanceof ORPCError) {
              formApi.setErrorMap({
                onSubmit: {
                  fields: {
                    fileName: { message: error.message }
                  }
                }
              });
            }
          },
          onSuccess: () => {
            onSuccess?.();
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
          title="Failed to move object"
          description="An unexpected error occurred. Please try again."
          css={{
            marginBottom: '5'
          }}
        />

        <Flex css={{ flexDirection: 'column', gap: '5' }}>
          <Field>
            <Field.Label>Select destination folder</Field.Label>

            <FolderSelect
              bucketId={bucketId}
              defaultValue={currentFolder}
              onValueChange={(path) => {
                form.setFieldValue('destinationFolder', path);
              }}
            />
          </Field>

          <form.AppField name="fileName">
            {(field) => <field.TextInput label="Object name" placeholder="Enter object name" />}
          </form.AppField>
        </Flex>
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
          {({ canSubmit, isSubmitting, isDirty }) => (
            <Button
              variant="primary"
              type="submit"
              disabled={!canSubmit || !isDirty}
              loading={isSubmitting}
            >
              Move
            </Button>
          )}
        </form.Subscribe>
      </ResponsiveDialog.Footer>
    </form>
  );
};
