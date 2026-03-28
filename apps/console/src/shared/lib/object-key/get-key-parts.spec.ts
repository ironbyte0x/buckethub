import { describe, expect, it } from 'vitest';
import { getKeyParts } from './get-key-parts';

describe('getKeyParts', () => {
  it('returns empty array for undefined', () => {
    expect(getKeyParts()).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(getKeyParts('')).toEqual([]);
  });

  it('returns single part for root-level file', () => {
    expect(getKeyParts('file.txt')).toEqual(['file.txt']);
  });

  it('splits nested path into parts', () => {
    expect(getKeyParts('folder/subfolder/file.txt')).toEqual(['folder', 'subfolder', 'file.txt']);
  });

  it('filters out empty parts from trailing slash', () => {
    expect(getKeyParts('folder/')).toEqual(['folder']);
  });

  it('filters out empty parts from leading slash', () => {
    expect(getKeyParts('/folder/file.txt')).toEqual(['folder', 'file.txt']);
  });

  it('handles multiple consecutive slashes', () => {
    expect(getKeyParts('folder//file.txt')).toEqual(['folder', 'file.txt']);
  });
});
