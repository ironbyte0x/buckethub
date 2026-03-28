import { describe, expect, it } from 'vitest';
import { formatBytes } from './format-size';

describe('formatBytes', () => {
  it('returns "0 B" for zero bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('returns "Invalid size" for negative bytes', () => {
    expect(formatBytes(-1)).toBe('Invalid size');
  });

  it('formats bytes correctly', () => {
    expect(formatBytes(500)).toBe('500.00 B');
  });

  it('formats kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1.00 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatBytes(1048576)).toBe('1.00 MB');
  });

  it('formats gigabytes correctly', () => {
    expect(formatBytes(1073741824)).toBe('1.00 GB');
  });

  it('formats terabytes correctly', () => {
    expect(formatBytes(1099511627776)).toBe('1.00 TB');
  });

  it('respects custom decimal places', () => {
    expect(formatBytes(1536, 0)).toBe('2 KB');
  });

  it('treats negative decimals as 0', () => {
    expect(formatBytes(1536, -1)).toBe('2 KB');
  });

  it('formats fractional sizes', () => {
    expect(formatBytes(2500000000)).toBe('2.33 GB');
  });

  it('handles 1 byte', () => {
    expect(formatBytes(1)).toBe('1.00 B');
  });

  it('handles boundary between KB and MB', () => {
    expect(formatBytes(1048575)).toBe('1024.00 KB');
  });
});
