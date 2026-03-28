import { useMemo } from 'react';
import { DownloadZipStatus, useDownloadZipStore } from './download-zip-store';

export function useDownloadZipProgress() {
  const activeDownload = useDownloadZipStore((s) => s.activeDownload);

  const overallProgress = useMemo(() => {
    if (!activeDownload) {
      return 0;
    }

    const { status, fetchedFiles, totalFiles, zipProgress } = activeDownload;

    if (status === DownloadZipStatus.Fetching) {
      const fetchProgress = totalFiles > 0 ? (fetchedFiles / totalFiles) * 100 : 0;

      return Math.round(fetchProgress * 0.5);
    }

    if (status === DownloadZipStatus.Zipping) {
      return Math.round(50 + zipProgress * 0.5);
    }

    if (status === DownloadZipStatus.Completed) {
      return 100;
    }

    return 0;
  }, [activeDownload]);

  const isActive =
    activeDownload !== null &&
    activeDownload.status !== DownloadZipStatus.Completed &&
    activeDownload.status !== DownloadZipStatus.Cancelled &&
    activeDownload.status !== DownloadZipStatus.Failed;

  return {
    activeDownload,
    overallProgress,
    isActive
  };
}
