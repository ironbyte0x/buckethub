import * as v from 'valibot';
import { brand } from '@buckethub/core';
import { InferContractRouterInputs, InferContractRouterOutputs, oc } from '@orpc/contract';
import { bucketIdSchema } from './buckets';
import { connectionIdSchema } from './connection';

export const tagIdSchema = brand(v.pipe(v.string(), v.minLength(1)), 'TagId');

export const tagSchema = v.object({
  id: tagIdSchema,
  name: v.pipe(v.string(), v.minLength(1)),
  createdAt: v.date()
});

export type Tag = v.InferOutput<typeof tagSchema>;
export type TagId = Tag['id'];

const getAll = oc.input(v.void()).output(v.array(tagSchema));

export type GetAllTagsResponse = InferContractRouterOutputs<typeof getAll>;

const create = oc.input(tagSchema).output(tagSchema);

export type CreateTagRequest = InferContractRouterInputs<typeof create>;
export type CreateTagResponse = InferContractRouterOutputs<typeof create>;

const deleteSchema = v.object({ id: tagIdSchema });

const delete_ = oc.input(deleteSchema).output(v.void());

export type DeleteTagRequest = v.InferOutput<typeof deleteSchema>;

const bucketTagMappingId = brand(v.pipe(v.string(), v.minLength(1)), 'BucketTagMappingId');

const bucketTagMapping = v.object({
  id: bucketTagMappingId,
  bucketId: bucketIdSchema,
  tagId: tagIdSchema
});

export type BucketTagMapping = v.InferOutput<typeof bucketTagMapping>;
export type BucketTagMappingId = BucketTagMapping['id'];

const addTagToBucket = oc.input(bucketTagMapping).output(bucketTagMapping);

export type AddTagToBucketRequest = InferContractRouterInputs<typeof addTagToBucket>;

const removeTagFromBucketSchema = v.object({
  id: bucketTagMappingId
});

const removeTagFromBucket = oc.input(removeTagFromBucketSchema).output(v.void());

export type RemoveTagFromBucketRequest = v.InferOutput<typeof removeTagFromBucketSchema>;

const getTagsForBuckets = oc.input(v.void()).output(v.array(bucketTagMapping));

export type GetTagsForBucketsResponse = InferContractRouterOutputs<typeof getTagsForBuckets>;

const connectionTagMappingId = brand(v.pipe(v.string(), v.minLength(1)), 'ConnectionTagMappingId');

const connectionTagMapping = v.object({
  id: connectionTagMappingId,
  connectionId: connectionIdSchema,
  tagId: tagIdSchema
});

export type ConnectionTagMapping = v.InferOutput<typeof connectionTagMapping>;
export type ConnectionTagMappingId = ConnectionTagMapping['id'];

const addTagToConnection = oc.input(connectionTagMapping).output(connectionTagMapping);

export type AddTagToConnectionRequest = InferContractRouterInputs<typeof addTagToConnection>;

const removeTagFromConnectionSchema = v.object({
  id: connectionTagMappingId
});

const removeTagFromConnection = oc.input(removeTagFromConnectionSchema).output(v.void());

export type RemoveTagFromConnectionRequest = v.InferOutput<typeof removeTagFromConnectionSchema>;

const getTagsForConnections = oc.input(v.void()).output(v.array(connectionTagMapping));

export type GetTagsForConnectionsResponse = InferContractRouterOutputs<
  typeof getTagsForConnections
>;

export const tags = {
  getAll,
  create,
  delete: delete_,
  addTagToBucket,
  removeTagFromBucket,
  getTagsForBuckets,
  addTagToConnection,
  removeTagFromConnection,
  getTagsForConnections
};
