import type { Handlers } from '../types';
import { buckets } from './buckets';
import { connections } from './connections';
import { invitations } from './invitations';
import { objects } from './objects';
import { permissions } from './permissions';
import { profile } from './profile';
import { tags } from './tags';
import { users } from './users';

export const handlers: Handlers = {
  buckets,
  objects,
  connections,
  tags,
  users,
  invitations,
  permissions,
  profile
};
