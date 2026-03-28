import { PencilIcon } from 'lucide-react';
import { DialogTriggerProps } from '@base-ui/react/dialog';
import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { Icon, ResponsiveDialog } from '@buckethub/ui';
import { RenameObjectForm } from './form';

interface Payload {
  bucketId: BucketId;
  object: FileObject;
}

interface ContentProps {
  payload: Payload;
  onClose: () => void;
}

const Content: React.FunctionComponent<ContentProps> = ({ payload, onClose }) => {
  const { bucketId, object } = payload;

  return (
    <ResponsiveDialog.Content>
      <ResponsiveDialog.Header>
        <ResponsiveDialog.IconContainer>
          <Icon as={PencilIcon} />
        </ResponsiveDialog.IconContainer>

        <ResponsiveDialog.Title>Rename Object</ResponsiveDialog.Title>

        <ResponsiveDialog.Description>Enter a new key for the object.</ResponsiveDialog.Description>

        <ResponsiveDialog.Close />
      </ResponsiveDialog.Header>

      <RenameObjectForm bucketId={bucketId} object={object} onSuccess={onClose} />
    </ResponsiveDialog.Content>
  );
};

const handle = ResponsiveDialog.createHandle<Payload>();

const Root: React.FunctionComponent = () => {
  return (
    <ResponsiveDialog handle={handle}>
      {({ payload }) => {
        if (!payload) {
          return null;
        }

        return <Content payload={payload as Payload} onClose={() => handle.close()} />;
      }}
    </ResponsiveDialog>
  );
};

interface TriggerProps extends DialogTriggerProps<Payload> {
  payload: Payload;
}

const Trigger: React.FunctionComponent<TriggerProps> = (props) => {
  return <ResponsiveDialog.Trigger handle={handle} {...props} />;
};

export const RenameObjectDialog = Object.assign(Root, {
  Trigger,
  Content
});
