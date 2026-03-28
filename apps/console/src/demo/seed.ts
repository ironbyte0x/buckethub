import { ProviderType, UserRole } from '@buckethub/core';
import {
  Bucket,
  BucketId,
  BucketTagMappingId,
  Connection,
  ConnectionId,
  ConnectionTagMappingId,
  Object,
  Tag,
  TagId,
  User
} from '@buckethub/rpc-contract';
import type { DemoState } from './state';

function createConnectionId(id: string): ConnectionId {
  return id as ConnectionId;
}

function createBucketId(id: string): BucketId {
  return id as BucketId;
}

function createTagId(id: string): TagId {
  return id as TagId;
}

function createBucketTagMappingId(id: string): BucketTagMappingId {
  return id as BucketTagMappingId;
}

function createConnectionTagMappingId(id: string): ConnectionTagMappingId {
  return id as ConnectionTagMappingId;
}

export function seedState(): DemoState {
  const connections = new Map<ConnectionId, Connection>();
  const buckets = new Map<BucketId, Bucket>();
  const tags = new Map<TagId, Tag>();
  const objects = new Map<BucketId, Object[]>();

  const conn1Id = createConnectionId('conn-1');
  const conn2Id = createConnectionId('conn-2');

  connections.set(conn1Id, {
    id: conn1Id,
    providerType: ProviderType.AmazonS3,
    label: 'Production AWS',
    endpoint: 'https://s3.amazonaws.com'
  });

  connections.set(conn2Id, {
    id: conn2Id,
    providerType: ProviderType.CloudflareR2,
    label: 'Cloudflare CDN',
    endpoint: 'https://example.r2.cloudflarestorage.com'
  });

  const bucket1Id = createBucketId('bucket-1');
  const bucket2Id = createBucketId('bucket-2');
  const bucket3Id = createBucketId('bucket-3');

  buckets.set(bucket1Id, {
    id: bucket1Id,
    connectionId: conn1Id,
    name: 'assets',
    createdAt: new Date('2024-01-15')
  });

  buckets.set(bucket2Id, {
    id: bucket2Id,
    connectionId: conn1Id,
    name: 'user-uploads',
    createdAt: new Date('2024-02-20')
  });

  buckets.set(bucket3Id, {
    id: bucket3Id,
    connectionId: conn2Id,
    name: 'cdn-static',
    createdAt: new Date('2024-03-10')
  });

  const tag1Id = createTagId('tag-1');
  const tag2Id = createTagId('tag-2');
  const tag3Id = createTagId('tag-3');

  tags.set(tag1Id, {
    id: tag1Id,
    name: 'production',
    createdAt: new Date('2024-01-01')
  });

  tags.set(tag2Id, {
    id: tag2Id,
    name: 'staging',
    createdAt: new Date('2024-01-02')
  });

  tags.set(tag3Id, {
    id: tag3Id,
    name: 'backup',
    createdAt: new Date('2024-01-03')
  });

  objects.set(bucket1Id, [
    {
      type: 'folder' as const,
      key: 'images/',
      name: 'images'
    },
    {
      type: 'folder' as const,
      key: 'documents/',
      name: 'documents'
    },
    {
      type: 'folder' as const,
      key: 'media/',
      name: 'media'
    },
    {
      type: 'file' as const,
      key: 'readme.txt',
      name: 'readme.txt',
      size: 1024,
      lastModified: '2024-06-01T10:00:00Z',
      contentType: 'text/plain'
    },
    {
      type: 'file' as const,
      key: 'images/logo.png',
      name: 'logo.png',
      size: 45678,
      lastModified: '2024-06-15T14:30:00Z',
      contentType: 'image/png'
    },
    {
      type: 'file' as const,
      key: 'images/banner.jpg',
      name: 'banner.jpg',
      size: 234567,
      lastModified: '2024-06-20T09:15:00Z',
      contentType: 'image/jpeg'
    },
    {
      type: 'file' as const,
      key: 'images/animation.gif',
      name: 'animation.gif',
      size: 89012,
      lastModified: '2024-06-22T11:00:00Z',
      contentType: 'image/gif'
    },
    {
      type: 'file' as const,
      key: 'images/photo.webp',
      name: 'photo.webp',
      size: 67890,
      lastModified: '2024-06-25T16:20:00Z',
      contentType: 'image/webp'
    },
    {
      type: 'file' as const,
      key: 'documents/report.pdf',
      name: 'report.pdf',
      size: 1234567,
      lastModified: '2024-07-01T16:45:00Z',
      contentType: 'application/pdf'
    },
    {
      type: 'file' as const,
      key: 'documents/config.json',
      name: 'config.json',
      size: 2048,
      lastModified: '2024-07-05T09:30:00Z',
      contentType: 'application/json'
    },
    {
      type: 'file' as const,
      key: 'documents/settings.xml',
      name: 'settings.xml',
      size: 3456,
      lastModified: '2024-07-08T14:15:00Z',
      contentType: 'application/xml'
    },
    {
      type: 'file' as const,
      key: 'media/intro.mp4',
      name: 'intro.mp4',
      size: 5678901,
      lastModified: '2024-07-10T10:00:00Z',
      contentType: 'video/mp4'
    },
    {
      type: 'file' as const,
      key: 'media/podcast.mp3',
      name: 'podcast.mp3',
      size: 4567890,
      lastModified: '2024-07-12T08:45:00Z',
      contentType: 'audio/mpeg'
    },
    {
      type: 'file' as const,
      key: 'media/notification.wav',
      name: 'notification.wav',
      size: 123456,
      lastModified: '2024-07-15T13:20:00Z',
      contentType: 'audio/wav'
    }
  ]);

  objects.set(bucket2Id, [
    {
      type: 'folder' as const,
      key: 'avatars/',
      name: 'avatars'
    },
    {
      type: 'file' as const,
      key: 'avatars/user-1.jpg',
      name: 'user-1.jpg',
      size: 12345,
      lastModified: '2024-08-01T08:00:00Z',
      contentType: 'image/jpeg'
    },
    {
      type: 'file' as const,
      key: 'avatars/user-2.jpg',
      name: 'user-2.jpg',
      size: 23456,
      lastModified: '2024-08-02T09:00:00Z',
      contentType: 'image/jpeg'
    }
  ]);

  objects.set(bucket3Id, [
    {
      type: 'file' as const,
      key: 'styles.css',
      name: 'styles.css',
      size: 5678,
      lastModified: '2024-09-01T12:00:00Z',
      contentType: 'text/css'
    },
    {
      type: 'file' as const,
      key: 'app.js',
      name: 'app.js',
      size: 98765,
      lastModified: '2024-09-05T15:30:00Z',
      contentType: 'application/javascript'
    },
    {
      type: 'file' as const,
      key: 'index.html',
      name: 'index.html',
      size: 3456,
      lastModified: '2024-09-08T11:30:00Z',
      contentType: 'text/html'
    }
  ]);

  const users = new Map<string, User>();

  users.set('user-1', {
    id: 'user-1',
    name: 'Demo Admin',
    email: 'admin@demo.com',
    image: null,
    role: UserRole.Admin,
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: new Date('2024-01-01')
  });

  users.set('user-2', {
    id: 'user-2',
    name: 'John Doe',
    email: 'john@demo.com',
    image: null,
    role: UserRole.User,
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: new Date('2024-02-15')
  });

  users.set('user-3', {
    id: 'user-3',
    name: 'Jane Smith',
    email: 'jane@demo.com',
    image: null,
    role: UserRole.User,
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: new Date('2024-03-20')
  });

  const btm1Id = createBucketTagMappingId('btm-1');
  const btm2Id = createBucketTagMappingId('btm-2');
  const btm3Id = createBucketTagMappingId('btm-3');
  const btm4Id = createBucketTagMappingId('btm-4');
  const ctm1Id = createConnectionTagMappingId('ctm-1');

  return {
    version: 1,
    connections,
    buckets,
    tags,
    bucketTagMappings: new Map([
      [btm1Id, { id: btm1Id, bucketId: bucket1Id, tagId: tag1Id }],
      [btm2Id, { id: btm2Id, bucketId: bucket2Id, tagId: tag1Id }],
      [btm3Id, { id: btm3Id, bucketId: bucket2Id, tagId: tag3Id }],
      [btm4Id, { id: btm4Id, bucketId: bucket3Id, tagId: tag2Id }]
    ]),
    connectionTagMappings: new Map([
      [ctm1Id, { id: ctm1Id, connectionId: conn1Id, tagId: tag1Id }]
    ]),
    users,
    invitations: new Map(),
    permissions: [
      {
        userId: 'user-2',
        userName: 'John Doe',
        userEmail: 'john@demo.com',
        bucketId: bucket1Id,
        bucketName: 'assets',
        permissions: ['view', 'edit']
      },
      {
        userId: 'user-3',
        userName: 'Jane Smith',
        userEmail: 'jane@demo.com',
        bucketId: bucket2Id,
        bucketName: 'user-uploads',
        permissions: ['view']
      }
    ],
    objects,
    profile: {
      id: 'user-1',
      name: 'Demo Admin',
      email: 'admin@demo.com',
      image: null
    },
    preferences: {
      theme: 'system'
    }
  };
}
