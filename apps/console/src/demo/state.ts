import type {
  Bucket,
  BucketId,
  BucketTagMapping,
  BucketTagMappingId,
  Connection,
  ConnectionId,
  ConnectionTagMapping,
  ConnectionTagMappingId,
  Invitation,
  Object,
  Preferences,
  Profile,
  Tag,
  TagId,
  User,
  UserBucketPermissions
} from '@buckethub/rpc-contract';
import { seedState } from './seed';

export interface DemoState {
  version: number;
  connections: Map<Connection['id'], Connection>;
  buckets: Map<BucketId, Bucket>;
  tags: Map<TagId, Tag>;
  bucketTagMappings: Map<BucketTagMappingId, BucketTagMapping>;
  connectionTagMappings: Map<ConnectionTagMappingId, ConnectionTagMapping>;
  users: Map<User['id'], User>;
  invitations: Map<Invitation['id'], Invitation>;
  permissions: UserBucketPermissions[];
  objects: Map<Bucket['id'], Object[]>;
  profile: Profile;
  preferences: Preferences;
}

const STORAGE_KEY = 'demo-state';

interface SerializedDemoState {
  version: number;
  connections: [ConnectionId, Connection][];
  buckets: [BucketId, Bucket][];
  tags: [TagId, Tag][];
  bucketTagMappings: [BucketTagMappingId, BucketTagMapping][];
  connectionTagMappings: [ConnectionTagMappingId, ConnectionTagMapping][];
  users: [User['id'], User][];
  invitations: [Invitation['id'], Invitation][];
  permissions: UserBucketPermissions[];
  objects: [BucketId, Object[]][];
  profile: Profile;
  preferences: Preferences;
}

function reviveDate(value: string | Date | null): Date | null {
  if (value === null) {
    return null;
  }

  return new Date(value);
}

function serializeDemoState(state: DemoState): string {
  const serialized: SerializedDemoState = {
    version: state.version,
    connections: [...state.connections.entries()],
    buckets: [...state.buckets.entries()],
    tags: [...state.tags.entries()],
    bucketTagMappings: [...state.bucketTagMappings.entries()],
    connectionTagMappings: [...state.connectionTagMappings.entries()],
    users: [...state.users.entries()],
    invitations: [...state.invitations.entries()],
    permissions: state.permissions,
    objects: [...state.objects.entries()],
    profile: state.profile,
    preferences: state.preferences
  };

  return JSON.stringify(serialized);
}

function deserializeDemoState(json: string): DemoState {
  const parsed: SerializedDemoState = JSON.parse(json);

  return {
    version: parsed.version,
    connections: new Map(parsed.connections),
    buckets: new Map(
      parsed.buckets.map(([key, value]) => [
        key,
        { ...value, createdAt: new Date(value.createdAt) }
      ])
    ),
    tags: new Map(
      parsed.tags.map(([key, value]) => [key, { ...value, createdAt: new Date(value.createdAt) }])
    ),
    bucketTagMappings: new Map(parsed.bucketTagMappings),
    connectionTagMappings: new Map(parsed.connectionTagMappings),
    users: new Map(
      parsed.users.map(([key, value]) => [
        key,
        {
          ...value,
          createdAt: new Date(value.createdAt),
          banExpires: reviveDate(value.banExpires)
        }
      ])
    ),
    invitations: new Map(
      parsed.invitations.map(([key, value]) => [
        key,
        {
          ...value,
          createdAt: new Date(value.createdAt),
          expiresAt: new Date(value.expiresAt)
        }
      ])
    ),
    permissions: parsed.permissions,
    objects: new Map(parsed.objects),
    profile: parsed.profile,
    preferences: parsed.preferences
  };
}

function loadDemoState(): DemoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return deserializeDemoState(raw);
  } catch {
    return null;
  }
}

export function saveDemoState(state: DemoState): void {
  try {
    localStorage.setItem(STORAGE_KEY, serializeDemoState(state));
  } catch {
    // localStorage full or unavailable
  }
}

export const demoState: DemoState = loadDemoState() ?? seedState();
