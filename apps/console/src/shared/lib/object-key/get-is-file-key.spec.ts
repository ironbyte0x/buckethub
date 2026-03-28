import { describe, expect, it } from 'vitest';
import { getIsFileKey } from './get-is-file-key';

describe('getIsFileKey', () => {
  it('returns false for undefined', () => {
    expect(getIsFileKey()).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(getIsFileKey('')).toBe(false);
  });

  it('returns true for file key (no trailing slash)', () => {
    expect(getIsFileKey('folder/file.txt')).toBe(true);
  });

  it('returns false for folder key (trailing slash)', () => {
    expect(getIsFileKey('folder/')).toBe(false);
  });

  it('returns true for root-level file', () => {
    expect(getIsFileKey('file.txt')).toBe(true);
  });

  it('returns false for nested folder', () => {
    expect(getIsFileKey('folder/subfolder/')).toBe(false);
  });
});
