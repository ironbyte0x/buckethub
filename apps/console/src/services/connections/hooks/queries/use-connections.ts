import { useLiveSuspenseQuery } from '@tanstack/react-db';
import { useCollections } from '@/services/collections';

export function useConnections() {
  const { connectionsCollection } = useCollections();

  return useLiveSuspenseQuery((q) => q.from({ connection: connectionsCollection }));
}
