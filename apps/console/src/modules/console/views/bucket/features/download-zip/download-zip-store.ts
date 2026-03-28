import { create } from 'zustand';

export enum DownloadZipStatus {
  Fetching = 'fetching',
  Zipping = 'zipping',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Failed = 'failed'
}

export interface DownloadZipItem {
  id: string;
  totalFiles: number;
  fetchedFiles: number;
  zipProgress: number;
  status: DownloadZipStatus;
  error?: string;
  abortController: AbortController;
}

interface DownloadZipStore {
  activeDownload: DownloadZipItem | null;
  actions: {
    startDownload: (id: string, totalFiles: number, abortController: AbortController) => void;
    updateFetchProgress: (fetchedFiles: number) => void;
    startZipping: () => void;
    updateZipProgress: (percent: number) => void;
    setCompleted: () => void;
    setCancelled: () => void;
    setFailed: (error: string) => void;
    clearDownload: () => void;
  };
}

export const useDownloadZipStore = create<DownloadZipStore>((set) => ({
  activeDownload: null,

  actions: {
    startDownload: (id, totalFiles, abortController) =>
      set({
        activeDownload: {
          id,
          totalFiles,
          fetchedFiles: 0,
          zipProgress: 0,
          status: DownloadZipStatus.Fetching,
          abortController
        }
      }),

    updateFetchProgress: (fetchedFiles) =>
      set((state) => ({
        activeDownload: state.activeDownload ? { ...state.activeDownload, fetchedFiles } : null
      })),

    startZipping: () =>
      set((state) => ({
        activeDownload: state.activeDownload
          ? { ...state.activeDownload, status: DownloadZipStatus.Zipping }
          : null
      })),

    updateZipProgress: (percent) =>
      set((state) => ({
        activeDownload: state.activeDownload
          ? { ...state.activeDownload, zipProgress: percent }
          : null
      })),

    setCompleted: () =>
      set((state) => ({
        activeDownload: state.activeDownload
          ? { ...state.activeDownload, status: DownloadZipStatus.Completed }
          : null
      })),

    setCancelled: () =>
      set((state) => ({
        activeDownload: state.activeDownload
          ? { ...state.activeDownload, status: DownloadZipStatus.Cancelled }
          : null
      })),

    setFailed: (error) =>
      set((state) => ({
        activeDownload: state.activeDownload
          ? { ...state.activeDownload, status: DownloadZipStatus.Failed, error }
          : null
      })),

    clearDownload: () => set({ activeDownload: null })
  }
}));
