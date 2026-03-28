import { BucketId } from '@buckethub/rpc-contract';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServicesContext } from '@/services/context';
import { ORPCClient, RouterInputs } from '@/services/rpc';
import { objectsQueryOptions } from '../queries';

const MULTIPART_THRESHOLD = 100 * 1024 * 1024; // 100MB
const PART_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_CONCURRENT_PARTS = 4;

export interface UploadObjectInput {
  bucketId: BucketId;
  key: string;
  /**
   * Prefix where the object upload is initiated
   */
  prefix: string;
  /**
   * Name of the object (object.jpg, object.txt, etc.)
   */
  name: string;
  /**
   * Path of the attached object (for files with folder structure)
   */
  path: string;
  file: File;
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

async function uploadFileWithProgress(
  url: string,
  file: File,
  signal?: AbortSignal,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', url);

    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;

          onProgress(progress);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Upload failed'));
    };

    xhr.onabort = () => {
      reject(new Error('Upload aborted'));
    };

    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    xhr.send(file);
  });
}

function uploadPartWithProgress(
  url: string,
  blob: Blob,
  signal: AbortSignal | undefined,
  onBytesLoaded: (loaded: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onBytesLoaded(event.loaded);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Part upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Part upload failed'));
    };

    xhr.onabort = () => {
      reject(new Error('Part upload aborted'));
    };

    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    xhr.send(blob);
  });
}

async function uploadMultipartWithProgress(
  orpc: ORPCClient,
  bucketId: BucketId,
  key: string,
  file: File,
  signal: AbortSignal | undefined,
  onProgress: ((progress: number) => void) | undefined
): Promise<void> {
  const totalParts = Math.ceil(file.size / PART_SIZE);

  const { uploadId, presignedUrls } = await orpc.objects.initiateMultipartUpload({
    bucketId,
    key,
    totalParts
  });

  const partBytesLoaded = new Array<number>(totalParts).fill(0);
  let nextPartIndex = 0;

  const reportProgress = () => {
    if (!onProgress) {
      return;
    }

    const totalLoaded = partBytesLoaded.reduce((sum, bytes) => sum + bytes, 0);
    const progress = (totalLoaded / file.size) * 100;

    onProgress(Math.min(progress, 100));
  };

  const uploadNextPart = async (): Promise<void> => {
    while (nextPartIndex < totalParts) {
      const partIndex = nextPartIndex++;
      const start = partIndex * PART_SIZE;
      const end = Math.min(start + PART_SIZE, file.size);
      const blob = file.slice(start, end);
      const { presignedUrl } = presignedUrls[partIndex];

      await uploadPartWithProgress(presignedUrl, blob, signal, (loaded) => {
        partBytesLoaded[partIndex] = loaded;
        reportProgress();
      });
    }
  };

  try {
    const workers = Array.from({ length: Math.min(MAX_CONCURRENT_PARTS, totalParts) }, () =>
      uploadNextPart()
    );

    await Promise.all(workers);

    await orpc.objects.completeMultipartUpload({
      bucketId,
      key,
      uploadId
    });
  } catch (error) {
    await orpc.objects.abortMultipartUpload({ bucketId, key, uploadId }).catch(() => {
      // Ignore errors from aborting the multipart upload
    });

    throw error;
  }
}

export function useUploadObject() {
  const queryClient = useQueryClient();
  const { orpc, orpcQuery } = useServicesContext();

  return useMutation({
    mutationFn: async ({ bucketId, key, file, signal, onProgress }: UploadObjectInput) => {
      if (file.size >= MULTIPART_THRESHOLD) {
        await uploadMultipartWithProgress(orpc, bucketId, key, file, signal, onProgress);
      } else {
        const { url } = await orpc.objects.getUploadUrl({
          bucketId,
          key
        });

        await uploadFileWithProgress(url, file, signal, onProgress);
      }
    },
    onSuccess: (_, { bucketId, prefix }) => {
      queryClient.invalidateQueries(
        objectsQueryOptions(orpcQuery, {
          bucketId,
          prefix: prefix || ''
        } as RouterInputs['objects']['getAllByBucketId'])
      );
    }
  });
}
