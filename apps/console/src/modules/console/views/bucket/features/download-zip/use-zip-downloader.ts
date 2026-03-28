import { useCallback } from 'react';
import { zip } from 'fflate';
import { BucketId } from '@buckethub/rpc-contract';
import { useDownloadUrl } from '@/services/objects';
import { downloadFile } from '@/shared/utils/download-file';
import { useDownloadZipStore } from './download-zip-store';

interface FileToZip {
  key: string;
  zipPath: string;
}

export function useZipDownloader() {
  const { mutateAsync: getDownloadUrl } = useDownloadUrl();
  const {
    startDownload,
    updateFetchProgress,
    startZipping,
    setCompleted,
    setCancelled,
    setFailed
  } = useDownloadZipStore((state) => state.actions);

  const downloadAndZip = useCallback(
    async (bucketId: BucketId, files: FileToZip[], zipFileName: string) => {
      const downloadId = `zip-${Date.now()}`;
      const abortController = new AbortController();
      const signal = abortController.signal;

      startDownload(downloadId, files.length, abortController);

      try {
        const filesToAdd: { name: string; data: ArrayBuffer }[] = [];

        for (let index = 0; index < files.length; index++) {
          if (signal.aborted) {
            setCancelled();

            return;
          }

          const file = files[index];
          const { url } = await getDownloadUrl({ bucketId, key: file.key });
          const response = await fetch(url, { signal });

          if (!response.ok) {
            throw new Error(
              `Failed to download "${file.key}": ${response.status} ${response.statusText}`
            );
          }

          const arrayBuffer = await response.arrayBuffer();

          filesToAdd.push({
            name: file.zipPath,
            data: arrayBuffer
          });

          updateFetchProgress(index + 1);
        }

        startZipping();

        if (signal.aborted) {
          setCancelled();

          return;
        }

        const zipFiles: Record<string, Uint8Array> = {};

        for (const file of filesToAdd) {
          zipFiles[file.name] = new Uint8Array(file.data);
        }

        await new Promise<void>((resolve, reject) => {
          const terminate = zip(zipFiles, { level: 6 }, (error, data) => {
            signal.removeEventListener('abort', terminate);

            if (error) {
              if (signal.aborted) {
                setCancelled();
                resolve();
              } else {
                setFailed(String(error));
                reject(error);
              }
            } else if (signal.aborted) {
              setCancelled();
              resolve();
            } else {
              const buffer = data.buffer.slice(0) as ArrayBuffer;
              const blob = new Blob([buffer], { type: 'application/zip' });

              setCompleted();
              triggerDownload(blob, zipFileName);
              resolve();
            }
          });

          signal.addEventListener('abort', terminate);
        });
      } catch (error) {
        if (signal.aborted) {
          setCancelled();
        } else {
          setFailed(String(error));
          throw error;
        }
      }
    },
    [
      getDownloadUrl,
      startDownload,
      updateFetchProgress,
      startZipping,
      setCompleted,
      setCancelled,
      setFailed
    ]
  );

  return { downloadAndZip };
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);

  downloadFile(url, fileName);

  URL.revokeObjectURL(url);
}
