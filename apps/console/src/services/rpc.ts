import { contractRouter } from '@buckethub/rpc-contract';
import { ClientContext, ClientLink, createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import {
  ContractRouterClient,
  InferContractRouterInputs,
  InferContractRouterOutputs
} from '@orpc/contract';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { environment } from '@/environment';

export function createServices(link: ClientLink<ClientContext>) {
  const orpc: ContractRouterClient<typeof contractRouter> = createORPCClient(link);
  const orpcQuery = createTanstackQueryUtils(orpc);

  return { orpc, orpcQuery };
}

const link = new RPCLink({
  url: `${environment.VITE_API_BASE_URL}/rpc`,
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: 'include'
    });
  }
});

const { orpc, orpcQuery } = createServices(link);

export { orpc, orpcQuery };

export type ORPCClient = typeof orpc;
export type ORPCQuery = typeof orpcQuery;

export type RouterInputs = InferContractRouterInputs<typeof contractRouter>;
export type RouterOutputs = InferContractRouterOutputs<typeof contractRouter>;
