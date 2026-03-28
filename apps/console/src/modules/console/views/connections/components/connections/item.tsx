import { Suspense, useMemo } from 'react';
import { ChevronDownIcon, PencilIcon, PlugIcon, TrashIcon } from 'lucide-react';
import type { Connection, ConnectionId } from '@buckethub/rpc-contract';
import { Flex } from '@buckethub/styled-system/jsx';
import { Accordion, alert, Badge, Icon, IconButton, Text } from '@buckethub/ui';
import { EditConnectionDialog } from '@/modules/console/features/edit-connection';
import { useBuckets } from '@/services/buckets';
import { useCollections } from '@/services/collections';
import { useConnectionTags } from '@/services/tags';
import { BucketsList } from '../buckets';
import { StyledConnectionIcon } from './item.styled';

interface ConnectionItemProps {
  connection: Connection;
}

export const ConnectionItem: React.FunctionComponent<ConnectionItemProps> = ({ connection }) => {
  const { connectionsCollection } = useCollections();
  const { data: tags } = useConnectionTags(connection.id);

  const onDeleteClick = () => {
    alert({
      title: 'Delete Connection',
      description: (
        <>
          Are you sure you want to delete the connection{' '}
          <Text variant="body-large-emphasized" css={{ whiteSpace: 'nowrap' }}>
            "{connection.label}"
          </Text>
          ?
          <br />
          <br />
          <Text variant="body-medium" css={{ color: 'text-base-error' }}>
            Warning: This connection contains buckets that will also be deleted. This action cannot
            be undone.
          </Text>
        </>
      ),
      actions: {
        confirm: {
          label: 'Delete',
          variant: 'destructive',
          onClick: async () => {
            const transaction = connectionsCollection.delete(connection.id);

            await transaction.isPersisted.promise;
          }
        }
      }
    });
  };

  return (
    <Accordion.Item value={connection.id.toString()}>
      <Accordion.Trigger
        render={(props, state) => (
          <Accordion.Header {...props}>
            <Flex css={{ alignItems: 'center', gap: '3', flex: '1' }}>
              <StyledConnectionIcon>
                <Icon as={PlugIcon} size="sm" />
              </StyledConnectionIcon>

              <Flex css={{ flexDirection: 'column', gap: '0.5' }}>
                <Flex
                  css={{
                    gap: '1.5',
                    alignItems: 'center'
                  }}
                >
                  <Text variant="body-medium-emphasized">{connection.label}</Text>

                  <Flex css={{ gap: '1' }}>
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        size="md"
                        aria-label={tag.name}
                        variant="secondary"
                        css={{ marginBlock: '-1' }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </Flex>
                </Flex>

                <Flex css={{ alignItems: 'center', gap: '2' }}>
                  <Suspense
                    fallback={
                      <Text variant="caption" color="muted">
                        Loading...
                      </Text>
                    }
                  >
                    <ConnectionStats connectionId={connection.id} />
                  </Suspense>
                </Flex>
              </Flex>
            </Flex>

            <Flex css={{ gap: '2', alignItems: 'center' }}>
              <EditConnectionDialog.Trigger
                connection={connection}
                render={(props) => (
                  <IconButton
                    {...props}
                    variant="ghost"
                    size="sm"
                    aria-label="Edit connection"
                    onClick={(event) => {
                      event.stopPropagation();
                      props.onClick?.(event);
                    }}
                  >
                    <Icon as={PencilIcon} size="sm" color="base" />
                  </IconButton>
                )}
              />

              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Delete connection"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteClick();
                }}
              >
                <Icon as={TrashIcon} size="sm" color="base" />
              </IconButton>

              <IconButton variant="ghost" size="sm" aria-label={state.open ? 'Collapse' : 'Expand'}>
                <Accordion.Chevron>
                  <Icon as={ChevronDownIcon} size="sm" color="base" />
                </Accordion.Chevron>
              </IconButton>
            </Flex>
          </Accordion.Header>
        )}
      />

      <Accordion.Panel>
        <BucketsList connectionId={connection.id} />
      </Accordion.Panel>
    </Accordion.Item>
  );
};

const ConnectionStats: React.FunctionComponent<{
  connectionId: ConnectionId;
}> = ({ connectionId }) => {
  const { data: allBuckets } = useBuckets();

  const buckets = useMemo(
    () => allBuckets.filter((bucket) => bucket.connectionId === connectionId),
    [allBuckets, connectionId]
  );

  return (
    <Text variant="caption" color="muted">
      {buckets.length} {buckets.length === 1 ? 'bucket' : 'buckets'}
    </Text>
  );
};
