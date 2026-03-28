import { Suspense } from 'react';
import { Flex } from '@buckethub/styled-system/jsx';
import { Accordion, Skeleton, State } from '@buckethub/ui';
import { EditConnectionDialog } from '@/modules/console/features/edit-connection';
import { useConnections } from '@/services/connections';
import { ConnectionItem } from './item';

const ConnectionsListContent: React.FunctionComponent = () => {
  const { data: connections } = useConnections();

  if (connections.length === 0) {
    return (
      <State>
        <State.Header>
          <State.Description>No connections yet</State.Description>
        </State.Header>
      </State>
    );
  }

  return (
    <>
      <Accordion
        multiple
        defaultValue={connections.map((connection) => connection.id)}
        data-testid="connections-list"
      >
        {connections.map((connection) => (
          <ConnectionItem key={connection.id} connection={connection} />
        ))}
      </Accordion>

      <EditConnectionDialog />
    </>
  );
};

const ConnectionsListSkeleton: React.FunctionComponent = () => {
  return (
    <Flex css={{ flexDirection: 'column', gap: '4' }}>
      <Skeleton css={{ height: '16', borderRadius: 'md' }} />
      <Skeleton css={{ height: '16', borderRadius: 'md' }} />
    </Flex>
  );
};

export const ConnectionsList: React.FunctionComponent = () => {
  return (
    <Suspense fallback={<ConnectionsListSkeleton />}>
      <ConnectionsListContent />
    </Suspense>
  );
};
