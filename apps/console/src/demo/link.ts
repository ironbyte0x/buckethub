import type { ClientLink, ClientOptions } from '@orpc/client';
import { handlers } from './handlers';
import { demoState, saveDemoState } from './state';
import { HandlerFunction } from './types';

export function createDemoLink(): ClientLink<Record<string, unknown>> {
  return {
    async call(
      path: readonly string[],
      input: unknown,
      options: ClientOptions<Record<string, unknown>>
    ): Promise<unknown> {
      const key = path.join('.');

      const handler = path.reduce(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (accumulator, part) => accumulator?.[part],
        handlers as Record<string, unknown> | HandlerFunction | undefined
      ) as HandlerFunction | undefined;

      if (!handler) {
        throw new Error(`Demo mode: No handler for ${key}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 150));

      const result = await handler(input, options);

      saveDemoState(demoState);

      return result;
    }
  };
}
