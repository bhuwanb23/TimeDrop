import { deg2rad, calculateDistance, formatNumber, clamp } from '../utils/mathUtils';

describe('Math Utility Functions', () => {
  describe('deg2rad', () => {
    it('should convert degrees to radians correctly', () => {
      expect(deg2rad(0)).toBe(0);
      expect(deg2rad(90)).toBeCloseTo(Math.PI / 2);
      expect(deg2rad(180)).toBeCloseTo(Math.PI);
      expect(deg2rad(360)).toBeCloseTo(2 * Math.PI);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate the distance between two points correctly', () => {
      // Test with known coordinates
      const lat1 = 12.9716; // Bangalore
      const lon1 = 77.5946;
      const lat2 = 13.0827; // Chennai
      const lon2 = 80.2707;
      
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      
      // Distance between Bangalore and Chennai is approximately 290km based on our calculation
      // We'll check if it's in a reasonable range
      expect(distance).toBeGreaterThan(250);
      expect(distance).toBeLessThan(350);
    });

    it('should return 0 when calculating distance to the same point', () => {
      const lat = 12.9716;
      const lon = 77.5946;
      
      const distance = calculateDistance(lat, lon, lat, lon);
      
      expect(distance).toBeCloseTo(0, 5);
    });

    it('should handle negative coordinates correctly', () => {
      // Test with negative coordinates (Southern Hemisphere, Western Hemisphere)
      const lat1 = -33.8688; // Sydney
      const lon1 = 151.2093;
      const lat2 = -37.8136; // Melbourne
      const lon2 = 144.9631;
      
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      
      // Distance between Sydney and Melbourne is approximately 715km
      expect(distance).toBeGreaterThan(650);
      expect(distance).toBeLessThan(750);
    });
  });

  describe('formatNumber', () => {
    it('should format a number to 2 decimal places by default', () => {
      expect(formatNumber(3.14159)).toBe(3.14);
      expect(formatNumber(10.567)).toBe(10.57);
      expect(formatNumber(5)).toBe(5);
    });

    it('should format a number to specified decimal places', () => {
      expect(formatNumber(3.14159, 3)).toBe(3.142);
      expect(formatNumber(10.567, 1)).toBe(10.6);
      expect(formatNumber(5, 0)).toBe(5);
    });
  });

  describe('clamp', () => {
    it('should clamp a value within the specified range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });
});