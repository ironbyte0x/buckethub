import { ProviderType } from '@buckethub/core';
import { Connection, ConnectionId } from '@buckethub/rpc-contract';
import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

function detectProviderType(endpoint: string): ProviderType {
  if (endpoint.includes('amazonaws.com')) {
    return ProviderType.AmazonS3;
  }

  if (endpoint.includes('r2.cloudflarestorage.com')) {
    return ProviderType.CloudflareR2;
  }

  if (endpoint.includes('backblazeb2.com')) {
    return ProviderType.BackblazeB2;
  }

  if (endpoint.includes('wasabisys.com')) {
    return ProviderType.Wasabi;
  }

  if (endpoint.includes('digitaloceanspaces.com')) {
    return ProviderType.DigitalOceanSpaces;
  }

  return ProviderType.Other;
}

export const connections: HandlerRegistry<'connections'> = {
  getAll: async () => {
    return Array.from(demoState.connections.values());
  },

  create: async (input) => {
    const connection: Connection = {
      id: input.id as ConnectionId,
      providerType: detectProviderType(input.endpoint),
      label: input.label || 'New Connection',
      endpoint: input.endpoint
    };

    demoState.connections.set(input.id as ConnectionId, connection);

    return connection;
  },

  update: async (input) => {
    const existing = demoState.connections.get(input.id as ConnectionId);

    if (!existing) {
      throw new Error('Connection not found');
    }

    const endpoint = input.endpoint ?? existing.endpoint;
    const updated = {
      ...existing,
      label: input.label ?? existing.label,
      endpoint,
      ...(input.endpoint !== undefined && { providerType: detectProviderType(endpoint) })
    };

    demoState.connections.set(input.id as ConnectionId, updated);

    return updated;
  },

  delete: async (input) => {
    demoState.connections.delete(input.id as ConnectionId);

    for (const [bucketId, bucket] of demoState.buckets) {
      if (bucket.connectionId === input.id) {
        demoState.buckets.delete(bucketId);
        demoState.objects.delete(bucketId);
      }
    }
  }
};
