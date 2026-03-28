import { buckets } from './buckets';
import { connections } from './connection.js';
import { invitations } from './invitations';
import { objects } from './objects';
import { permissions } from './permissions';
import { profile } from './profile';
import { tags } from './tags';
import { users } from './users';

export const contractRouter = {
  buckets,
  objects,
  connections,
  tags,
  invitations,
  users,
  permissions,
  profile
};
