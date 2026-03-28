import { eq } from 'drizzle-orm';
import { BucketId, BucketNotFoundError } from '@buckethub/rpc-contract';
import { BucketInsertRecord, bucketTable, connectionTable, database } from '../../shared/db';

export class BucketRepository {
  public async getBucketConnection(bucketId: BucketId) {
    const [row] = await database
      .select({
        bucket: bucketTable.name,
        region: bucketTable.region,
        accessKeyId: connectionTable.accessKeyId,
        secretAccessKey: connectionTable.secretAccessKey,
        endpoint: connectionTable.endpoint
      })
      .from(bucketTable)
      .where(eq(bucketTable.id, bucketId))
      .innerJoin(connectionTable, eq(bucketTable.connectionId, connectionTable.id))
      .execute();

    if (!row) {
      throw new BucketNotFoundError();
    }

    return row;
  }

  public async getAllBuckets() {
    return database
      .select({
        id: bucketTable.id,
        connectionId: bucketTable.connectionId,
        name: bucketTable.name,
        createdAt: bucketTable.createdAt
      })
      .from(bucketTable)
      .execute();
  }

  public async getBucketById(bucketId: BucketId) {
    const [bucket] = await database
      .select({
        id: bucketTable.id,
        connectionId: bucketTable.connectionId,
        name: bucketTable.name,
        region: bucketTable.region,
        createdAt: bucketTable.createdAt
      })
      .from(bucketTable)
      .where(eq(bucketTable.id, bucketId))
      .execute();

    if (!bucket) {
      throw new BucketNotFoundError();
    }

    return bucket;
  }

  public async createBucket(data: BucketInsertRecord) {
    const [row] = await database.insert(bucketTable).values(data).returning().execute();

    return row;
  }

  public async deleteBucket(bucketId: BucketId) {
    await database.delete(bucketTable).where(eq(bucketTable.id, bucketId)).execute();
  }
}
