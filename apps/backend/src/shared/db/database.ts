import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { environment } from '../../environment';
import * as schema from './schema';

export const sqlite = new Database(environment.DB_CONNECTION_STRING, {
  create: true
});

sqlite.run('PRAGMA foreign_keys = ON;');
sqlite.run('PRAGMA journal_mode = WAL;');
sqlite.run('PRAGMA busy_timeout = 5000;');

export const database = drizzle(sqlite, {
  schema
});
