import { useCallback, useState } from 'react';
import { BucketId } from '@buckethub/rpc-contract';
import { useQueryClient } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';

function preloadFile(url: string, contentType: string): Promise<void> {
  if (contentType.startsWith('image/')) {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = url;
    });
  }

  if (contentType.startsWith('text/')) {
    return fetch(url).catch(() => {
      // Intentionally empty — primes HTTP cache only
    }) as Promise<void>;
  }

  return Promise.resolve();
}

interface PreloadPreviewInput {
  bucketId: BucketId;
  key: string;
}

export function usePreloadPreview() {
  const queryClient = useQueryClient();
  const { orpcQuery } = useServicesContext();
  const [isLoading, setIsLoading] = useState(false);

  const preload = useCallback(
    async (input: PreloadPreviewInput) => {
      setIsLoading(true);

      try {
        const queryOptions = orpcQuery.objects.getPreviewUrl.queryOptions({
          input: { bucketId: input.bucketId, key: input.key }
        });

        const data = await queryClient.ensureQueryData(queryOptions);

        if (data.contentType) {
          await preloadFile(data.url, data.contentType);
        }
      } catch {
        // Dialog will handle errors via Suspense/ErrorBoundary
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient, orpcQuery]
  );

  return { preload, isLoading };
}
