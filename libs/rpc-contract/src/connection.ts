import * as v from 'valibot';
import { brand, ProviderType } from '@buckethub/core';
import { InferContractRouterInputs, oc } from '@orpc/contract';
import { InvalidCredentialsError, InvalidUrlError, ProviderUnreachableError } from './errors';
import { defineErrors } from './utils';

const accessKeyIdSchema = v.pipe(
  v.string('Field is required'),
  v.minLength(1, 'Field is required')
);
const secretAccessKeySchema = v.pipe(
  v.string('Field is required'),
  v.minLength(1, 'Field is required')
);

const endpointSchema = v.pipe(
  v.string('Field is required'),
  v.trim(),
  v.url('Must be a valid URL'),
  v.check((value) => !/\{.*?\}/.test(value), 'Replace all placeholders before submitting')
);

export const connectionIdSchema = brand(v.pipe(v.string(), v.minLength(1)), 'ConnectionId');

export const connectionSchema = v.object({
  id: connectionIdSchema,
  providerType: v.enum(ProviderType),
  label: v.string(),
  endpoint: v.string()
});

export type Connection = v.InferOutput<typeof connectionSchema>;
export type ConnectionId = Connection['id'];

export const createConnectionSchema = v.object({
  id: connectionIdSchema,
  label: v.pipe(v.string(), v.trim(), v.minLength(1, 'Field is required')),
  accessKeyId: accessKeyIdSchema,
  secretAccessKey: secretAccessKeySchema,
  endpoint: endpointSchema
});

const create = oc
  .input(createConnectionSchema)
  .output(connectionSchema)
  .errors(defineErrors(InvalidCredentialsError, InvalidUrlError, ProviderUnreachableError));

export type CreateConnectionRequest = v.InferOutput<typeof createConnectionSchema>;

const getAll = oc.input(v.void()).output(v.array(connectionSchema));

export const updateConnectionSchema = v.object({
  id: connectionIdSchema,
  label: v.pipe(v.string(), v.trim(), v.minLength(1, 'Field is required')),
  accessKeyId: v.optional(accessKeyIdSchema),
  secretAccessKey: v.optional(secretAccessKeySchema),
  endpoint: v.optional(endpointSchema)
});

const update = oc
  .input(updateConnectionSchema)
  .output(connectionSchema)
  .errors(defineErrors(InvalidCredentialsError));

export type UpdateConnectionRequest = v.InferOutput<typeof updateConnectionSchema>;

const delete_ = oc.input(v.object({ id: connectionIdSchema })).output(v.void());

export type DeleteConnectionRequest = InferContractRouterInputs<typeof delete_>;

export const connections = {
  create,
  getAll,
  update,
  delete: delete_
};
