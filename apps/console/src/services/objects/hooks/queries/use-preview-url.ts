import { GetPreviewUrlRequest } from '@buckethub/rpc-contract';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

export function usePreviewUrl(data: GetPreviewUrlRequest) {
  const { orpcQuery } = useServicesContext();

  const queryOptions = orpcQuery.objects.getPreviewUrl.queryOptions({
    input: data
  });

  return useSuspenseQuery(queryOptions);
}
