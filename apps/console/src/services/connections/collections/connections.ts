import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/react-db';
import type { createBucketsCollection } from '@/services/buckets';
import type { CollectionContext } from '@/services/collections';
import type { createBucketTagsCollection } from '@/services/tags';

interface ConnectionsCollectionDependencies {
  bucketsCollection: ReturnType<typeof createBucketsCollection>;
  bucketTagsCollection: ReturnType<typeof createBucketTagsCollection>;
}

export function createConnectionsCollection(
  context: CollectionContext,
  dependencies: ConnectionsCollectionDependencies
) {
  const connectionsCollection = createCollection(
    queryCollectionOptions({
      id: 'connections',
      queryKey: ['connections', 'all'],
      queryClient: context.queryClient,
      startSync: false,
      syncMode: 'eager',

      getKey: (item) => item.id,

      queryFn: async () => {
        return context.orpcClient.connections.getAll();
      },

      onDelete: async ({ transaction }) => {
        await Promise.all(
          transaction.mutations.map(async (mutation) => {
            await context.orpcClient.connections.delete({
              id: mutation.original.id
            });

            connectionsCollection.utils.writeDelete(mutation.original.id);
            dependencies.bucketsCollection.utils.refetch();
            dependencies.bucketTagsCollection.utils.refetch();
          })
        );

        return { refetch: false };
      }
    })
  );

  return connectionsCollection;
}
