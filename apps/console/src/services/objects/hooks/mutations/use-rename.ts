import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';
import { getKeyPrefix } from '@/shared/lib';
import { objectsQueryOptions } from '../queries';

export function useRenameObject() {
  const queryClient = useQueryClient();
  const { orpcQuery } = useServicesContext();

  const mutationOptions = orpcQuery.objects.rename.mutationOptions({
    onSuccess: (_, { bucketId, oldKey }) => {
      queryClient.invalidateQueries(
        objectsQueryOptions(orpcQuery, { bucketId, prefix: getKeyPrefix(oldKey) })
      );
    }
  });

  return useMutation(mutationOptions);
}
