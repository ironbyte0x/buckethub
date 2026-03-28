import { createContext, useContext } from 'react';
import { Collections } from './types';

export const CollectionsContext = createContext<Collections | null>(null);

export function useCollections() {
  const context = useContext(CollectionsContext);

  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }

  return context;
}
