import { useCallback } from 'react';
import { alert, Text } from '@buckethub/ui';
import { UploadObjectInput, useObjectsImperative, useUploadObject } from '@/services/objects';
import { getObjectUploadKey } from '@/shared/lib';
import { useUploadStore } from './upload-store';
import { useUploadUiStore } from './upload-ui-store';

type UploadFileInput = Omit<UploadObjectInput, 'key' | 'onProgress'>;

async function runWithConcurrency<T>(
  items: T[],
  function_: (item: T) => Promise<void>,
  limit: number
) {
  const executing = new Set<Promise<void>>();

  for (const item of items) {
    const promise = function_(item).then(() => {
      executing.delete(promise);
    });

    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
}

export function useUploader() {
  const uploadsCount = useUploadStore((store) => store.ids.length);
  const setIsMinimized = useUploadUiStore((store) => store.setIsMinimized);
  const { addUpload, updateProgress, setCompleted, setAborted, setFailed, retryUpload } =
    useUploadStore((store) => store.actions);
  const { mutateAsync: uploadObject } = useUploadObject();
  const getObjects = useObjectsImperative();

  const doUpload = useCallback(
    async ({
      id,
      object,
      abortController
    }: {
      id: string;
      object: UploadObjectInput;
      abortController: AbortController;
    }) => {
      try {
        await uploadObject({
          ...object,
          signal: abortController.signal,
          onProgress: (progress) => {
            updateProgress(id, progress);
          }
        });

        setCompleted(id);
      } catch {
        if (abortController.signal.aborted) {
          setAborted(id);
        } else {
          setFailed(id, 'Failed');
        }
      }
    },
    [setAborted, setCompleted, setFailed, updateProgress, uploadObject]
  );

  const upload = useCallback(
    async (object: Omit<UploadObjectInput, 'key' | 'onProgress'>) => {
      const key = getObjectUploadKey({
        basePrefix: object.prefix,
        path: object.path,
        name: object.name
      });
      const id = `${object.bucketId}-${key}-${Date.now()}`;
      const abortController = new AbortController();

      if (uploadsCount === 0) {
        setIsMinimized(false);
      }

      addUpload(
        {
          id,
          key,
          size: object.file.size,
          ...object
        },
        abortController
      );

      await doUpload({
        id,
        object: {
          key,
          ...object
        },
        abortController
      });
    },
    [uploadsCount, addUpload, doUpload, setIsMinimized]
  );

  const uploadFiles = useCallback(
    async (files: UploadFileInput[]) => {
      if (files.length === 0) {
        return;
      }

      const basePrefix = files[0].prefix;
      const bucketId = files[0].bucketId;

      const filesWithKeys = files.map((file) => ({
        file,
        key: getObjectUploadKey({
          basePrefix: file.prefix,
          path: file.path,
          name: file.name
        })
      }));

      // Only check for conflicts among files in the current folder (empty path)
      const directFiles = filesWithKeys.filter((f) => f.file.path === '');
      const subfolderFiles = filesWithKeys.filter((f) => f.file.path !== '');

      let conflicting: typeof filesWithKeys = [];
      let nonConflicting: typeof filesWithKeys;

      if (directFiles.length > 0) {
        const pages = await getObjects({ bucketId, prefix: basePrefix });
        const existingObjects = pages.flat();
        const existingFileKeys = new Set(
          existingObjects.filter((object) => object.type === 'file').map((object) => object.key)
        );

        conflicting = directFiles.filter((f) => existingFileKeys.has(f.key));

        nonConflicting = [
          ...directFiles.filter((f) => !existingFileKeys.has(f.key)),
          ...subfolderFiles
        ];
      } else {
        nonConflicting = filesWithKeys;
      }

      // Start uploading non-conflicting files immediately
      runWithConcurrency(nonConflicting, ({ file }) => upload(file), 4);

      // Show confirmation dialog for conflicting files
      if (conflicting.length > 0) {
        let shouldReplace = false;

        const fileNames = conflicting.map((f) => f.file.name);
        const maxShown = 5;
        const overflowCount = fileNames.length - maxShown;

        await alert({
          title: conflicting.length === 1 ? 'File already exists' : 'Files already exist',
          description:
            conflicting.length === 1 ? (
              <>
                A file named{' '}
                <Text color="base" variant="body-large-emphasized">
                  "{fileNames[0]}"
                </Text>{' '}
                already exists at this location.
              </>
            ) : (
              <>
                {conflicting.length} files already exist at this location:
                <br />
                <br />
                {fileNames.slice(0, maxShown).map((name) => (
                  <span key={name}>
                    <Text color="base" variant="body-large-emphasized">
                      "{name}"
                    </Text>
                    <br />
                  </span>
                ))}
                {overflowCount > 0 && <>and {overflowCount} more...</>}
              </>
            ),
          actions: {
            confirm: {
              label: conflicting.length === 1 ? 'Replace' : 'Replace All',
              variant: 'destructive',
              onClick: () => {
                shouldReplace = true;
              }
            }
          }
        });

        if (shouldReplace) {
          runWithConcurrency(conflicting, ({ file }) => upload(file), 4);
        }
      }
    },
    [upload, getObjects]
  );

  const retry = useCallback(
    async (id: string) => {
      const upload = useUploadStore.getState().uploads[id];
      const abortController = new AbortController();

      if (!upload) {
        throw new Error('Upload not found');
      }

      retryUpload(id, abortController);

      await doUpload({
        id: upload.id,
        object: upload.object,
        abortController
      });
    },
    [doUpload, retryUpload]
  );

  return {
    upload,
    uploadFiles,
    retry
  };
}
