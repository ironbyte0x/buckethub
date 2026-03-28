import { useLiveSuspenseQuery } from '@tanstack/react-db';
import { useCollections } from '@/services/collections';

export function useTags() {
  const { tagsCollection } = useCollections();

  return useLiveSuspenseQuery((q) =>
    q.from({ tag: tagsCollection }).select(({ tag }) => ({
      ...tag
    }))
  );
}
