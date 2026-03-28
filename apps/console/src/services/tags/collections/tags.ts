import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/react-db';
import type { CollectionContext } from '@/services/collections';

export function createTagsCollection(context: CollectionContext) {
  const tagsCollection = createCollection(
    queryCollectionOptions({
      id: 'tags',
      queryKey: ['tags', 'all'],
      queryClient: context.queryClient,
      startSync: false,
      syncMode: 'eager',

      getKey: (item) => item.id,

      queryFn: async () => {
        return context.orpcClient.tags.getAll();
      },

      onInsert: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(async (mutation) => {
            const response = await context.orpcClient.tags.create(mutation.modified);

            tagsCollection.utils.writeInsert(response);
          })
        );

        return { refetch: false };
      },

      onDelete: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(async (mutation) => {
            await context.orpcClient.tags.delete({ id: mutation.original.id });

            tagsCollection.utils.writeDelete(mutation.original.id);
          })
        );

        return { refetch: false };
      }
    })
  );

  return tagsCollection;
}
