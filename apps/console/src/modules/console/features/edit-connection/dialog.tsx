import { PencilIcon } from 'lucide-react';
import { Connection } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Icon, ResponsiveDialog } from '@buckethub/ui';
import { Form } from './form';

interface Payload {
  connection: Connection;
}

const handle = ResponsiveDialog.createHandle<Payload>();

const Root: React.FunctionComponent = () => {
  return (
    <ResponsiveDialog handle={handle}>
      {({ payload }) => {
        if (!payload) {
          return null;
        }

        const { connection } = payload as Payload;

        return (
          <ResponsiveDialog.Content>
            <Flex css={{ flexDirection: 'column' }}>
              <ResponsiveDialog.Header>
                <ResponsiveDialog.IconContainer>
                  <Icon as={PencilIcon} size="lg" />
                </ResponsiveDialog.IconContainer>

                <ResponsiveDialog.Title>Edit Connection</ResponsiveDialog.Title>

                <ResponsiveDialog.Description>
                  Update connection details.
                </ResponsiveDialog.Description>

                <ResponsiveDialog.Close />
              </ResponsiveDialog.Header>

              <Form connection={connection} onSuccess={() => handle.close()} />
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
  connection: Connection;
}

const Trigger: React.FunctionComponent<TriggerProps> = ({ connection, ...props }) => {
  return <ResponsiveDialog.Trigger {...props} handle={handle} payload={{ connection }} />;
};

export const EditConnectionDialog = Object.assign(Root, {
  Trigger
});
