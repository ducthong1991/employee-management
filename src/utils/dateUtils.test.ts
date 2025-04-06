import { describe, it, expect } from 'vitest';
import { formatDate } from './dateUtils';

// These tests use the actual Luxon implementation
describe('dateUtils integration', () => {
  describe('formatDate', () => {
    it('should properly format a date with the default format', () => {
      const result = formatDate('2023-01-15');

      // The exact format might vary based on locale, but we can check that it's populated
      expect(result).not.toBe('');
      expect(result.length).toBeGreaterThan(3);
    });

    it('should format a date with long format', () => {
      const result = formatDate('2023-01-15', 'long');

      // Long format should contain month name
      expect(result.toLowerCase()).toContain('january');
      expect(result).toContain('15');
      expect(result).toContain('2023');
    });

    it('should format a date with full format', () => {
      const result = formatDate('2023-01-15T12:30:00', 'full');

      // Full format should contain month name, day, year, and time
      expect(result.toLowerCase()).toContain('january');
      expect(result).toContain('15');
      expect(result).toContain('2023');
      // Should contain time components
      expect(result.toLowerCase()).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should return empty string for null input', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(formatDate(undefined)).toBe('');
    });
  });
});
