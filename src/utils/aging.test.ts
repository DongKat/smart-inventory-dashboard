import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { computeDaysInStock, isAgingVehicle, getAgingSeverity } from './aging';

describe('aging utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('computeDaysInStock', () => {
    it('returns 0 for today', () => {
      expect(computeDaysInStock('2025-01-15')).toBe(0);
    });

    it('returns correct days for a past date', () => {
      expect(computeDaysInStock('2025-01-10')).toBe(5);
    });

    it('returns 0 for future dates', () => {
      expect(computeDaysInStock('2025-02-01')).toBe(0);
    });

    it('handles large gaps', () => {
      expect(computeDaysInStock('2024-01-15')).toBe(366); // 2024 is leap year
    });
  });

  describe('isAgingVehicle', () => {
    it('returns false at 90 days', () => {
      expect(isAgingVehicle(90)).toBe(false);
    });

    it('returns true at 91 days', () => {
      expect(isAgingVehicle(91)).toBe(true);
    });

    it('returns false at 0 days', () => {
      expect(isAgingVehicle(0)).toBe(false);
    });
  });

  describe('getAgingSeverity', () => {
    it('returns normal for 0-90 days', () => {
      expect(getAgingSeverity(0)).toBe('normal');
      expect(getAgingSeverity(90)).toBe('normal');
    });

    it('returns warning for 91-180 days', () => {
      expect(getAgingSeverity(91)).toBe('warning');
      expect(getAgingSeverity(180)).toBe('warning');
    });

    it('returns critical for 181+ days', () => {
      expect(getAgingSeverity(181)).toBe('critical');
      expect(getAgingSeverity(365)).toBe('critical');
    });
  });
});
