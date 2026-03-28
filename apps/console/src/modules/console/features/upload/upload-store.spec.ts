import { beforeEach, describe, expect, it } from 'vitest';
import { BucketId } from '@buckethub/rpc-contract';
import { type ObjectData, UploadStatus, useUploadStore } from './upload-store';

function createObjectData(id: string): ObjectData {
  return {
    id,
    bucketId: 'bucket-1' as BucketId,
    key: `prefix/${id}`,
    prefix: 'prefix/',
    name: id,
    path: '',
    size: 1024,
    file: new File(['test'], id)
  };
}

function createAbortController() {
  return new AbortController();
}

describe('upload store', () => {
  beforeEach(() => {
    useUploadStore.setState({ ids: [], uploads: {} });
  });

  describe('addUpload', () => {
    it('adds upload to ids and uploads', () => {
      const object = createObjectData('file1');
      const controller = createAbortController();

      useUploadStore.getState().actions.addUpload(object, controller);

      const state = useUploadStore.getState();

      expect(state.ids).toEqual(['file1']);

      expect(state.uploads['file1']).toMatchObject({
        id: 'file1',
        progress: 0,
        status: UploadStatus.Uploading
      });
    });

    it('appends multiple uploads', () => {
      useUploadStore.getState().actions.addUpload(createObjectData('f1'), createAbortController());
      useUploadStore.getState().actions.addUpload(createObjectData('f2'), createAbortController());

      expect(useUploadStore.getState().ids).toEqual(['f1', 'f2']);
    });
  });

  describe('updateProgress', () => {
    it('updates progress of existing upload', () => {
      useUploadStore.getState().actions.addUpload(createObjectData('f1'), createAbortController());
      useUploadStore.getState().actions.updateProgress('f1', 50);

      expect(useUploadStore.getState().uploads['f1'].progress).toBe(50);
      expect(useUploadStore.getState().uploads['f1'].status).toBe(UploadStatus.Uploading);
    });

    it('does not crash for non-existent upload', () => {
      useUploadStore.getState().actions.updateProgress('nonexistent', 50);
      expect(useUploadStore.getState().uploads['nonexistent']).toBeUndefined();
    });
  });

  describe('setCompleted', () => {
    it('sets status to completed and progress to 100', () => {
      useUploadStore.getState().actions.addUpload(createObjectData('f1'), createAbortController());
      useUploadStore.getState().actions.setCompleted('f1');

      const upload = useUploadStore.getState().uploads['f1'];

      expect(upload.status).toBe(UploadStatus.Completed);
      expect(upload.progress).toBe(100);
    });

    it('does not crash for non-existent upload', () => {
      useUploadStore.getState().actions.setCompleted('nonexistent');
      expect(useUploadStore.getState().uploads['nonexistent']).toBeUndefined();
    });
  });

  describe('setAborted', () => {
    it('sets status to aborted', () => {
      useUploadStore.getState().actions.addUpload(createObjectData('f1'), createAbortController());
      useUploadStore.getState().actions.setAborted('f1');

      expect(useUploadStore.getState().uploads['f1'].status).toBe(UploadStatus.Aborted);
    });
  });

  describe('setFailed', () => {
    it('sets status to failed with error message', () => {
      useUploadStore.getState().actions.addUpload(createObjectData('f1'), createAbortController());
      useUploadStore.getState().actions.setFailed('f1', 'Network error');

      const upload = useUploadStore.getState().uploads['f1'];

      expect(upload.status).toBe(UploadStatus.Failed);
      expect(upload.error).toBe('Network error');
    });
  });

  describe('retryUpload', () => {
    it('resets progress and status to uploading with new abort controller', () => {
      useUploadStore.getState().actions.addUpload(createObjectData('f1'), createAbortController());
      useUploadStore.getState().actions.setFailed('f1', 'Error');

      const newController = createAbortController();

      useUploadStore.getState().actions.retryUpload('f1', newController);

      const upload = useUploadStore.getState().uploads['f1'];

      expect(upload.progress).toBe(0);
      expect(upload.status).toBe(UploadStatus.Uploading);
      expect(upload.abortController).toBe(newController);
    });
  });

  describe('removeUpload', () => {
    it('removes upload from ids and uploads', () => {
      useUploadStore.getState().actions.addUpload(createObjectData('f1'), createAbortController());
      useUploadStore.getState().actions.addUpload(createObjectData('f2'), createAbortController());

      useUploadStore.getState().actions.removeUpload('f1');

      const state = useUploadStore.getState();

      expect(state.ids).toEqual(['f2']);
      expect(state.uploads['f1']).toBeUndefined();
      expect(state.uploads['f2']).toBeDefined();
    });
  });

  describe('clearCompleted', () => {
    it('removes only completed uploads', () => {
      useUploadStore.getState().actions.addUpload(createObjectData('f1'), createAbortController());
      useUploadStore.getState().actions.addUpload(createObjectData('f2'), createAbortController());
      useUploadStore.getState().actions.addUpload(createObjectData('f3'), createAbortController());

      useUploadStore.getState().actions.setCompleted('f1');
      useUploadStore.getState().actions.setFailed('f2', 'Error');

      useUploadStore.getState().actions.clearCompleted();

      const state = useUploadStore.getState();

      expect(state.ids).toEqual(['f2', 'f3']);
      expect(state.uploads['f1']).toBeUndefined();
      expect(state.uploads['f2']).toBeDefined();
      expect(state.uploads['f3']).toBeDefined();
    });

    it('does nothing when no uploads are completed', () => {
      useUploadStore.getState().actions.addUpload(createObjectData('f1'), createAbortController());

      useUploadStore.getState().actions.clearCompleted();

      expect(useUploadStore.getState().ids).toEqual(['f1']);
    });
  });
});
