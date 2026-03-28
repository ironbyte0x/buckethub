import { sql } from 'drizzle-orm';
import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  BucketId,
  BucketTagMappingId,
  ConnectionId,
  ConnectionTagMappingId,
  TagId
} from '@buckethub/rpc-contract';
import { bucketTable } from './bucket-schema';
import { connectionTable } from './connection-schema';

export const tagTable = sqliteTable('tag', {
  id: text('id', { length: 36 }).primaryKey().$type<TagId>(),
  name: text('name').notNull().unique(),
  createdAt: int('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
});

export const bucketTagTable = sqliteTable(
  'bucket_tag',
  {
    id: text('id', { length: 36 }).primaryKey().$type<BucketTagMappingId>(),
    bucketId: text('bucket_id', { length: 36 })
      .$type<BucketId>()
      .notNull()
      .references(() => bucketTable.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .$type<TagId>()
      .notNull()
      .references(() => tagTable.id, { onDelete: 'cascade' })
  },
  (table) => [
    index('bucket_tag_bucket_id_idx').on(table.bucketId),
    index('bucket_tag_tag_id_idx').on(table.tagId)
  ]
);

export const connectionTagTable = sqliteTable(
  'connection_tag',
  {
    id: text('id', { length: 36 }).primaryKey().$type<ConnectionTagMappingId>(),
    connectionId: text('connection_id', { length: 36 })
      .$type<ConnectionId>()
      .notNull()
      .references(() => connectionTable.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .$type<TagId>()
      .notNull()
      .references(() => tagTable.id, { onDelete: 'cascade' })
  },
  (table) => [
    index('connection_tag_connection_id_idx').on(table.connectionId),
    index('connection_tag_tag_id_idx').on(table.tagId)
  ]
);

export type TagRecord = typeof tagTable.$inferSelect;
export type TagInsertRecord = typeof tagTable.$inferInsert;
export type BucketTagInsertRecord = typeof bucketTagTable.$inferInsert;
export type ConnectionTagInsertRecord = typeof connectionTagTable.$inferInsert;
