import { BucketId } from '@buckethub/rpc-contract';
import { getObjectUploadKey } from '@/shared/lib';

export interface UploadFile {
  bucketId: BucketId;
  prefix: string;
  path: string;
  name: string;
  file: File;
}

export interface FileWithKey {
  file: UploadFile;
  key: string;
}

interface ExistingObject {
  type: 'file' | 'folder';
  key: string;
}

export type GetObjectsFunction = (data: {
  bucketId: BucketId;
  prefix: string;
}) => Promise<ExistingObject[]>;

export async function resolveConflicts(
  files: UploadFile[],
  getObjects: GetObjectsFunction
): Promise<{ conflicting: FileWithKey[]; nonConflicting: FileWithKey[] }> {
  if (files.length === 0) {
    return { conflicting: [], nonConflicting: [] };
  }

  const bucketId = files[0].bucketId;
  const basePrefix = files[0].prefix;

  const filesWithKeys = files.map((file) => ({
    file,
    key: getObjectUploadKey({
      basePrefix: file.prefix,
      path: file.path,
      name: file.name
    })
  }));

  const prefixGroups = new Map<string, FileWithKey[]>();

  for (const fileWithKey of filesWithKeys) {
    const targetPrefix = `${basePrefix}${fileWithKey.file.path}`;

    const group = prefixGroups.get(targetPrefix);

    if (group) {
      group.push(fileWithKey);
    } else {
      prefixGroups.set(targetPrefix, [fileWithKey]);
    }
  }

  const existingFileKeys = new Set<string>();

  await Promise.all(
    [...prefixGroups.keys()].map(async (prefix) => {
      const existingObjects = await getObjects({ bucketId, prefix });

      for (const object of existingObjects) {
        if (object.type === 'file') {
          existingFileKeys.add(object.key);
        }
      }
    })
  );

  const conflicting: FileWithKey[] = [];
  const nonConflicting: FileWithKey[] = [];

  for (const fileWithKey of filesWithKeys) {
    if (existingFileKeys.has(fileWithKey.key)) {
      conflicting.push(fileWithKey);
    } else {
      nonConflicting.push(fileWithKey);
    }
  }

  return { conflicting, nonConflicting };
}
