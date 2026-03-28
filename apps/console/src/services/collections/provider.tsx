import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useServicesContext } from '../context';
import { CollectionsContext } from './context';
import { createCollections } from './create';

interface CollectionsProviderProps {
  children: React.ReactNode;
}

export const CollectionsProvider: React.FunctionComponent<CollectionsProviderProps> = ({
  children
}) => {
  const { orpc } = useServicesContext();
  const queryClient = useQueryClient();
  const [collections] = useState(() => createCollections({ orpcClient: orpc, queryClient }));

  return <CollectionsContext.Provider value={collections}>{children}</CollectionsContext.Provider>;
};
