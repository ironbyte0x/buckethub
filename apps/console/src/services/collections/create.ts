import { createBucketsCollection } from '@/services/buckets';
import { createConnectionsCollection } from '@/services/connections';
import {
  createBucketTagsCollection,
  createConnectionTagsCollection,
  createTagsCollection
} from '@/services/tags';
import type { CollectionContext, Collections } from './types';

export function createCollections(context: CollectionContext): Collections {
  const bucketsCollection = createBucketsCollection(context);
  const tagsCollection = createTagsCollection(context);
  const bucketTagsCollection = createBucketTagsCollection(context);
  const connectionTagsCollection = createConnectionTagsCollection(context);
  const connectionsCollection = createConnectionsCollection(context, {
    bucketsCollection,
    bucketTagsCollection
  });

  return {
    bucketsCollection,
    connectionsCollection,
    tagsCollection,
    bucketTagsCollection,
    connectionTagsCollection
  };
}
