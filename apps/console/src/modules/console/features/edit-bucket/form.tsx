import { Suspense, useMemo, useState } from 'react';
import { Bucket, Tag, TagId } from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Button, Item, ResponsiveDialog, Skeleton } from '@buckethub/ui';
import { CreateTagDialog } from '@/modules/console/features/create-tag';
import { TagsInput } from '@/modules/console/features/tag-manager';
import { useCollections } from '@/services/collections';
import { generateBucketTagMappingId, useBucketTags, useTags } from '@/services/tags';
import { useAppForm } from '@/shared/form';

interface FormProps {
  bucket: Bucket;
  onSuccess: () => void;
}

interface EditBucketFormValues {
  tagIds: TagId[];
}

const FormContent: React.FunctionComponent<FormProps> = ({ bucket, onSuccess }) => {
  const { bucketTagsCollection } = useCollections();
  const { data: allTags } = useTags();
  const { data: bucketTags } = useBucketTags(bucket.id);

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
      tagIds: bucketTags.map((tag) => tag.id)
    } satisfies EditBucketFormValues as EditBucketFormValues,
    onSubmit: async ({ value }) => {
      const initialTagIds = new Set(bucketTags.map((tag) => tag.id));
      const selectedTagIds = new Set(value.tagIds);

      const addedTagIds = value.tagIds.filter((id) => !initialTagIds.has(id));
      const removedTagIds = bucketTags
        .filter((tag) => !selectedTagIds.has(tag.id))
        .map((tag) => tag.mappingId);

      const promises: Promise<unknown>[] = [];

      if (addedTagIds.length) {
        const addTransaction = bucketTagsCollection.insert(
          addedTagIds.map((tagId) => ({
            id: generateBucketTagMappingId(),
            bucketId: bucket.id,
            tagId
          }))
        );

        promises.push(addTransaction.isPersisted.promise);
      }

      if (removedTagIds.length) {
        const removeTransaction = bucketTagsCollection.delete(removedTagIds);

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
        <Box>
          <Item.Content css={{ marginBottom: '2' }}>
            <Item.Title>Tags</Item.Title>
            <Item.Description>Add tags to organize your buckets.</Item.Description>
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
      </ResponsiveDialog.Body>

      <ResponsiveDialog.Footer>
        <ResponsiveDialog.CloseTrigger>
          <Button type="button" variant="secondary" disabled={form.state.isSubmitting}>
            Cancel
          </Button>
        </ResponsiveDialog.CloseTrigger>

        <Button type="submit" variant="primary" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? 'Saving...' : 'Save'}
        </Button>
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
            <Box>
              <Item.Content css={{ marginBottom: '2' }}>
                <Item.Title>Tags</Item.Title>
                <Item.Description>Add tags to organize your buckets.</Item.Description>
              </Item.Content>

              <Flex css={{ gap: '1', paddingBlock: '1.5' }}>
                <Skeleton css={{ width: '60px', height: '6' }} />
                <Skeleton css={{ width: '80px', height: '6' }} />
                <Skeleton css={{ width: '60px', height: '6' }} />
              </Flex>
            </Box>
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
