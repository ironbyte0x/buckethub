import { sql } from 'drizzle-orm';
import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { BucketId, ConnectionId } from '@buckethub/rpc-contract';
import { connectionTable } from './connection-schema';

export const bucketTable = sqliteTable(
  'bucket',
  {
    id: text('id', { length: 36 }).primaryKey().$type<BucketId>(),
    connectionId: text('connection_id', { length: 36 })
      .$type<ConnectionId>()
      .notNull()
      .references(() => connectionTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    region: text('region'),
    createdAt: int('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`)
  },
  (table) => [index('bucket_connection_id_idx').on(table.connectionId)]
);

export type BucketInsertRecord = typeof bucketTable.$inferInsert;
