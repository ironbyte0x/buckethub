import { create } from 'zustand';
import { BucketId } from '@buckethub/rpc-contract';

export enum UploadStatus {
  Uploading = 'uploading',
  Completed = 'completed',
  Aborted = 'aborted',
  Failed = 'failed'
}

export interface ObjectData {
  id: string;
  bucketId: BucketId;
  key: string;
  prefix: string;
  name: string;
  path: string;
  size: number;
  file: File;
}

export interface UploadItem {
  id: string;
  object: ObjectData;
  progress: number;
  status: UploadStatus;
  error?: string;
  abortController: AbortController;
}

interface UploadStore {
  ids: string[];
  uploads: Record<string, UploadItem>;
  actions: {
    addUpload: (upload: ObjectData, abortController: AbortController) => void;
    updateProgress: (id: string, progress: number) => void;
    setCompleted: (id: string) => void;
    setAborted: (id: string) => void;
    setFailed: (id: string, error: string) => void;
    retryUpload: (id: string, abortController: AbortController) => void;
    removeUpload: (id: string) => void;
    clearCompleted: () => void;
  };
}

export const useUploadStore = create<UploadStore>((set) => ({
  ids: [],
  uploads: {},

  actions: {
    addUpload: (object, abortController) =>
      set((state) => ({
        ids: [...state.ids, object.id],
        uploads: {
          ...state.uploads,
          [object.id]: {
            id: object.id,
            object,
            progress: 0,
            status: UploadStatus.Uploading,
            abortController
          }
        }
      })),

    updateProgress: (id, progress) =>
      set((state) => ({
        uploads: {
          ...state.uploads,
          [id]: state.uploads[id]
            ? {
                ...state.uploads[id],
                progress,
                status: UploadStatus.Uploading
              }
            : state.uploads[id]
        }
      })),

    setCompleted: (id) =>
      set((state) => ({
        uploads: {
          ...state.uploads,
          [id]: state.uploads[id]
            ? {
                ...state.uploads[id],
                progress: 100,
                status: UploadStatus.Completed
              }
            : state.uploads[id]
        }
      })),

    setAborted: (id) =>
      set((state) => ({
        uploads: {
          ...state.uploads,
          [id]: state.uploads[id]
            ? {
                ...state.uploads[id],
                status: UploadStatus.Aborted
              }
            : state.uploads[id]
        }
      })),

    setFailed: (id, error) =>
      set((state) => ({
        uploads: {
          ...state.uploads,
          [id]: state.uploads[id]
            ? {
                ...state.uploads[id],
                status: UploadStatus.Failed,
                error
              }
            : state.uploads[id]
        }
      })),

    retryUpload: (id, abortController) =>
      set((state) => ({
        uploads: {
          ...state.uploads,
          [id]: {
            ...state.uploads[id],
            progress: 0,
            status: UploadStatus.Uploading,
            abortController
          }
        }
      })),

    removeUpload: (id) =>
      set((state) => {
        const ids = state.ids.filter((existingId) => existingId !== id);
        const { [id]: _, ...rest } = state.uploads;

        return { ids, uploads: rest };
      }),

    clearCompleted: () =>
      set((state) => ({
        ids: state.ids.filter((id) => state.uploads[id].status !== UploadStatus.Completed),
        uploads: Object.fromEntries(
          Object.entries(state.uploads).filter(
            ([, upload]) => upload.status !== UploadStatus.Completed
          )
        )
      }))
  }
}));
