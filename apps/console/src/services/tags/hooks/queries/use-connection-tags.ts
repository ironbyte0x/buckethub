import { ConnectionId } from '@buckethub/rpc-contract';
import { eq, useLiveSuspenseQuery } from '@tanstack/react-db';
import { useCollections } from '@/services/collections';

export function useConnectionTags(connectionId: ConnectionId) {
  const { connectionTagsCollection, tagsCollection } = useCollections();

  return useLiveSuspenseQuery((q) =>
    q
      .from({ connectionTag: connectionTagsCollection })
      .where(({ connectionTag }) => eq(connectionTag.connectionId, connectionId))
      .innerJoin({ tags: tagsCollection }, ({ tags, connectionTag }) =>
        eq(tags.id, connectionTag.tagId)
      )
      .select(({ tags, connectionTag }) => ({
        ...tags,
        mappingId: connectionTag.id
      }))
  );
}
