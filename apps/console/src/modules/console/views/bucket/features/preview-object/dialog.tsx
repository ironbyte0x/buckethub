import { Suspense } from 'react';
import { CodeIcon } from 'lucide-react';
import { DialogTriggerProps } from '@base-ui/react/dialog';
import { BucketId, FileObject } from '@buckethub/rpc-contract';
import { Box, Flex } from '@buckethub/styled-system/jsx';
import { Icon, ResponsiveDialog, ScrollArea, Skeleton, Text } from '@buckethub/ui';
import { formatBytes } from '@/shared/utils';
import { PreviewContent } from './preview';

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
    <ResponsiveDialog.Content
      css={{
        display: 'grid',
        gridTemplateRows: 'auto minmax(0px, 1fr)',
        overflow: 'hidden',

        lg: {
          maxWidth: 'min(90vw, 800px)'
        }
      }}
    >
      <ResponsiveDialog.Header css={{ display: 'flex' }}>
        <ResponsiveDialog.IconContainer>
          <Icon as={CodeIcon} />
        </ResponsiveDialog.IconContainer>

        <Flex
          css={{
            flexDirection: 'column',
            gap: '1',
            flex: '1',
            minWidth: '0'
          }}
        >
          <ResponsiveDialog.Title css={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {object.name}
          </ResponsiveDialog.Title>

          <Flex css={{ gap: '2', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text variant="caption" color="muted">
              {object.contentType || 'Unknown'}
            </Text>

            <Text variant="caption" color="subtle">
              {formatBytes(object.size || 0)}
            </Text>

            {object.lastModified && (
              <Text variant="caption" color="subtle">
                Modified {new Date(object.lastModified).toLocaleDateString()}
              </Text>
            )}
          </Flex>
        </Flex>

        <ResponsiveDialog.Close />
      </ResponsiveDialog.Header>

      <ResponsiveDialog.Body
        css={{
          padding: '0',
          height: '100%',

          lg: {
            minHeight: '300px',
            minWidth: '500px'
          }
        }}
      >
        <Suspense
          fallback={
            <Box
              css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                padding: '6'
              }}
            >
              <Skeleton css={{ width: '100%', height: '400px' }} />
            </Box>
          }
        >
          <ScrollArea css={{ height: '100%' }}>
            <ScrollArea.Viewport>
              <ScrollArea.Content>
                <PreviewContent bucketId={bucketId} object={object} />
              </ScrollArea.Content>
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>

            <ScrollArea.Scrollbar orientation="horizontal">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea>
        </Suspense>
      </ResponsiveDialog.Body>
    </ResponsiveDialog.Content>
  );
};

type ResponsiveDialogHandle = NonNullable<React.ComponentProps<typeof ResponsiveDialog>['handle']>;

const handle: ResponsiveDialogHandle = ResponsiveDialog.createHandle<Payload>();

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

type PreviewObjectDialogComponent = React.FunctionComponent & {
  Trigger: React.FunctionComponent<TriggerProps>;
  Content: React.FunctionComponent<ContentProps>;
  handle: typeof handle;
};

export const PreviewObjectDialog: PreviewObjectDialogComponent = Object.assign(Root, {
  Trigger,
  Content,
  handle
});
