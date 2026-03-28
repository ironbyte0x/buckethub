import { BucketId, Object } from '@buckethub/rpc-contract';
import { demoState } from '../state';
import type { HandlerRegistry } from '../types';

function toBucketId(id: string): BucketId {
  return id as BucketId;
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
    return {
      url: `https://demo.example.com/upload/${input.bucketId}/${input.key}`
    };
  },

  initiateMultipartUpload: async (input) => {
    const uploadId = crypto.randomUUID();
    const presignedUrls = Array.from({ length: input.totalParts }, (_, index) => ({
      partNumber: index + 1,
      presignedUrl: `https://demo.example.com/upload/${input.bucketId}/${input.key}?uploadId=${uploadId}&partNumber=${index + 1}`
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
