import { PencilIcon } from 'lucide-react';
import { Bucket } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Icon, ResponsiveDialog } from '@buckethub/ui';
import { Form } from './form';

interface Payload {
  bucket: Bucket;
}

const handle = ResponsiveDialog.createHandle<Payload>();

const Root: React.FunctionComponent = () => {
  return (
    <ResponsiveDialog handle={handle}>
      {({ payload }) => {
        if (!payload) {
          return null;
        }

        const { bucket } = payload as Payload;

        return (
          <ResponsiveDialog.Content>
            <Flex css={{ flexDirection: 'column' }}>
              <ResponsiveDialog.Header>
                <ResponsiveDialog.IconContainer>
                  <Icon as={PencilIcon} size="lg" />
                </ResponsiveDialog.IconContainer>

                <ResponsiveDialog.Title>Edit Bucket</ResponsiveDialog.Title>

                <ResponsiveDialog.Description>
                  Update bucket details for "{bucket.name}".
                </ResponsiveDialog.Description>

                <ResponsiveDialog.Close />
              </ResponsiveDialog.Header>

              <Form bucket={bucket} onSuccess={() => handle.close()} />
            </Flex>
          </ResponsiveDialog.Content>
        );
      }}
    </ResponsiveDialog>
  );
};

interface TriggerProps extends Omit<
  React.ComponentProps<typeof ResponsiveDialog.Trigger>,
  'handle' | 'payload'
> {
  bucket: Bucket;
}

const Trigger: React.FunctionComponent<TriggerProps> = ({ bucket, ...props }) => {
  return <ResponsiveDialog.Trigger {...props} handle={handle} payload={{ bucket }} />;
};

export const EditBucketDialog = Object.assign(Root, {
  Trigger
});
