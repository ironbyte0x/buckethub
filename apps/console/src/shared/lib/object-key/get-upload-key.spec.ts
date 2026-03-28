import { describe, expect, it } from 'vitest';
import { getObjectUploadKey } from './get-upload-key';

describe('getObjectUploadKey', () => {
  it('concatenates base prefix, path, and name', () => {
    expect(getObjectUploadKey({ basePrefix: 'uploads/', path: 'images/', name: 'photo.jpg' })).toBe(
      'uploads/images/photo.jpg'
    );
  });

  it('handles empty base prefix', () => {
    expect(getObjectUploadKey({ basePrefix: '', path: '', name: 'file.txt' })).toBe('file.txt');
  });

  it('handles empty path', () => {
    expect(getObjectUploadKey({ basePrefix: 'prefix/', path: '', name: 'file.txt' })).toBe(
      'prefix/file.txt'
    );
  });

  it('handles nested folder path', () => {
    expect(getObjectUploadKey({ basePrefix: 'root/', path: 'a/b/c/', name: 'data.csv' })).toBe(
      'root/a/b/c/data.csv'
    );
  });
});
