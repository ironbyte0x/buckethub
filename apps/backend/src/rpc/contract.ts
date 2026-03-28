import { contractRouter } from '@buckethub/rpc-contract';
import { implement, Router } from '@orpc/server';

export interface RpcContext {
  headers: Headers;
}

export const os = implement(contractRouter).$context<RpcContext>();

export type Contract = Router<typeof contractRouter, RpcContext>;
