import { Bucket, BucketId, Object } from '@buckethub/rpc-contract';
import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

/**
 * Demo buckets that appear as available on any remote connection.
 * These simulate buckets that exist on the provider but haven't been added yet.
 */
const remoteBuckets = [
  { name: 'assets', createdAt: new Date('2024-01-15') },
  { name: 'backups', createdAt: new Date('2024-02-10') },
  { name: 'logs', createdAt: new Date('2024-03-05') },
  { name: 'user-uploads', createdAt: new Date('2024-04-20') },
  { name: 'static-site', createdAt: new Date('2024-05-12') }
];

/**
 * Fake metrics shown during bucket selection, keyed by bucket name.
 */
const remoteBucketMetrics: Record<
  string,
  { totalObjects: number; totalSize: number; isComplete: boolean }
> = {
  assets: { totalObjects: 11, totalSize: 12_048_043, isComplete: true },
  backups: { totalObjects: 5, totalSize: 52_428_800, isComplete: false },
  logs: { totalObjects: 234, totalSize: 8_912_345, isComplete: false },
  'user-uploads': { totalObjects: 3, totalSize: 35_801, isComplete: true },
  'static-site': { totalObjects: 8, totalSize: 107_899, isComplete: true }
};

/**
 * Prefilled objects that get added when a demo bucket is added.
 */
const demoBucketObjects: Record<string, Object[]> = {
  assets: [
    { type: 'folder', key: 'images/', name: 'images' },
    { type: 'folder', key: 'documents/', name: 'documents' },
    { type: 'folder', key: 'fonts/', name: 'fonts' },
    {
      type: 'file',
      key: 'images/logo.png',
      name: 'logo.png',
      size: 45_678,
      lastModified: '2024-06-15T14:30:00Z',
      contentType: 'image/png'
    },
    {
      type: 'file',
      key: 'images/banner.jpg',
      name: 'banner.jpg',
      size: 234_567,
      lastModified: '2024-06-20T09:15:00Z',
      contentType: 'image/jpeg'
    },
    {
      type: 'file',
      key: 'images/hero.webp',
      name: 'hero.webp',
      size: 189_012,
      lastModified: '2024-07-01T11:00:00Z',
      contentType: 'image/webp'
    },
    {
      type: 'file',
      key: 'images/icon.svg',
      name: 'icon.svg',
      size: 3_456,
      lastModified: '2024-07-10T08:20:00Z',
      contentType: 'image/svg+xml'
    },
    {
      type: 'file',
      key: 'documents/report.pdf',
      name: 'report.pdf',
      size: 1_234_567,
      lastModified: '2024-07-01T16:45:00Z',
      contentType: 'application/pdf'
    },
    {
      type: 'file',
      key: 'documents/config.json',
      name: 'config.json',
      size: 2_048,
      lastModified: '2024-07-05T09:30:00Z',
      contentType: 'application/json'
    },
    {
      type: 'file',
      key: 'documents/readme.md',
      name: 'readme.md',
      size: 4_890,
      lastModified: '2024-07-08T14:15:00Z',
      contentType: 'text/markdown'
    },
    {
      type: 'file',
      key: 'fonts/inter.woff2',
      name: 'inter.woff2',
      size: 98_765,
      lastModified: '2024-05-20T10:00:00Z',
      contentType: 'font/woff2'
    },
    {
      type: 'file',
      key: 'fonts/mono.woff2',
      name: 'mono.woff2',
      size: 87_432,
      lastModified: '2024-05-20T10:00:00Z',
      contentType: 'font/woff2'
    },
    {
      type: 'file',
      key: 'robots.txt',
      name: 'robots.txt',
      size: 128,
      lastModified: '2024-04-01T12:00:00Z',
      contentType: 'text/plain'
    },
    {
      type: 'file',
      key: 'favicon.svg',
      name: 'favicon.svg',
      size: 2_500,
      lastModified: '2024-06-01T10:00:00Z',
      contentType: 'image/svg+xml'
    }
  ],
  backups: [
    { type: 'folder', key: '2024-01/', name: '2024-01' },
    { type: 'folder', key: '2024-02/', name: '2024-02' },
    { type: 'folder', key: '2024-03/', name: '2024-03' },
    {
      type: 'file',
      key: '2024-01/db-snapshot.sql.gz',
      name: 'db-snapshot.sql.gz',
      size: 15_728_640,
      lastModified: '2024-01-31T02:00:00Z',
      contentType: 'application/gzip'
    },
    {
      type: 'file',
      key: '2024-02/db-snapshot.sql.gz',
      name: 'db-snapshot.sql.gz',
      size: 17_825_792,
      lastModified: '2024-02-29T02:00:00Z',
      contentType: 'application/gzip'
    },
    {
      type: 'file',
      key: '2024-03/db-snapshot.sql.gz',
      name: 'db-snapshot.sql.gz',
      size: 18_874_368,
      lastModified: '2024-03-31T02:00:00Z',
      contentType: 'application/gzip'
    }
  ],
  logs: [
    { type: 'folder', key: 'app/', name: 'app' },
    { type: 'folder', key: 'nginx/', name: 'nginx' },
    {
      type: 'file',
      key: 'app/2024-07-15.log',
      name: '2024-07-15.log',
      size: 1_245_678,
      lastModified: '2024-07-15T23:59:59Z',
      contentType: 'text/plain'
    },
    {
      type: 'file',
      key: 'app/2024-07-16.log',
      name: '2024-07-16.log',
      size: 987_654,
      lastModified: '2024-07-16T23:59:59Z',
      contentType: 'text/plain'
    },
    {
      type: 'file',
      key: 'nginx/access.log',
      name: 'access.log',
      size: 3_456_789,
      lastModified: '2024-07-16T23:59:59Z',
      contentType: 'text/plain'
    },
    {
      type: 'file',
      key: 'nginx/error.log',
      name: 'error.log',
      size: 234_567,
      lastModified: '2024-07-16T18:30:00Z',
      contentType: 'text/plain'
    }
  ],
  'user-uploads': [
    { type: 'folder', key: 'avatars/', name: 'avatars' },
    {
      type: 'file',
      key: 'avatars/user-1.jpg',
      name: 'user-1.jpg',
      size: 12_345,
      lastModified: '2024-08-01T08:00:00Z',
      contentType: 'image/jpeg'
    },
    {
      type: 'file',
      key: 'avatars/user-2.jpg',
      name: 'user-2.jpg',
      size: 23_456,
      lastModified: '2024-08-02T09:00:00Z',
      contentType: 'image/jpeg'
    }
  ],
  'static-site': [
    { type: 'folder', key: 'css/', name: 'css' },
    { type: 'folder', key: 'js/', name: 'js' },
    {
      type: 'file',
      key: 'index.html',
      name: 'index.html',
      size: 3_456,
      lastModified: '2024-09-08T11:30:00Z',
      contentType: 'text/html'
    },
    {
      type: 'file',
      key: 'css/styles.css',
      name: 'styles.css',
      size: 5_678,
      lastModified: '2024-09-01T12:00:00Z',
      contentType: 'text/css'
    },
    {
      type: 'file',
      key: 'css/reset.css',
      name: 'reset.css',
      size: 1_234,
      lastModified: '2024-08-15T10:00:00Z',
      contentType: 'text/css'
    },
    {
      type: 'file',
      key: 'js/app.js',
      name: 'app.js',
      size: 45_678,
      lastModified: '2024-09-05T15:30:00Z',
      contentType: 'application/javascript'
    },
    {
      type: 'file',
      key: 'js/vendor.js',
      name: 'vendor.js',
      size: 98_765,
      lastModified: '2024-09-05T15:30:00Z',
      contentType: 'application/javascript'
    },
    {
      type: 'file',
      key: 'favicon.ico',
      name: 'favicon.ico',
      size: 4_096,
      lastModified: '2024-08-01T09:00:00Z',
      contentType: 'image/x-icon'
    }
  ]
};

function computeBucketMetrics(bucketId: BucketId) {
  const objects = demoState.objects.get(bucketId) || [];
  const files = objects.filter((object) => object.type === 'file');
  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

  return { totalObjects: files.length, totalSize, isComplete: true };
}

export const buckets: HandlerRegistry<'buckets'> = {
  getAll: async () => {
    return Array.from(demoState.buckets.values());
  },

  getBucket: async (input) => {
    const bucket = demoState.buckets.get(input.id as BucketId);

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    return bucket;
  },

  getBucketMetrics: async (input) => {
    const bucket = demoState.buckets.get(input.id as BucketId);

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    return computeBucketMetrics(input.id as BucketId);
  },

  addBucket: async (input) => {
    demoState.buckets.set(input.id as BucketId, input as Bucket);

    demoState.objects.set(
      input.id as BucketId,
      demoBucketObjects[input.name] ? [...demoBucketObjects[input.name]] : ([] as Object[])
    );

    return input as Bucket;
  },

  listBuckets: async () => {
    return remoteBuckets;
  },

  listBucketsMetrics: async (input) => {
    const record: Record<string, { totalObjects: number; totalSize: number; isComplete: boolean }> =
      {};

    for (const name of input.bucketNames) {
      if (remoteBucketMetrics[name]) {
        record[name] = remoteBucketMetrics[name];
      }
    }

    return record;
  },

  delete: async (input) => {
    demoState.buckets.delete(input.id as BucketId);
    demoState.objects.delete(input.id as BucketId);
  }
};
