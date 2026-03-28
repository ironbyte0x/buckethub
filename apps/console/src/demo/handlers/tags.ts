import {
  BucketTagMapping,
  BucketTagMappingId,
  ConnectionTagMapping,
  ConnectionTagMappingId,
  Tag,
  TagId
} from '@buckethub/rpc-contract';
import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

export const tags: HandlerRegistry<'tags'> = {
  getAll: async () => {
    return Array.from(demoState.tags.values());
  },

  create: async (input) => {
    demoState.tags.set(input.id as TagId, input as Tag);

    return input as Tag;
  },

  delete: async (input) => {
    demoState.tags.delete(input.id as TagId);

    for (const [id, mapping] of demoState.bucketTagMappings) {
      if (mapping.tagId === input.id) {
        demoState.bucketTagMappings.delete(id);
      }
    }

    for (const [id, mapping] of demoState.connectionTagMappings) {
      if (mapping.tagId === input.id) {
        demoState.connectionTagMappings.delete(id);
      }
    }
  },

  addTagToBucket: async (input) => {
    demoState.bucketTagMappings.set(input.id as BucketTagMappingId, input as BucketTagMapping);

    return input as BucketTagMapping;
  },

  removeTagFromBucket: async (input) => {
    demoState.bucketTagMappings.delete(input.id as BucketTagMappingId);
  },

  getTagsForBuckets: async () => {
    return Array.from(demoState.bucketTagMappings.values());
  },

  addTagToConnection: async (input) => {
    demoState.connectionTagMappings.set(
      input.id as ConnectionTagMappingId,
      input as ConnectionTagMapping
    );

    return input as ConnectionTagMapping;
  },

  removeTagFromConnection: async (input) => {
    demoState.connectionTagMappings.delete(input.id as ConnectionTagMappingId);
  },

  getTagsForConnections: async () => {
    return Array.from(demoState.connectionTagMappings.values());
  }
};
