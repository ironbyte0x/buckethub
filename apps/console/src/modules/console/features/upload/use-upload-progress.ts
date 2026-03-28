import { useMemo } from 'react';
import { UploadStatus, useUploadStore } from './upload-store';

export function useUploadProgress() {
  const { ids, uploads } = useUploadStore();

  const uploadingItems = useMemo(
    () => ids.filter((id) => uploads[id].status === UploadStatus.Uploading),
    [ids, uploads]
  );

  const failedItems = useMemo(
    () => ids.filter((id) => uploads[id].status === UploadStatus.Failed),
    [ids, uploads]
  );

  const overallProgress = useMemo(() => {
    if (ids.length === 0) {
      return 0;
    }

    if (uploadingItems.length === 0) {
      return 100;
    }

    const totalProgress = uploadingItems.reduce((sum, id) => sum + uploads[id].progress, 0);

    return Math.round(totalProgress / uploadingItems.length);
  }, [ids.length, uploadingItems, uploads]);

  const uploadingCount = uploadingItems.length;
  const failedCount = failedItems.length;

  return {
    overallProgress,
    uploadingCount,
    failedCount
  };
}
