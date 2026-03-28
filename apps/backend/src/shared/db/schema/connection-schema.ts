import { sql } from 'drizzle-orm';
import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ProviderType } from '@buckethub/core';
import { ConnectionId } from '@buckethub/rpc-contract';
import { secret } from '../secret';
import { user } from './auth-schema';

export const connectionTable = sqliteTable(
  'connection',
  {
    id: text('id', { length: 36 }).primaryKey().$type<ConnectionId>(),
    providerType: text('provider_type').$type<ProviderType>().notNull(),
    label: text('label').notNull(),
    endpoint: text('endpoint').notNull(),
    accessKeyId: secret('access_key_id').notNull(),
    secretAccessKey: secret('secret_access_key').notNull(),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade'
      }),
    createdAt: int('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`)
  },
  (table) => [
    index('connection_created_by_idx').on(table.createdBy),
    index('connection_provider_type_idx').on(table.providerType)
  ]
);
