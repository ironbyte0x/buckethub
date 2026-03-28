import type { ClientContext, ClientOptions } from '@orpc/client';
import type { RouterInputs, RouterOutputs } from '@/services/rpc';

export type ProcedureHandler<
  TRouter extends keyof RouterInputs,
  TProcedure extends keyof RouterInputs[TRouter] & keyof RouterOutputs[TRouter]
> = (
  input: RouterInputs[TRouter][TProcedure],
  options: ClientOptions<ClientContext>
) => Promise<RouterOutputs[TRouter][TProcedure]> | RouterOutputs[TRouter][TProcedure];

export type Handlers = {
  [K in keyof RouterInputs]: {
    [P in keyof RouterInputs[K] & keyof RouterOutputs[K]]: ProcedureHandler<K, P>;
  };
};

export type HandlerFunction = (
  input: unknown,
  options: ClientOptions<ClientContext>
) => Promise<unknown> | unknown;

export type HandlerRegistry<T extends keyof RouterInputs> = {
  [K in keyof RouterInputs[T] & keyof RouterOutputs[T]]: ProcedureHandler<T, K>;
};
