import * as v from 'valibot';

const environmentSchema = v.object({
  DB_CONNECTION_STRING: v.optional(v.pipe(v.string(), v.minLength(1)), 'data/db.sqlite'),
  SECRET_ENCRYPTION_KEY: v.pipe(
    v.string(),
    v.minLength(44, 'SECRET_ENCRYPTION_KEY must be a base64-encoded 32-byte key')
  ),
  AUTH_SECRET: v.pipe(v.string(), v.minLength(32, 'AUTH_SECRET must be at least 32 characters')),
  BASE_URL: v.pipe(v.string(), v.url()),
  PORT: v.optional(v.pipe(v.unknown(), v.transform(Number), v.number()), 3000),
  SMTP_HOST: v.optional(v.string()),
  SMTP_PORT: v.optional(v.pipe(v.unknown(), v.transform(Number), v.number())),
  SMTP_USER: v.optional(v.string()),
  SMTP_PASS: v.optional(v.string()),
  SMTP_FROM: v.optional(v.string()),
  ADMIN_EMAIL: v.optional(v.string()),
  ADMIN_PASSWORD: v.optional(
    v.pipe(v.string(), v.minLength(12, 'ADMIN_PASSWORD must be at least 12 characters'))
  ),
  ADMIN_NAME: v.optional(v.string()),
  AUTH_RATE_LIMIT: v.optional(v.pipe(v.unknown(), v.transform(Number), v.number()), 10),
  RPC_RATE_LIMIT: v.optional(v.pipe(v.unknown(), v.transform(Number), v.number()), 100)
});

export const environment = v.parse(environmentSchema, process.env);
