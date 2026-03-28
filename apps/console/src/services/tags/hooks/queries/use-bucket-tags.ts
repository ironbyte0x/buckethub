import { BucketId } from '@buckethub/rpc-contract';
import { eq, useLiveSuspenseQuery } from '@tanstack/react-db';
import { useCollections } from '@/services/collections';

export function useBucketTags(bucketId: BucketId) {
  const { bucketTagsCollection, tagsCollection } = useCollections();

  return useLiveSuspenseQuery((q) =>
    q
      .from({ bucketTag: bucketTagsCollection })
      .where(({ bucketTag }) => eq(bucketTag.bucketId, bucketId))
      .innerJoin({ tags: tagsCollection }, ({ tags, bucketTag }) => eq(tags.id, bucketTag.tagId))
      .select(({ tags, bucketTag }) => ({
        ...tags,
        mappingId: bucketTag.id
      }))
  );
}
