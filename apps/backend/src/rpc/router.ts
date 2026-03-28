import {
  bucketsRPC,
  connectionsRPC,
  invitationsRPC,
  objectsRPC,
  permissionsRPC,
  profileRPC,
  tagsRPC,
  usersRPC
} from '../instances';
import { os } from './contract';

export const router = os.router({
  objects: objectsRPC,
  buckets: bucketsRPC,
  connections: connectionsRPC,
  tags: tagsRPC,
  invitations: invitationsRPC,
  users: usersRPC,
  permissions: permissionsRPC,
  profile: profileRPC
});
