import { QueryClient } from '@tanstack/react-query';
import { Register, RootRoute as TanstackRootRoute } from '@tanstack/react-router';
import { AuthClient } from '@/services/auth';
import { Collections } from '@/services/collections';
import { ORPCQuery } from '@/services/rpc';

export interface RootContext {
  collections: Collections;
  orpcQuery: ORPCQuery;
  authClient: AuthClient;
  queryClient: QueryClient;
}

export type RootRoute = TanstackRootRoute<Register, undefined, RootContext>;
