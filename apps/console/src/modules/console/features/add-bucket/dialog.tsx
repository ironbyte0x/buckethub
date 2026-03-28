import { Suspense, useState } from 'react';
import { Flex } from '@buckethub/styled-system/jsx';
import { AnimatedPanel, Icon, ResponsiveDialog } from '@buckethub/ui';
import AddBucketIcon from '@/assets/icons/add-bucket-icon.svg?react';
import { Form } from './form';

const handle = ResponsiveDialog.createHandle();

const Root: React.FunctionComponent = () => {
  const [dismissible, setDismissible] = useState(true);

  return (
    <ResponsiveDialog
      handle={handle}
      dismissible={dismissible}
      onOpenChange={(open) => {
        if (!open) {
          setDismissible(true);
        }
      }}
    >
      <ResponsiveDialog.Content>
        <AnimatedPanel>
          <Flex css={{ flexDirection: 'column' }}>
            <ResponsiveDialog.Header>
              <ResponsiveDialog.IconContainer>
                <Icon as={AddBucketIcon} size="xl" />
              </ResponsiveDialog.IconContainer>

              <ResponsiveDialog.Title>Add New Bucket</ResponsiveDialog.Title>

              <ResponsiveDialog.Description>
                Enter the details of the new bucket you want to connect.
              </ResponsiveDialog.Description>

              <ResponsiveDialog.Close />
            </ResponsiveDialog.Header>

            <Suspense fallback={null}>
              <Form onClose={() => handle.close()} onDirty={() => setDismissible(false)} />
            </Suspense>
          </Flex>
        </AnimatedPanel>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
};

type TriggerProps = Omit<React.ComponentProps<typeof ResponsiveDialog.Trigger>, 'handle'>;

const Trigger: React.FunctionComponent<TriggerProps> = (props) => {
  return <ResponsiveDialog.Trigger {...props} handle={handle} />;
};

export const AddBucketDialog = Object.assign(Root, {
  Trigger
});
