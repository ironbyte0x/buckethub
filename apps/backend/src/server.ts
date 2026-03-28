import { serve } from 'bun';
import { Context, Hono } from 'hono';
import { getConnInfo, serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { rateLimiter } from 'hono-rate-limiter';
import * as v from 'valibot';
import { Duration } from '@buckethub/core';
import { onError, ORPCError, ValidationError } from '@orpc/server';
import { RPCHandler } from '@orpc/server/fetch';
import { bootstrap } from './bootstrap';
import { TRUSTED_ORIGINS } from './constants';
import { environment } from './environment';
import { auth } from './instances';
import { router } from './rpc/router';
import { sqlite } from './shared/db/database';

export async function startServer() {
  const app = new Hono();

  app.use(secureHeaders());

  app.use(
    cors({
      origin: TRUSTED_ORIGINS,
      credentials: true,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );

  function getClientIp(context: Context) {
    const info = getConnInfo(context);

    return info.remote.address || 'unknown';
  }

  const authLimiter = rateLimiter({
    windowMs: Duration.inMinutes(1).toMilliseconds(),
    limit: environment.AUTH_RATE_LIMIT,
    keyGenerator: getClientIp
  });

  const rpcLimiter = rateLimiter({
    windowMs: Duration.inMinutes(1).toMilliseconds(),
    limit: environment.RPC_RATE_LIMIT,
    keyGenerator: getClientIp
  });

  app.get('/api/health', (context) => context.text('OK'));

  app.use('/api/auth/**', authLimiter);
  app.use('/rpc/*', rpcLimiter);

  app.on(['POST', 'GET'], '/api/auth/**', (context) => auth.handler(context.req.raw));

  const handler = new RPCHandler(router, {
    clientInterceptors: [
      onError((error) => {
        if (error instanceof ORPCError && error.code === 'INTERNAL_SERVER_ERROR') {
          if (error.cause instanceof ValidationError) {
            console.error('Output validation failed', JSON.stringify(error.cause.issues, null, 2));
          } else {
            console.error(error);
          }
        } else if (
          error instanceof ORPCError &&
          error.code === 'BAD_REQUEST' &&
          error.cause instanceof ValidationError
        ) {
          const issues = error.cause.issues as [v.BaseIssue<unknown>, ...v.BaseIssue<unknown>[]];
          const flat = v.flatten(issues);
          const messages = [
            ...(flat.root ?? []),
            ...Object.entries(flat.nested ?? {}).flatMap(([key, messages]) =>
              (messages ?? []).map((message) => `${key}: ${message}`)
            )
          ];

          throw new ORPCError('INPUT_VALIDATION_FAILED', {
            status: 422,
            message: messages.join('; ') || 'Validation failed',
            data: flat,
            cause: error.cause
          });
        } else {
          console.error(error);
        }
      })
    ]
  });

  app.use('/rpc/*', async (context, next) => {
    const { matched, response } = await handler.handle(context.req.raw, {
      prefix: '/rpc',
      context: { headers: context.req.raw.headers }
    });

    if (matched) {
      return context.newResponse(response.body, response);
    }

    await next();

    return;
  });

  app.use('/assets/*', serveStatic({ root: './public' }));
  app.use('/favicon.svg', serveStatic({ path: './public/favicon.svg' }));
  app.get('*', serveStatic({ path: './public/index.html' }));

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException', 1);
  });

  await bootstrap().catch((error) => {
    console.error(error);
    process.exit(1);
  });

  const server = serve({
    port: environment.PORT,
    fetch: app.fetch
  });

  console.log(`Server is running on http://localhost:${environment.PORT}`);

  async function gracefulShutdown(signal: string, exitCode = 0) {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    await server.stop();
    console.log('Server stopped successfully.');
    sqlite.close(false);
    process.exit(exitCode);
  }

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}
