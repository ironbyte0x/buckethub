import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { useAuth } from './services/auth';
import { useCollections } from './services/collections/context';
import { useServicesContext } from './services/context';

function useInitialLoader(isLoading: boolean) {
  useEffect(() => {
    const loader = document.getElementById('initial-loader');

    if (!loader) {
      return;
    }

    if (isLoading) {
      loader.classList.remove('hidden');
    } else {
      loader.classList.add('hidden');
    }
  }, [isLoading]);
}

export const App: React.FunctionComponent = () => {
  const { isPending, authClient } = useAuth();
  const { orpcQuery } = useServicesContext();
  const queryClient = useQueryClient();
  const collections = useCollections();

  useInitialLoader(isPending);

  if (isPending) {
    return null;
  }

  return (
    <RouterProvider
      router={router}
      context={{
        collections,
        orpcQuery,
        authClient,
        queryClient
      }}
    />
  );
};
