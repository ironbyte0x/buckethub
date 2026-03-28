import { createError } from './utils';

export const ListObjectsAccessDeniedError = createError({
  code: 'LIST_OBJECTS_ACCESS_DENIED',
  message: 'Access denied when listing objects',
  status: 403
});

export const BucketNotFoundError = createError({
  code: 'BUCKET_NOT_FOUND',
  message: 'Bucket not found',
  status: 404
});

export const InvalidCredentialsError = createError({
  code: 'INVALID_CREDENTIALS',
  message: 'Invalid credentials',
  status: 401
});

export const ListBucketsAccessDeniedError = createError({
  code: 'LIST_BUCKETS_ACCESS_DENIED',
  message: 'Access denied when listing buckets',
  status: 403
});

export const ProviderUnreachableError = createError({
  code: 'PROVIDER_UNREACHABLE',
  message: 'Provider is unreachable',
  status: 503
});

export const ObjectMovePartialError = createError({
  code: 'OBJECT_MOVE_PARTIAL',
  message: 'Object was copied but failed to delete original. Duplicate exists.',
  status: 500
});

export const AccessDeniedError = createError({
  code: 'ACCESS_DENIED',
  message: 'Access denied',
  status: 403
});

export const ObjectAlreadyExistsError = createError({
  code: 'OBJECT_ALREADY_EXISTS',
  message: 'An object with this name already exists at the destination',
  status: 409
});

export const ObjectNotFoundError = createError({
  code: 'OBJECT_NOT_FOUND',
  message: 'Object not found',
  status: 404
});

export const EmailAlreadyExistsError = createError({
  code: 'EMAIL_ALREADY_EXISTS',
  message: 'A user with this email already exists',
  status: 409
});

export const InvalidUrlError = createError({
  code: 'INVALID_URL',
  message: 'The provided URL is invalid',
  status: 400
});
