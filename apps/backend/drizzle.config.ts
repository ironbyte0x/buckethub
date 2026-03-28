/* eslint-disable import/no-default-export */
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/shared/db/schema/*',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING ?? 'data/db.sqlite'
  }
});
