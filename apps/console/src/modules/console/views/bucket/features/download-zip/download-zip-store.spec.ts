import { beforeEach, describe, expect, it } from 'vitest';
import { DownloadZipStatus, useDownloadZipStore } from './download-zip-store';

function createAbortController() {
  return new AbortController();
}

describe('download zip store', () => {
  beforeEach(() => {
    useDownloadZipStore.setState({ activeDownload: null });
  });

  describe('startDownload', () => {
    it('initializes active download', () => {
      const controller = createAbortController();

      useDownloadZipStore.getState().actions.startDownload('dl-1', 10, controller);

      const download = useDownloadZipStore.getState().activeDownload;

      expect(download).toMatchObject({
        id: 'dl-1',
        totalFiles: 10,
        fetchedFiles: 0,
        zipProgress: 0,
        status: DownloadZipStatus.Fetching
      });

      expect(download?.abortController).toBe(controller);
    });
  });

  describe('updateFetchProgress', () => {
    it('updates fetched files count', () => {
      useDownloadZipStore.getState().actions.startDownload('dl-1', 10, createAbortController());
      useDownloadZipStore.getState().actions.updateFetchProgress(5);

      expect(useDownloadZipStore.getState().activeDownload?.fetchedFiles).toBe(5);
    });

    it('returns null when no active download', () => {
      useDownloadZipStore.getState().actions.updateFetchProgress(5);

      expect(useDownloadZipStore.getState().activeDownload).toBeNull();
    });
  });

  describe('startZipping', () => {
    it('transitions status to zipping', () => {
      useDownloadZipStore.getState().actions.startDownload('dl-1', 10, createAbortController());
      useDownloadZipStore.getState().actions.startZipping();

      expect(useDownloadZipStore.getState().activeDownload?.status).toBe(DownloadZipStatus.Zipping);
    });

    it('returns null when no active download', () => {
      useDownloadZipStore.getState().actions.startZipping();
      expect(useDownloadZipStore.getState().activeDownload).toBeNull();
    });
  });

  describe('updateZipProgress', () => {
    it('updates zip progress percentage', () => {
      useDownloadZipStore.getState().actions.startDownload('dl-1', 10, createAbortController());
      useDownloadZipStore.getState().actions.updateZipProgress(75);

      expect(useDownloadZipStore.getState().activeDownload?.zipProgress).toBe(75);
    });
  });

  describe('setCompleted', () => {
    it('sets status to completed', () => {
      useDownloadZipStore.getState().actions.startDownload('dl-1', 10, createAbortController());
      useDownloadZipStore.getState().actions.setCompleted();

      expect(useDownloadZipStore.getState().activeDownload?.status).toBe(
        DownloadZipStatus.Completed
      );
    });

    it('returns null when no active download', () => {
      useDownloadZipStore.getState().actions.setCompleted();
      expect(useDownloadZipStore.getState().activeDownload).toBeNull();
    });
  });

  describe('setCancelled', () => {
    it('sets status to cancelled', () => {
      useDownloadZipStore.getState().actions.startDownload('dl-1', 10, createAbortController());
      useDownloadZipStore.getState().actions.setCancelled();

      expect(useDownloadZipStore.getState().activeDownload?.status).toBe(
        DownloadZipStatus.Cancelled
      );
    });
  });

  describe('setFailed', () => {
    it('sets status to failed with error', () => {
      useDownloadZipStore.getState().actions.startDownload('dl-1', 10, createAbortController());
      useDownloadZipStore.getState().actions.setFailed('Zip creation failed');

      const download = useDownloadZipStore.getState().activeDownload;

      expect(download?.status).toBe(DownloadZipStatus.Failed);
      expect(download?.error).toBe('Zip creation failed');
    });
  });

  describe('clearDownload', () => {
    it('resets active download to null', () => {
      useDownloadZipStore.getState().actions.startDownload('dl-1', 10, createAbortController());
      useDownloadZipStore.getState().actions.clearDownload();

      expect(useDownloadZipStore.getState().activeDownload).toBeNull();
    });
  });
});
