import { useEffect, useState } from 'react';
import * as v from 'valibot';
import {
  ConnectionId,
  ConnectionTagMapping,
  createConnectionSchema,
  InvalidCredentialsError,
  InvalidUrlError,
  ProviderUnreachableError,
  Tag
} from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Button, Item, ResponsiveDialog } from '@buckethub/ui';
import { ORPCError } from '@orpc/client';
import { useStore } from '@tanstack/react-form';
import { CreateTagDialog } from '@/modules/console/features/create-tag';
import { TagsInput } from '@/modules/console/features/tag-manager';
import { useCollections } from '@/services/collections';
import { generateConnectionId, useCreateConnection } from '@/services/connections';
import { generateConnectionTagMappingId, useTags } from '@/services/tags';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';

type ConnectionSchema = v.InferOutput<typeof createConnectionSchema>;

interface NewConnectionStepProps {
  onBack?: () => void;
  onDirty?: () => void;
  onNext: (data: { id: ConnectionId }) => void;
}

export const NewConnectionStep: React.FunctionComponent<NewConnectionStepProps> = ({
  onBack,
  onDirty,
  onNext
}) => {
  const { connectionTagsCollection } = useCollections();
  const { mutateAsync: createConnection, error } = useCreateConnection();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [createTagDialogState, setCreateTagDialogState] = useState<{
    open: boolean;
    defaultValue: string;
  }>({
    open: false,
    defaultValue: ''
  });

  const { data: allTags } = useTags();

  const form = useAppForm({
    defaultValues: {
      id: generateConnectionId(),
      label: '',
      accessKeyId: '',
      secretAccessKey: '',
      endpoint: ''
    } satisfies Partial<ConnectionSchema> as ConnectionSchema,
    validators: {
      onSubmit: createConnectionSchema
    },
    onSubmit: async ({ value, formApi }) => {
      await createConnection(value, {
        onError: (error) => {
          if (!(error instanceof ORPCError)) {
            return;
          } else if (error.code === InvalidCredentialsError.code) {
            formApi.setErrorMap({
              onSubmit: {
                fields: {
                  accessKeyId: { message: error.message }
                }
              }
            });
          } else if (error.code === InvalidUrlError.code) {
            formApi.setErrorMap({
              onSubmit: {
                fields: {
                  endpoint: { message: error.message }
                }
              }
            });
          }
        },
        onSuccess: async (connection) => {
          const tags = selectedTags.map<ConnectionTagMapping>((tag) => ({
            id: generateConnectionTagMappingId(),
            connectionId: connection.id,
            tagId: tag.id
          }));

          const transaction = connectionTagsCollection.insert(tags);

          await transaction.isPersisted.promise;

          onNext({ id: connection.id });
        }
      });
    }
  });

  const isDirty = useStore(form.store, (state) => state.isDirty);

  useEffect(() => {
    if (isDirty) {
      onDirty?.();
    }
  }, [isDirty, onDirty]);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          form.setErrorMap({
            onSubmit: {
              form: undefined,
              fields: {}
            }
          });

          form.handleSubmit();
        }}
      >
        <ResponsiveDialog.Body css={{ display: 'flex', flexDirection: 'column', gap: '2' }}>
          <Flex css={{ flexDirection: 'column', gap: '5' }}>
            <ErrorAlert
              show={!!error && !(error instanceof ORPCError)}
              title="Failed to add connection"
              description="An unexpected error occurred. Please try again."
            />

            <ErrorAlert
              show={
                !!error &&
                error instanceof ORPCError &&
                error.code === ProviderUnreachableError.code
              }
              title="Failed to add connection"
              description="The provider is unreachable. Please check your connection details and try again."
            />

            <Item.Content>
              <Item.Title>Provider connection</Item.Title>
              <Item.Description>
                To connect to your bucket, enter your S3 connection details.
              </Item.Description>
            </Item.Content>

            <form.AppField name="label">
              {(field) => <field.TextInput label="Label" placeholder="AWS production..." />}
            </form.AppField>

            <form.AppField name="accessKeyId">
              {(field) => <field.TextInput label="Access Key ID" placeholder="AKIA..." />}
            </form.AppField>

            <form.AppField name="secretAccessKey">
              {(field) => <field.PasswordInput label="Secret Access Key" placeholder="••••••••" />}
            </form.AppField>

            <form.AppField name="endpoint">{(field) => <field.ProviderEndpoint />}</form.AppField>

            <Box>
              <Item.Content css={{ marginBottom: '2' }}>
                <Item.Title>Tags</Item.Title>
                <Item.Description>Add tags to organize your connection.</Item.Description>
              </Item.Content>

              <TagsInput
                items={allTags}
                value={selectedTags}
                onChange={setSelectedTags}
                onCreate={(name) => {
                  setCreateTagDialogState({
                    open: true,
                    defaultValue: name
                  });
                }}
              />
            </Box>
          </Flex>
        </ResponsiveDialog.Body>

        <ResponsiveDialog.Footer>
          {onBack ? (
            <Button variant="secondary" css={{ flex: '1' }} type="button" onClick={onBack}>
              Back
            </Button>
          ) : (
            <ResponsiveDialog.CloseTrigger
              render={(props) => (
                <Button variant="secondary" css={{ flex: '1' }} {...props}>
                  Cancel
                </Button>
              )}
            />
          )}

          <Button variant="primary" css={{ flex: '1' }} loading={form.state.isSubmitting}>
            Next
          </Button>
        </ResponsiveDialog.Footer>
      </form>

      <CreateTagDialog
        open={createTagDialogState.open}
        defaultValue={createTagDialogState.defaultValue}
        onOpenChange={(open) => setCreateTagDialogState((state) => ({ ...state, open }))}
        onSubmit={async (tag) => {
          setSelectedTags((tags) => [...tags, tag]);
          setCreateTagDialogState((state) => ({ ...state, open: false, defaultValue: '' }));
        }}
      />
    </>
  );
};
