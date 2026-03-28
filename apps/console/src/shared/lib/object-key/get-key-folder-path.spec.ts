import { describe, expect, it } from 'vitest';
import { getKeyFolderPath } from './get-key-folder-path';

describe('getKeyFolderPath', () => {
  it('returns empty string for undefined', () => {
    expect(getKeyFolderPath()).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(getKeyFolderPath('')).toBe('');
  });

  it('returns empty string for root-level file', () => {
    expect(getKeyFolderPath('file.txt')).toBe('');
  });

  it('returns folder path for nested file', () => {
    expect(getKeyFolderPath('folder/file.txt')).toBe('folder/');
  });

  it('returns parent folder for folder key', () => {
    expect(getKeyFolderPath('folder/subfolder/')).toBe('folder/subfolder/');
  });

  it('returns deeply nested folder path', () => {
    expect(getKeyFolderPath('a/b/c/file.txt')).toBe('a/b/c/');
  });
});
