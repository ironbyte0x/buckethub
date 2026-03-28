import { describe, expect, it } from 'vitest';
import { Duration } from './duration';

describe('Duration', () => {
  describe('factory methods', () => {
    it('inDays converts days to milliseconds', () => {
      expect(Duration.inDays(1).toMilliseconds()).toBe(86_400_000);
      expect(Duration.inDays(2).toMilliseconds()).toBe(172_800_000);
    });

    it('inHours converts hours to milliseconds', () => {
      expect(Duration.inHours(1).toMilliseconds()).toBe(3_600_000);
      expect(Duration.inHours(24).toMilliseconds()).toBe(86_400_000);
    });

    it('inMinutes converts minutes to milliseconds', () => {
      expect(Duration.inMinutes(1).toMilliseconds()).toBe(60_000);
      expect(Duration.inMinutes(60).toMilliseconds()).toBe(3_600_000);
    });

    it('inSeconds converts seconds to milliseconds', () => {
      expect(Duration.inSeconds(1).toMilliseconds()).toBe(1_000);
      expect(Duration.inSeconds(60).toMilliseconds()).toBe(60_000);
    });

    it('inMilliseconds stores value directly', () => {
      expect(Duration.inMilliseconds(500).toMilliseconds()).toBe(500);
      expect(Duration.inMilliseconds(0).toMilliseconds()).toBe(0);
    });
  });

  describe('conversion methods', () => {
    it('toDays converts milliseconds to days', () => {
      expect(Duration.inDays(3).toDays()).toBe(3);
      expect(Duration.inHours(48).toDays()).toBe(2);
    });

    it('toHours converts milliseconds to hours', () => {
      expect(Duration.inHours(5).toHours()).toBe(5);
      expect(Duration.inDays(1).toHours()).toBe(24);
    });

    it('toMinutes converts milliseconds to minutes', () => {
      expect(Duration.inMinutes(90).toMinutes()).toBe(90);
      expect(Duration.inHours(1).toMinutes()).toBe(60);
    });

    it('toSeconds converts milliseconds to seconds', () => {
      expect(Duration.inSeconds(30).toSeconds()).toBe(30);
      expect(Duration.inMinutes(1).toSeconds()).toBe(60);
    });
  });

  describe('round-trip consistency', () => {
    it('inDays and toDays are inverse operations', () => {
      expect(Duration.inDays(7).toDays()).toBe(7);
    });

    it('inHours and toHours are inverse operations', () => {
      expect(Duration.inHours(12).toHours()).toBe(12);
    });

    it('inMinutes and toMinutes are inverse operations', () => {
      expect(Duration.inMinutes(45).toMinutes()).toBe(45);
    });

    it('inSeconds and toSeconds are inverse operations', () => {
      expect(Duration.inSeconds(6).toSeconds()).toBe(6);
    });
  });
});
