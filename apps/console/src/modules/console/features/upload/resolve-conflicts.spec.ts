import { describe, expect, it, vi } from 'vitest';
import { BucketId } from '@buckethub/rpc-contract';
import { GetObjectsFunction, resolveConflicts, type UploadFile } from './resolve-conflicts';

const BUCKET_ID = 'bucket-1' as BucketId;

function createUploadFile(overrides: Partial<UploadFile> = {}): UploadFile {
  return {
    bucketId: BUCKET_ID,
    prefix: 'root/',
    path: '',
    name: 'file.txt',
    file: new File(['content'], overrides.name ?? 'file.txt'),
    ...overrides
  };
}

function createExistingFile(key: string) {
  return { type: 'file' as const, key };
}

function createExistingFolder(key: string) {
  return { type: 'folder' as const, key };
}

describe('resolveConflicts', () => {
  it('returns empty arrays when no files provided', async () => {
    const getObjects = vi.fn<GetObjectsFunction>();

    const result = await resolveConflicts([], getObjects);

    expect(result).toEqual({ conflicting: [], nonConflicting: [] });
    expect(getObjects).not.toHaveBeenCalled();
  });

  it('returns all files as non-conflicting when no existing objects', async () => {
    const getObjects = vi.fn<GetObjectsFunction>().mockResolvedValue([]);
    const files = [createUploadFile({ name: 'new-file.txt' })];

    const result = await resolveConflicts(files, getObjects);

    expect(result.conflicting).toHaveLength(0);
    expect(result.nonConflicting).toHaveLength(1);
  });

  it('detects conflict for direct file matching existing file key', async () => {
    const getObjects = vi
      .fn<GetObjectsFunction>()
      .mockResolvedValue([createExistingFile('root/file.txt')]);
    const files = [createUploadFile({ name: 'file.txt' })];

    const result = await resolveConflicts(files, getObjects);

    expect(result.conflicting).toHaveLength(1);
    expect(result.conflicting[0].key).toBe('root/file.txt');
    expect(result.nonConflicting).toHaveLength(0);
  });

  it('does not treat existing folders as conflicts', async () => {
    const getObjects = vi
      .fn<GetObjectsFunction>()
      .mockResolvedValue([createExistingFolder('root/folder/')]);
    const files = [createUploadFile({ name: 'folder/' })];

    const result = await resolveConflicts(files, getObjects);

    expect(result.conflicting).toHaveLength(0);
  });

  it('detects conflicts for files inside subfolders', async () => {
    const getObjects = vi
      .fn<GetObjectsFunction>()
      .mockImplementation(({ prefix }: { prefix: string }) => {
        if (prefix === 'root/photos/') {
          return Promise.resolve([createExistingFile('root/photos/image.png')]);
        }

        return Promise.resolve([]);
      });

    const files = [createUploadFile({ name: 'image.png', path: 'photos/' })];

    const result = await resolveConflicts(files, getObjects);

    expect(result.conflicting).toHaveLength(1);
    expect(result.conflicting[0].key).toBe('root/photos/image.png');
    expect(result.nonConflicting).toHaveLength(0);
  });

  it('detects conflicts across multiple subfolders', async () => {
    const getObjects = vi
      .fn<GetObjectsFunction>()
      .mockImplementation(({ prefix }: { prefix: string }) => {
        if (prefix === 'root/docs/') {
          return Promise.resolve([createExistingFile('root/docs/readme.md')]);
        }

        if (prefix === 'root/images/') {
          return Promise.resolve([createExistingFile('root/images/logo.png')]);
        }

        return Promise.resolve([]);
      });

    const files = [
      createUploadFile({ name: 'readme.md', path: 'docs/' }),
      createUploadFile({ name: 'logo.png', path: 'images/' }),
      createUploadFile({ name: 'new-file.txt', path: 'images/' })
    ];

    const result = await resolveConflicts(files, getObjects);

    expect(result.conflicting).toHaveLength(2);

    expect(result.conflicting.map((f: { key: string }) => f.key)).toEqual(
      expect.arrayContaining(['root/docs/readme.md', 'root/images/logo.png'])
    );

    expect(result.nonConflicting).toHaveLength(1);
    expect(result.nonConflicting[0].key).toBe('root/images/new-file.txt');
  });

  it('detects conflicts for both direct files and subfolder files', async () => {
    const getObjects = vi
      .fn<GetObjectsFunction>()
      .mockImplementation(({ prefix }: { prefix: string }) => {
        if (prefix === 'root/') {
          return Promise.resolve([createExistingFile('root/existing.txt')]);
        }

        if (prefix === 'root/sub/') {
          return Promise.resolve([createExistingFile('root/sub/also-existing.txt')]);
        }

        return Promise.resolve([]);
      });

    const files = [
      createUploadFile({ name: 'existing.txt', path: '' }),
      createUploadFile({ name: 'new.txt', path: '' }),
      createUploadFile({ name: 'also-existing.txt', path: 'sub/' })
    ];

    const result = await resolveConflicts(files, getObjects);

    expect(result.conflicting).toHaveLength(2);

    expect(result.conflicting.map((f: { key: string }) => f.key)).toEqual(
      expect.arrayContaining(['root/existing.txt', 'root/sub/also-existing.txt'])
    );

    expect(result.nonConflicting).toHaveLength(1);
    expect(result.nonConflicting[0].key).toBe('root/new.txt');
  });

  it('fetches objects for each unique subfolder prefix only once', async () => {
    const getObjects = vi.fn<GetObjectsFunction>().mockResolvedValue([]);

    const files = [
      createUploadFile({ name: 'a.txt', path: 'photos/' }),
      createUploadFile({ name: 'b.txt', path: 'photos/' }),
      createUploadFile({ name: 'c.txt', path: 'docs/' })
    ];

    await resolveConflicts(files, getObjects);

    const prefixesCalled = getObjects.mock.calls.map((call) => call[0].prefix);

    expect(prefixesCalled).toHaveLength(2);
    expect(prefixesCalled).toEqual(expect.arrayContaining(['root/photos/', 'root/docs/']));
  });

  it('handles only subfolder files with no direct files', async () => {
    const getObjects = vi
      .fn<GetObjectsFunction>()
      .mockImplementation(({ prefix }: { prefix: string }) => {
        if (prefix === 'root/folder/') {
          return Promise.resolve([createExistingFile('root/folder/conflict.txt')]);
        }

        return Promise.resolve([]);
      });

    const files = [
      createUploadFile({ name: 'conflict.txt', path: 'folder/' }),
      createUploadFile({ name: 'new.txt', path: 'folder/' })
    ];

    const result = await resolveConflicts(files, getObjects);

    expect(result.conflicting).toHaveLength(1);
    expect(result.conflicting[0].key).toBe('root/folder/conflict.txt');
    expect(result.nonConflicting).toHaveLength(1);
    expect(result.nonConflicting[0].key).toBe('root/folder/new.txt');
  });
});
