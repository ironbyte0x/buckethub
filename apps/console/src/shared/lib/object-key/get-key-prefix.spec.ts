import { describe, expect, it } from 'vitest';
import { getKeyPrefix } from './get-key-prefix';

describe('getKeyPrefix', () => {
  it('returns empty string for undefined', () => {
    expect(getKeyPrefix()).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(getKeyPrefix('')).toBe('');
  });

  it('returns the key itself for folder key', () => {
    expect(getKeyPrefix('folder/')).toBe('folder/');
  });

  it('returns nested folder key as-is', () => {
    expect(getKeyPrefix('folder/subfolder/')).toBe('folder/subfolder/');
  });

  it('returns empty string for root-level file', () => {
    expect(getKeyPrefix('file.txt')).toBe('');
  });

  it('returns parent prefix for nested file', () => {
    expect(getKeyPrefix('folder/file.txt')).toBe('folder/');
  });

  it('returns deeply nested prefix for file', () => {
    expect(getKeyPrefix('a/b/c/file.txt')).toBe('a/b/c/');
  });
});
