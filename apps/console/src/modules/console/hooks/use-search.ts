import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';

export type SearchKeys<TItem> = (keyof TItem)[];

export function useSearch<TItem>(items: TItem[], keys: SearchKeys<TItem>) {
  const [searchTerm, setSearchTerm] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: keys as string[],
        threshold: 0.3
      }),
    [items, keys]
  );

  const results = useMemo(
    () => (searchTerm ? fuse.search(searchTerm).map((result) => result.item) : items),
    [fuse, items, searchTerm]
  );

  const shouldShowSearch = items.length > 5;

  return {
    results,
    setSearchTerm,
    shouldShowSearch
  } as const;
}
