import { Tag } from '@buckethub/rpc-contract';
import { Button, ResponsiveDialog } from '@buckethub/ui';
import { useCollections } from '@/services/collections';
import { generateTagId } from '@/services/tags';
import { useAppForm } from '@/shared/form';
import { createTagSchema } from './schema';

interface CreateTagDialogProps {
  open?: boolean;
  defaultValue?: string;
  onSubmit: (tag: Tag) => Promise<void>;
  onOpenChange?: (open: boolean) => void;
}

export const CreateTagDialog: React.FunctionComponent<CreateTagDialogProps> = ({
  open,
  defaultValue = '',
  onSubmit,
  onOpenChange
}) => {
  const { tagsCollection } = useCollections();

  const form = useAppForm({
    defaultValues: {
      name: defaultValue
    },
    validators: {
      onSubmit: createTagSchema
    },
    onSubmit: async ({ value }) => {
      const tag: Tag = {
        id: generateTagId(),
        name: value.name,
        createdAt: new Date()
      };

      const transaction = tagsCollection.insert(tag);

      await transaction.isPersisted.promise;
      await onSubmit(tag);
    }
  });

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialog.Content>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>Create New Tag</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>Enter a name for the new tag.</ResponsiveDialog.Description>
        </ResponsiveDialog.Header>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <ResponsiveDialog.Body>
            <form.AppField name="name">
              {(field) => <field.TextInput label="Tag name" placeholder="Enter tag name" />}
            </form.AppField>
          </ResponsiveDialog.Body>

          <ResponsiveDialog.Footer>
            <ResponsiveDialog.CloseTrigger
              render={(props) => (
                <Button variant="secondary" {...props}>
                  Cancel
                </Button>
              )}
            />

            <form.Subscribe
              selector={(form) => ({
                canSubmit: form.canSubmit,
                isSubmitting: form.isSubmitting
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button variant="primary" disabled={!canSubmit} loading={isSubmitting}>
                  Create
                </Button>
              )}
            </form.Subscribe>
          </ResponsiveDialog.Footer>
        </form>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
};
