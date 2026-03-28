import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { BucketId } from '@buckethub/rpc-contract';
import { user } from './auth-schema';
import { bucketTable } from './bucket-schema';

export const bucketPermissionTable = sqliteTable(
  'bucket_permission',
  {
    bucketId: text('bucket_id', { length: 36 })
      .$type<BucketId>()
      .notNull()
      .references(() => bucketTable.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    permission: text('permission', {
      enum: ['view', 'edit', 'delete']
    }).notNull()
  },
  (table) => [primaryKey({ columns: [table.bucketId, table.userId, table.permission] })]
);

export type BucketPermission = typeof bucketPermissionTable.$inferSelect;
export type BucketPermissionInsert = typeof bucketPermissionTable.$inferInsert;
