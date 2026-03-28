import { useMutation } from '@tanstack/react-query';
import { useCollections } from '@/services/collections';
import { useServicesContext } from '@/services/context';

export function useUpdateConnection() {
  const { orpcQuery } = useServicesContext();
  const { connectionsCollection } = useCollections();

  const mutationOptions = orpcQuery.connections.update.mutationOptions({
    onSuccess: (response) => {
      connectionsCollection.utils.writeUpdate(response);
    }
  });

  return useMutation(mutationOptions);
}
