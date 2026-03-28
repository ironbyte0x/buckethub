import { useLiveSuspenseQuery } from '@tanstack/react-db';
import { useCollections } from '@/services/collections';

export function useBuckets() {
  const { bucketsCollection } = useCollections();

  return useLiveSuspenseQuery((q) =>
    q.from({ bucket: bucketsCollection }).select(({ bucket }) => ({
      ...bucket
    }))
  );
}
