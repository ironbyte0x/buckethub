import { Share2Icon } from 'lucide-react';
import { DialogTriggerProps } from '@base-ui/react/dialog';
import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { Icon, ResponsiveDialog } from '@buckethub/ui';
import { ShareObjectForm } from './form';

interface Payload {
  bucketId: BucketId;
  object: FileObject;
}

interface ContentProps {
  payload: Payload;
  onClose: () => void;
}

const Content: React.FunctionComponent<ContentProps> = ({ payload }) => {
  const { bucketId, object } = payload;

  return (
    <ResponsiveDialog.Content>
      <ResponsiveDialog.Header>
        <ResponsiveDialog.IconContainer>
          <Icon as={Share2Icon} />
        </ResponsiveDialog.IconContainer>

        <ResponsiveDialog.Title>Share Object</ResponsiveDialog.Title>

        <ResponsiveDialog.Description>
          Generate a temporary link to share object.
        </ResponsiveDialog.Description>

        <ResponsiveDialog.Close />
      </ResponsiveDialog.Header>

      <ResponsiveDialog.Body>
        <ShareObjectForm bucketId={bucketId} object={object} />
      </ResponsiveDialog.Body>
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

export const ShareObjectDialog = Object.assign(Root, {
  Trigger,
  Content
});
