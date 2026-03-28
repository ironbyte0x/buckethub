import { ORPCError } from '@orpc/client';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 30 * 60 * 1000,
      retry: (failureCount, error) => (error instanceof ORPCError ? false : failureCount < 3)
    }
  }
});
