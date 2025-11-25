import { calculateDistance } from '../utils/mathUtils';

describe('Performance Tests', () => {
  describe('calculateDistance', () => {
    it('should calculate distance efficiently', () => {
      const lat1 = 12.9716;
      const lon1 = 77.5946;
      const lat2 = 13.0827;
      const lon2 = 80.2707;
      
      // Measure execution time
      const start = performance.now();
      
      // Run the function multiple times
      for (let i = 0; i < 10000; i++) {
        calculateDistance(lat1, lon1, lat2, lon2);
      }
      
      const end = performance.now();
      const executionTime = end - start;
      
      // Should complete within a reasonable time (less than 100ms for 10000 operations)
      expect(executionTime).toBeLessThan(100);
      
      console.log(`calculateDistance executed 10000 times in ${executionTime.toFixed(2)}ms`);
    });

    it('should maintain accuracy under load', () => {
      const lat1 = 12.9716;
      const lon1 = 77.5946;
      const lat2 = 13.0827;
      const lon2 = 80.2707;
      
      // Run multiple calculations and check consistency
      const results = [];
      for (let i = 0; i < 1000; i++) {
        results.push(calculateDistance(lat1, lon1, lat2, lon2));
      }
      
      // All results should be the same
      const firstResult = results[0];
      const allEqual = results.every(result => result === firstResult);
      
      expect(allEqual).toBe(true);
    });
  });
});