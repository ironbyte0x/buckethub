import { eq, inArray } from 'drizzle-orm';
import {
  BucketId,
  BucketTagMapping,
  BucketTagMappingId,
  ConnectionId,
  ConnectionTagMapping,
  ConnectionTagMappingId,
  Tag,
  TagId
} from '@buckethub/rpc-contract';
import { bucketTagTable, connectionTagTable, database, TagRecord, tagTable } from '../../shared/db';

export class TagRepository {
  public async getAll(): Promise<TagRecord[]> {
    return database.select().from(tagTable).execute();
  }

  public async create(data: Tag): Promise<TagRecord> {
    const [result] = await database.insert(tagTable).values(data).returning().execute();

    return result;
  }

  public async delete(id: TagId): Promise<void> {
    await database.delete(tagTable).where(eq(tagTable.id, id)).execute();
  }

  public async addTagToBucket(data: BucketTagMapping) {
    const [row] = await database
      .insert(bucketTagTable)
      .values(data)
      .onConflictDoNothing()
      .returning()
      .execute();

    return row;
  }

  public async removeTagFromBucket(id: BucketTagMappingId): Promise<void> {
    await database.delete(bucketTagTable).where(eq(bucketTagTable.id, id)).execute();
  }

  public async getTagsForBuckets() {
    return database.select().from(bucketTagTable).execute();
  }

  public async getTagsForBucketsByBucketIds(bucketIds: BucketId[]) {
    if (bucketIds.length === 0) {
      return [];
    }

    return database
      .select()
      .from(bucketTagTable)
      .where(inArray(bucketTagTable.bucketId, bucketIds))
      .execute();
  }

  public async getBucketTagMapping(id: BucketTagMappingId) {
    const [row] = await database
      .select()
      .from(bucketTagTable)
      .where(eq(bucketTagTable.id, id))
      .execute();

    return row;
  }

  public async addTagToConnection(data: ConnectionTagMapping) {
    const [row] = await database
      .insert(connectionTagTable)
      .values(data)
      .onConflictDoNothing()
      .returning()
      .execute();

    return row;
  }

  public async getConnectionTagMapping(id: ConnectionTagMappingId) {
    const [row] = await database
      .select()
      .from(connectionTagTable)
      .where(eq(connectionTagTable.id, id))
      .execute();

    return row;
  }

  public async removeTagFromConnection(id: ConnectionTagMappingId): Promise<void> {
    await database.delete(connectionTagTable).where(eq(connectionTagTable.id, id)).execute();
  }

  public async getTagsForConnections() {
    return database.select().from(connectionTagTable).execute();
  }

  public async getTagsForConnectionsByConnectionIds(connectionIds: ConnectionId[]) {
    if (connectionIds.length === 0) {
      return [];
    }

    return database
      .select()
      .from(connectionTagTable)
      .where(inArray(connectionTagTable.connectionId, connectionIds))
      .execute();
  }
}
