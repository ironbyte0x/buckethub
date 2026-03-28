import { onTestFinished } from 'vitest';
import { createMockObject, type MockObject } from '@buckethub/test';
import { QueryClient } from '@tanstack/react-query';
import { Collections } from '@/services/collections';
import { ORPCClient } from '@/services/rpc';

export function suppressMutationErrors() {
  const handler = (event: PromiseRejectionEvent) => {
    event.preventDefault();
  };

  window.addEventListener('unhandledrejection', handler);

  onTestFinished(() => {
    window.removeEventListener('unhandledrejection', handler);
  });
}

export type MockOrpcClient = MockObject<ORPCClient>;

export function withDefaultCollectionData(mockOrpc: MockOrpcClient) {
  mockOrpc.buckets.getAll.mockResolvedValue([]);
  mockOrpc.connections.getAll.mockResolvedValue([]);
  mockOrpc.tags.getAll.mockResolvedValue([]);
  mockOrpc.tags.getTagsForBuckets.mockResolvedValue([]);
  mockOrpc.tags.getTagsForConnections.mockResolvedValue([]);

  return mockOrpc;
}

export function createMockOrpcClient() {
  const orpcClient = createMockObject<MockOrpcClient>();

  withDefaultCollectionData(orpcClient);

  return orpcClient;
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      },
      mutations: {
        retry: false
      }
    }
  });
}

export async function preloadCollections(collections: Collections) {
  await Promise.all([
    collections.bucketsCollection.preload(),
    collections.connectionsCollection.preload(),
    collections.tagsCollection.preload(),
    collections.bucketTagsCollection.preload(),
    collections.connectionTagsCollection.preload()
  ]);
}
