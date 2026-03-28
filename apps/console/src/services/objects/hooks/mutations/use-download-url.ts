import { useMutation } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

export function useDownloadUrl() {
  const { orpcQuery } = useServicesContext();

  const mutationOptions = orpcQuery.objects.getDownloadUrl.mutationOptions();

  return useMutation(mutationOptions);
}
