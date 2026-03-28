import { useMutation } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

export function useGenerateShareUrl() {
  const { orpcQuery } = useServicesContext();

  const mutationOptions = orpcQuery.objects.generateShareUrl.mutationOptions();

  return useMutation(mutationOptions);
}
