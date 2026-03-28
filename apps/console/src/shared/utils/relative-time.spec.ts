import { describe, expect, it } from 'vitest';
import { relativeTime } from './relative-time';

const now = new Date('2024-06-15T12:00:00Z');

describe('relativeTime', () => {
  it('returns "now" for same time', () => {
    expect(relativeTime(now, now)).toBe('now');
  });

  it('returns seconds ago', () => {
    const past = new Date('2024-06-15T11:59:30Z');

    expect(relativeTime(past, now)).toBe('30 seconds ago');
  });

  it('returns minutes ago', () => {
    const past = new Date('2024-06-15T11:55:00Z');

    expect(relativeTime(past, now)).toBe('5 minutes ago');
  });

  it('returns hours ago', () => {
    const past = new Date('2024-06-15T09:00:00Z');

    expect(relativeTime(past, now)).toBe('3 hours ago');
  });

  it('returns days ago', () => {
    const past = new Date('2024-06-12T12:00:00Z');

    expect(relativeTime(past, now)).toBe('3 days ago');
  });

  it('returns months ago', () => {
    const past = new Date('2024-04-15T12:00:00Z');

    expect(relativeTime(past, now)).toBe('2 months ago');
  });

  it('returns years ago', () => {
    const past = new Date('2022-06-15T12:00:00Z');

    expect(relativeTime(past, now)).toBe('2 years ago');
  });

  it('returns future time (in X seconds)', () => {
    const future = new Date('2024-06-15T12:00:30Z');

    expect(relativeTime(future, now)).toBe('in 30 seconds');
  });

  it('accepts string date input', () => {
    expect(relativeTime('2024-06-15T11:59:30Z', now)).toBe('30 seconds ago');
  });

  it('accepts numeric timestamp input', () => {
    const past = new Date('2024-06-15T11:59:30Z');

    expect(relativeTime(past.getTime(), now)).toBe('30 seconds ago');
  });

  it('returns "yesterday" for 1 day ago', () => {
    const past = new Date('2024-06-14T12:00:00Z');

    expect(relativeTime(past, now)).toBe('yesterday');
  });
});
