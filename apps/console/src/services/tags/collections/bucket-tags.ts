import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/react-db';
import type { CollectionContext } from '@/services/collections';

export function createBucketTagsCollection(context: CollectionContext) {
  const bucketTagsCollection = createCollection(
    queryCollectionOptions({
      id: 'bucket-tags',
      queryKey: ['tags', 'bucket'],
      queryClient: context.queryClient,
      startSync: false,
      syncMode: 'eager',

      getKey: (item) => item.id,

      queryFn: async () => {
        return context.orpcClient.tags.getTagsForBuckets();
      },

      onInsert: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(async (mutation) => {
            const response = await context.orpcClient.tags.addTagToBucket(mutation.modified);

            bucketTagsCollection.utils.writeInsert(response);
          })
        );

        return { refetch: false };
      },

      onDelete: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(async (mutation) => {
            await context.orpcClient.tags.removeTagFromBucket({
              id: mutation.original.id
            });

            bucketTagsCollection.utils.writeDelete(mutation.original.id);
          })
        );

        return { refetch: false };
      }
    })
  );

  return bucketTagsCollection;
}
