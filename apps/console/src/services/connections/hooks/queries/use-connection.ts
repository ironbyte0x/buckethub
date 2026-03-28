import { ConnectionId } from '@buckethub/rpc-contract';
import { eq, useLiveSuspenseQuery } from '@tanstack/react-db';
import { useCollections } from '@/services/collections';

export function useConnection(connectionId: ConnectionId) {
  const { connectionsCollection } = useCollections();

  return useLiveSuspenseQuery((q) =>
    q
      .from({ connection: connectionsCollection })
      .where(({ connection }) => eq(connection.id, connectionId))
      .findOne()
  );
}
