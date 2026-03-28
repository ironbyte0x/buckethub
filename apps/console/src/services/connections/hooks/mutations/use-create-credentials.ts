import { useMutation } from '@tanstack/react-query';
import { useCollections } from '@/services/collections';
import { useServicesContext } from '@/services/context';

export function useCreateConnection() {
  const { orpcQuery } = useServicesContext();
  const { connectionsCollection } = useCollections();

  const mutationOptions = orpcQuery.connections.create.mutationOptions({
    onSuccess: (response) => {
      connectionsCollection.utils.writeInsert(response);
    }
  });

  return useMutation(mutationOptions);
}
