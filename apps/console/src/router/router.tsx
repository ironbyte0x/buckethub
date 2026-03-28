import { createRootRouteWithContext, createRouter, Navigate } from '@tanstack/react-router';
import { createAuthRoutesTree } from '../modules/auth';
import { createConsoleRoutesTree } from '../modules/console';
import { RootContext } from './types';

const rootRoute = createRootRouteWithContext<RootContext>()({
  notFoundComponent: () => <Navigate to="/" replace />
});

const routeTree = rootRoute.addChildren([
  createAuthRoutesTree(rootRoute),
  createConsoleRoutesTree(rootRoute)
]);

export const router = createRouter({
  routeTree,
  context: {} as RootContext
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
