import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/react-db';
import type { CollectionContext } from '@/services/collections';

export function createBucketsCollection(context: CollectionContext) {
  const bucketsCollection = createCollection(
    queryCollectionOptions({
      id: 'buckets',
      queryKey: ['buckets', 'all'],
      queryClient: context.queryClient,
      startSync: false,
      syncMode: 'eager',
      getKey: (item) => item.id,

      queryFn: async () => {
        return context.orpcClient.buckets.getAll();
      },

      onInsert: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(async (mutation) => {
            const response = await context.orpcClient.buckets.addBucket(mutation.modified);

            bucketsCollection.utils.writeInsert(response);
          })
        );

        return { refetch: false };
      },

      onDelete: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(async (mutation) => {
            await context.orpcClient.buckets.delete({ id: mutation.original.id });

            bucketsCollection.utils.writeDelete(mutation.original.id);
          })
        );

        return { refetch: false };
      }
    })
  );

  return bucketsCollection;
}
