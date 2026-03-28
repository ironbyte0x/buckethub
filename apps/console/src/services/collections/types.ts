import type { QueryClient } from '@tanstack/react-query';
import { ORPCClient } from '@/services/rpc';
import { createBucketsCollection } from '../buckets';
import { createConnectionsCollection } from '../connections/collections';
import {
  createBucketTagsCollection,
  createConnectionTagsCollection,
  createTagsCollection
} from '../tags/collections';

export interface Collections {
  bucketsCollection: ReturnType<typeof createBucketsCollection>;
  connectionsCollection: ReturnType<typeof createConnectionsCollection>;
  tagsCollection: ReturnType<typeof createTagsCollection>;
  bucketTagsCollection: ReturnType<typeof createBucketTagsCollection>;
  connectionTagsCollection: ReturnType<typeof createConnectionTagsCollection>;
}

export interface CollectionContext {
  orpcClient: ORPCClient;
  queryClient: QueryClient;
}
