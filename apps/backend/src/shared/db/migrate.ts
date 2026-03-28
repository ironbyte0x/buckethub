import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { database } from './database';

export function runMigrations(): void {
  const migrationsFolder = resolve(process.cwd(), 'drizzle');

  migrate(database, { migrationsFolder: migrationsFolder });
}
