import { BucketTagMappingId, ConnectionTagMappingId, TagId } from '@buckethub/rpc-contract';
import { generateId } from '@/shared/utils';

export const generateTagId = generateId<TagId>;
export const generateBucketTagMappingId = generateId<BucketTagMappingId>;
export const generateConnectionTagMappingId = generateId<ConnectionTagMappingId>;
