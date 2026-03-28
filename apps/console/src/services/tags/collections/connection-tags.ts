import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/react-db';
import type { CollectionContext } from '@/services/collections';

export function createConnectionTagsCollection(context: CollectionContext) {
  const connectionTagsCollection = createCollection(
    queryCollectionOptions({
      id: 'connection-tags',
      queryKey: ['tags', 'connection'],
      queryClient: context.queryClient,
      startSync: false,
      syncMode: 'eager',

      getKey: (item) => item.id,

      queryFn: async () => {
        return context.orpcClient.tags.getTagsForConnections();
      },

      onInsert: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(async (mutation) => {
            const response = await context.orpcClient.tags.addTagToConnection(mutation.modified);

            connectionTagsCollection.utils.writeInsert(response);
          })
        );

        return { refetch: false };
      },

      onDelete: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(async (mutation) => {
            await context.orpcClient.tags.removeTagFromConnection({
              id: mutation.original.id
            });

            connectionTagsCollection.utils.writeDelete(mutation.original.id);
          })
        );

        return { refetch: false };
      }
    })
  );

  return connectionTagsCollection;
}
