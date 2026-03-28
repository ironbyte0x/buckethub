import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';
import { RouterInputs } from '@/services/rpc';
import { objectsQueryOptions } from '../queries';

export function useCopyObject() {
  const queryClient = useQueryClient();
  const { orpcQuery } = useServicesContext();

  const mutationOptions = orpcQuery.objects.copyObject.mutationOptions({
    onSuccess: (_, { bucketId }) => {
      queryClient.invalidateQueries(
        objectsQueryOptions(orpcQuery, { bucketId } as RouterInputs['objects']['getAllByBucketId'])
      );
    }
  });

  return useMutation(mutationOptions);
}
