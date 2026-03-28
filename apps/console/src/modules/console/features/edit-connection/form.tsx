import { Suspense, useMemo, useState } from 'react';
import * as v from 'valibot';
import {
  Connection,
  Tag,
  TagId,
  tagIdSchema,
  UpdateConnectionRequest,
  updateConnectionSchema
} from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Button, Item, ResponsiveDialog, Skeleton } from '@buckethub/ui';
import { ORPCError } from '@orpc/client';
import { useCollections } from '@/services/collections';
import { useUpdateConnection } from '@/services/connections';
import { generateConnectionTagMappingId, useConnectionTags, useTags } from '@/services/tags';
import { useAppForm } from '@/shared/form';
import { ErrorAlert } from '@/shared/form/error-alert';
import { CreateTagDialog } from '../create-tag';
import { TagsInput } from '../tag-manager';

interface FormProps {
  connection: Connection;
  onSuccess: () => void;
}

type EditConnectionFormValues = UpdateConnectionRequest & {
  tagIds: TagId[];
};

export const FormContent: React.FunctionComponent<FormProps> = ({ connection, onSuccess }) => {
  const { connectionTagsCollection } = useCollections();
  const { mutateAsync: updateConnection, error } = useUpdateConnection();
  const { data: allTags } = useTags();
  const { data: connectionTags } = useConnectionTags(connection.id);

  const tagsLookup = useMemo(() => {
    return allTags.reduce<Record<TagId, Tag>>(
      (accumulator, tag) => {
        accumulator[tag.id] = tag;

        return accumulator;
      },
      {} as Record<TagId, Tag>
    );
  }, [allTags]);

  const [createTagDialogState, setCreateTagDialogState] = useState<{
    open: boolean;
    defaultValue: string;
  }>({
    open: false,
    defaultValue: ''
  });

  const form = useAppForm({
    defaultValues: {
      id: connection.id,
      label: connection.label,
      endpoint: connection.endpoint,
      tagIds: connectionTags.map((tag) => tag.id)
    } satisfies Partial<EditConnectionFormValues> as EditConnectionFormValues,
    validators: {
      onSubmit: v.intersect([updateConnectionSchema, v.object({ tagIds: v.array(tagIdSchema) })])
    },
    onSubmit: async ({ value, formApi }) => {
      const { tagIds, ...connectionValue } = value;

      await updateConnection(connectionValue, {
        onError: (error) => {
          if (!(error instanceof ORPCError)) {
            return;
          }

          formApi.setErrorMap({
            onSubmit: {
              fields: {
                accessKeyId: { message: error.message }
              }
            }
          });
        }
      });

      const initialTagIds = new Set(connectionTags.map((tag) => tag.id));
      const selectedTagIds = new Set(tagIds);

      const addedTagIds = tagIds.filter((id) => !initialTagIds.has(id));
      const removedTagIds = connectionTags
        .filter((tag) => !selectedTagIds.has(tag.id))
        .map((tag) => tag.mappingId);

      const promises: Promise<unknown>[] = [];

      if (addedTagIds.length) {
        const addTransaction = connectionTagsCollection.insert(
          addedTagIds.map((tagId) => ({
            id: generateConnectionTagMappingId(),
            connectionId: connection.id,
            tagId
          }))
        );

        promises.push(addTransaction.isPersisted.promise);
      }

      if (removedTagIds.length) {
        const removeTransaction = connectionTagsCollection.delete(removedTagIds);

        promises.push(removeTransaction.isPersisted.promise);
      }

      await Promise.all(promises);

      onSuccess();
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
        <Flex css={{ flexDirection: 'column', gap: '5' }}>
          <ErrorAlert
            show={!!error && !(error instanceof ORPCError)}
            title="Failed to update connection"
            description="An unexpected error occurred. Please try again."
          />

          <Item.Content>
            <Item.Title>Connection Details</Item.Title>
            <Item.Description>Update your S3 connection credentials and endpoint.</Item.Description>
          </Item.Content>

          <form.AppField name="label">
            {(field) => <field.TextInput label="Label" placeholder="Enter connection label" />}
          </form.AppField>

          <form.AppField name="accessKeyId">
            {(field) => <field.TextInput label="Access Key ID" placeholder="AKIA..." optional />}
          </form.AppField>

          <form.AppField name="secretAccessKey">
            {(field) => (
              <field.PasswordInput label="Secret Access Key" placeholder="••••••••" optional />
            )}
          </form.AppField>

          <form.AppField name="endpoint">{(field) => <field.ProviderEndpoint />}</form.AppField>

          <Box>
            <Item.Content css={{ marginBottom: '2' }}>
              <Item.Title>Tags</Item.Title>
              <Item.Description>Add tags to organize your connections.</Item.Description>
            </Item.Content>

            <form.AppField name="tagIds">
              {({ setValue }) => (
                <form.Subscribe selector={(state) => state.values.tagIds}>
                  {(value) => (
                    <TagsInput
                      items={allTags}
                      value={value.map((id) => tagsLookup[id])}
                      disabled={form.state.isSubmitting}
                      onChange={(tags) => {
                        setValue(tags.map((tag) => tag.id));
                      }}
                      onCreate={(name) => {
                        setCreateTagDialogState({
                          open: true,
                          defaultValue: name
                        });
                      }}
                    />
                  )}
                </form.Subscribe>
              )}
            </form.AppField>
          </Box>
        </Flex>
      </ResponsiveDialog.Body>

      <ResponsiveDialog.Footer>
        <ResponsiveDialog.CloseTrigger>
          <Button type="button" variant="secondary" disabled={form.state.isSubmitting}>
            Cancel
          </Button>
        </ResponsiveDialog.CloseTrigger>

        <form.Subscribe
          selector={(form) => ({
            canSubmit: form.canSubmit,
            isDirty: form.isDirty,
            isSubmitting: form.isSubmitting
          })}
        >
          {({ canSubmit, isDirty, isSubmitting }) => (
            <Button variant="primary" disabled={!canSubmit || !isDirty} loading={isSubmitting}>
              Save
            </Button>
          )}
        </form.Subscribe>
      </ResponsiveDialog.Footer>

      <CreateTagDialog
        open={createTagDialogState.open}
        defaultValue={createTagDialogState.defaultValue}
        onOpenChange={(open) => {
          setCreateTagDialogState({
            open,
            defaultValue: ''
          });
        }}
        onSubmit={async (tag) => {
          form.setFieldValue('tagIds', [...form.state.values.tagIds, tag.id]);

          setCreateTagDialogState({
            open: false,
            defaultValue: ''
          });

          return Promise.resolve();
        }}
      />
    </form>
  );
};

export const Form: React.FunctionComponent<FormProps> = (props) => {
  return (
    <Suspense
      fallback={
        <form>
          <ResponsiveDialog.Body>
            <Flex css={{ flexDirection: 'column', gap: '5' }}>
              <Item.Content>
                <Item.Title>Connection Details</Item.Title>
                <Item.Description>
                  Update your S3 connection credentials and endpoint.
                </Item.Description>
              </Item.Content>

              <Skeleton css={{ width: '100%', height: '16' }} />
              <Skeleton css={{ width: '100%', height: '16' }} />
              <Skeleton css={{ width: '100%', height: '16' }} />
              <Skeleton css={{ width: '100%', height: '16' }} />

              <Box>
                <Item.Content css={{ marginBottom: '2' }}>
                  <Item.Title>Tags</Item.Title>
                  <Item.Description>Add tags to organize your connections.</Item.Description>
                </Item.Content>

                <Flex css={{ gap: '1', paddingBlock: '1.5' }}>
                  <Skeleton css={{ width: '60px', height: '6' }} />
                  <Skeleton css={{ width: '80px', height: '6' }} />
                  <Skeleton css={{ width: '60px', height: '6' }} />
                </Flex>
              </Box>
            </Flex>
          </ResponsiveDialog.Body>

          <ResponsiveDialog.Footer>
            <ResponsiveDialog.CloseTrigger>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </ResponsiveDialog.CloseTrigger>

            <Button type="submit" variant="primary" disabled>
              Save
            </Button>
          </ResponsiveDialog.Footer>
        </form>
      }
    >
      <FormContent {...props} />
    </Suspense>
  );
};
