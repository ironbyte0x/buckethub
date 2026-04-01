import { BucketId, Object } from '@buckethub/rpc-contract';
import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

const DEMO_UPLOAD_URL_PREFIX = 'demo://upload';

function toBucketId(id: string): BucketId {
  return id as BucketId;
}

const extensionContentTypeMap: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogg: 'audio/ogg',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  txt: 'text/plain',
  md: 'text/markdown',
  json: 'application/json',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  xml: 'application/xml',
  pdf: 'application/pdf'
};

function getContentTypeFromKey(key: string): string | undefined {
  const extension = key.split('.').pop()?.toLowerCase();

  return extension ? extensionContentTypeMap[extension] : undefined;
}

function addObjectToState(bucketId: BucketId, key: string): void {
  const objects = demoState.objects.get(bucketId) || [];
  const name = key.split('/').pop() || key;
  const contentType = getContentTypeFromKey(key);
  const existingKeys = new Set(objects.map((object) => object.key));

  const parts = key.split('/');

  for (let index = 1; index < parts.length; index++) {
    const folderKey = parts.slice(0, index).join('/') + '/';

    if (!existingKeys.has(folderKey)) {
      objects.push({
        type: 'folder',
        key: folderKey,
        name: parts[index - 1]
      });

      existingKeys.add(folderKey);
    }
  }

  const filtered = objects.filter((object) => object.key !== key);

  filtered.push({
    type: 'file',
    key,
    name,
    contentType,
    lastModified: new Date().toISOString()
  });

  demoState.objects.set(bucketId, filtered);
}

export const objects: HandlerRegistry<'objects'> = {
  getAllByBucketId: async function* (input: { bucketId: string; prefix: string }) {
    const bucketId = toBucketId(input.bucketId);
    const objects = demoState.objects.get(bucketId) || [];
    const filtered = objects.filter((object) => {
      if (object.key === input.prefix) {
        return false;
      }

      if (input.prefix !== '' && !object.key.startsWith(input.prefix)) {
        return false;
      }

      const remaining = object.key.slice(input.prefix.length);
      const slashIndex = remaining.indexOf('/');

      // Only include direct children: files (no slash) or immediate folders (slash only at end)
      return slashIndex === -1 || slashIndex === remaining.length - 1;
    });

    yield filtered as Object[];
  } as unknown as HandlerRegistry<'objects'>['getAllByBucketId'],

  getById: async (input) => {
    const bucketId = toBucketId(input.bucketId);
    const objects = demoState.objects.get(bucketId) || [];
    const object = objects.find((object) => object.key === input.key && object.type === 'file');

    if (!object || object.type !== 'file') {
      return;
    }

    return object;
  },

  rename: async (input) => {
    const bucketId = toBucketId(input.bucketId);
    const objects = demoState.objects.get(bucketId) || [];
    const index = objects.findIndex((object) => object.key === input.oldKey);

    if (index !== -1) {
      const object = objects[index];
      const newName = input.newKey.split('/').pop() || input.newKey;

      objects[index] = { ...object, key: input.newKey, name: newName };
      demoState.objects.set(bucketId, objects);
    }
  },

  generateShareUrl: async (input) => {
    return {
      url: `https://demo.example.com/share/${input.bucketId}/${input.key}?expires=${input.expiresIn}`
    };
  },

  getPreviewUrl: async (input) => {
    const bucketId = toBucketId(input.bucketId);
    const objects = demoState.objects.get(bucketId) || [];
    const object = objects.find((object) => object.key === input.key && object.type === 'file');
    const contentType = object?.type === 'file' ? object.contentType : undefined;

    const demoFileMap: Record<string, string> = {
      'image/png': '/demo/sample.png',
      'image/jpeg': '/demo/sample.jpg',
      'image/gif': '/demo/sample.gif',
      'image/webp': '/demo/sample.webp',
      'video/mp4': '/demo/sample.mp4',
      'audio/mpeg': '/demo/sample.mp3',
      'audio/wav': '/demo/sample.wav',
      'text/plain': '/demo/sample.txt',
      'text/markdown': '/demo/sample.txt',
      'application/json': '/demo/sample.json',
      'text/html': '/demo/sample.html',
      'text/css': '/demo/sample.css',
      'text/javascript': '/demo/sample.js',
      'application/javascript': '/demo/sample.js',
      'application/xml': '/demo/sample.xml',
      'application/pdf': '/demo/sample.pdf'
    };

    const url = (contentType && demoFileMap[contentType]) || '';

    return { url, contentType };
  },

  getDownloadUrl: async (input) => {
    return {
      url: `https://demo.example.com/download/${input.bucketId}/${input.key}`
    };
  },

  deleteObject: async (input) => {
    const bucketId = toBucketId(input.bucketId);
    const objects = demoState.objects.get(bucketId) || [];
    const filtered = objects.filter((object) => object.key !== input.key);

    demoState.objects.set(bucketId, filtered);
  },

  copyObject: async (input) => {
    const bucketId = toBucketId(input.bucketId);
    const objects = demoState.objects.get(bucketId) || [];
    const source = objects.find((object) => object.key === input.sourceKey);

    if (source) {
      const newName = input.destinationKey.split('/').pop() || input.destinationKey;
      const copy = { ...source, key: input.destinationKey, name: newName };

      objects.push(copy);
      demoState.objects.set(bucketId, objects);
    }
  },

  moveObject: async (input) => {
    const bucketId = toBucketId(input.bucketId);
    const objects = demoState.objects.get(bucketId) || [];
    const index = objects.findIndex((object) => object.key === input.sourceKey);

    if (index !== -1) {
      const object = objects[index];
      const newName = input.destinationKey.split('/').pop() || input.destinationKey;

      objects[index] = { ...object, key: input.destinationKey, name: newName };
      demoState.objects.set(bucketId, objects);
    }
  },

  getUploadUrl: async (input) => {
    const bucketId = toBucketId(input.bucketId);

    addObjectToState(bucketId, input.key);

    return {
      url: `${DEMO_UPLOAD_URL_PREFIX}/${input.bucketId}/${input.key}`
    };
  },

  initiateMultipartUpload: async (input) => {
    const bucketId = toBucketId(input.bucketId);

    addObjectToState(bucketId, input.key);

    const uploadId = crypto.randomUUID();
    const presignedUrls = Array.from({ length: input.totalParts }, (_, index) => ({
      partNumber: index + 1,
      presignedUrl: `${DEMO_UPLOAD_URL_PREFIX}/${input.bucketId}/${input.key}?uploadId=${uploadId}&partNumber=${index + 1}`
    }));

    return { uploadId, presignedUrls };
  },

  completeMultipartUpload: async () => {
    // Do nothing in demo mode
  },

  abortMultipartUpload: async () => {
    // Do nothing in demo mode
  }
};
