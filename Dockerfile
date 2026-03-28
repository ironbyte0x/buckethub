# Stage 1: Base - Install dependencies
FROM node:25.4.0-slim AS base

WORKDIR /app

RUN npm install -g bun@1.3.11

COPY . .

RUN bun ci

# Stage 2: Build - Build all projects via Nx
FROM base AS build

WORKDIR /app

RUN NX_DAEMON=false bun nx build console

# Stage 3: Compile - Create native binary
FROM build AS compile

WORKDIR /app

RUN bun build --compile --minify --target=bun \
  --outfile=/app/app \
  ./apps/backend/src/main.ts

# Stage 4: Runtime - Minimal production image
FROM debian:13.3-slim AS runtime

WORKDIR /app

COPY --from=compile /app/app ./app
COPY --from=build /app/apps/console/dist ./public
COPY --from=base /app/apps/backend/drizzle ./drizzle

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates cron && rm -rf /var/lib/apt/lists/*

RUN mkdir -p ./data

RUN echo "0 0 * * * /app/app cron:delete-expired-invitations >> /var/log/cron.log 2>&1" | crontab -

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
