import { FolderPlusIcon } from 'lucide-react';
import { Icon, ResponsiveDialog } from '@buckethub/ui';
import { NewFolderForm } from './form';

interface NewFolderDialogProps {
  children: React.ReactNode;
}

const Root: React.FunctionComponent<NewFolderDialogProps> = ({ children }) => {
  return (
    <ResponsiveDialog>
      {children}

      <ResponsiveDialog.Content>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.IconContainer>
            <Icon as={FolderPlusIcon} />
          </ResponsiveDialog.IconContainer>

          <ResponsiveDialog.Title>New Folder</ResponsiveDialog.Title>

          <ResponsiveDialog.Description>
            Create a new folder in the bucket.
          </ResponsiveDialog.Description>

          <ResponsiveDialog.Close />
        </ResponsiveDialog.Header>

        <NewFolderForm />
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
};

export const NewFolderDialog: typeof Root & {
  Trigger: typeof ResponsiveDialog.Trigger;
} = Object.assign(Root, {
  Trigger: ResponsiveDialog.Trigger
});
