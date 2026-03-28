import { randomBytes } from 'node:crypto';
import { $ } from 'bun';
import { existsSync } from 'fs';

if (!existsSync('package.json') || !existsSync('apps/backend/package.json')) {
  console.error('Error: Run this script from the repository root.');
  process.exit(1);
}

await $`bun install`;

const CONSOLE_ENV = 'apps/console/.env';
const BACKEND_ENV = 'apps/backend/.env';

if (existsSync(CONSOLE_ENV)) {
  console.log(`${CONSOLE_ENV} already exists, skipping.`);
} else {
  await Bun.write(
    CONSOLE_ENV,
    ['VITE_DEMO_MODE=false', 'VITE_API_BASE_URL=http://localhost:3000', ''].join('\n')
  );

  console.log(`Created ${CONSOLE_ENV}`);
}

if (existsSync(BACKEND_ENV)) {
  console.log(`${BACKEND_ENV} already exists, skipping.`);
} else {
  const secretEncryptionKey = randomBytes(32).toString('base64');
  const authSecret = randomBytes(32).toString('base64');

  await Bun.write(
    BACKEND_ENV,
    [
      'DB_CONNECTION_STRING=data/db.sqlite',
      `SECRET_ENCRYPTION_KEY=${secretEncryptionKey}`,
      `AUTH_SECRET=${authSecret}`,
      'BASE_URL=http://localhost:3000',
      'ADMIN_EMAIL=admin@gmail.com',
      'ADMIN_PASSWORD=Testtest123!',
      'ADMIN_NAME=Admin User',
      'AUTH_RATE_LIMIT=1000',
      'RPC_RATE_LIMIT=1000',
      ''
    ].join('\n')
  );

  console.log(`Created ${BACKEND_ENV}`);
}

await $`mkdir -p apps/backend/data`;
await $`bunx drizzle-kit migrate`.cwd('apps/backend');
