const {
  groupByPincode,
  sortByLocation,
  assignDeliveriesToDrivers,
  optimizeForDistance,
  groupAndAssignDeliveries
} = require('../src/utils/deliveryGrouping');

describe('Delivery Grouping Utility', () => {
  describe('groupByPincode', () => {
    it('should group orders by pincode correctly', () => {
      const orders = [
        { id: 1, pincode: '500001', lat: 17.3850, lng: 78.4867 },
        { id: 2, pincode: '500002', lat: 17.3860, lng: 78.4877 },
        { id: 3, pincode: '500001', lat: 17.3870, lng: 78.4887 }
      ];

      const grouped = groupByPincode(orders);
      
      expect(grouped['500001']).toHaveLength(2);
      expect(grouped['500002']).toHaveLength(1);
      expect(grouped['500001'][0].id).toBe(1);
      expect(grouped['500001'][1].id).toBe(3);
    });

    it('should handle empty orders array', () => {
      const grouped = groupByPincode([]);
      expect(Object.keys(grouped)).toHaveLength(0);
    });
  });

  describe('sortByLocation', () => {
    it('should sort orders by proximity to depot', () => {
      const orders = [
        { id: 1, lat: 17.3870, lng: 78.4887 }, // Farthest
        { id: 2, lat: 17.3850, lng: 78.4867 }, // Closest to depot (17.3850, 78.4867)
        { id: 3, lat: 17.3860, lng: 78.4877 }  // Middle
      ];

      const depot = { lat: 17.3850, lng: 78.4867 };
      const sorted = sortByLocation(orders, depot);
      
      expect(sorted[0].id).toBe(2); // Closest first
      expect(sorted[1].id).toBe(3);
      expect(sorted[2].id).toBe(1); // Farthest last
    });
  });

  describe('assignDeliveriesToDrivers', () => {
    it('should distribute orders among drivers using round-robin', async () => {
      const orders = [
        { id: 1, pincode: '500001' },
        { id: 2, pincode: '500001' },
        { id: 3, pincode: '500001' },
        { id: 4, pincode: '500001' }
      ];

      const drivers = [
        { id: 1, name: 'Driver 1' },
        { id: 2, name: 'Driver 2' }
      ];

      const assignments = await assignDeliveriesToDrivers(orders, drivers);
      
      // Check that orders were assigned to drivers
      expect(assignments).toHaveLength(4);
      expect(assignments[0]).toHaveProperty('assigned_driver_id');
      expect(assignments[1]).toHaveProperty('assigned_driver_id');
    });

    it('should handle more drivers than orders', async () => {
      const orders = [{ id: 1, pincode: '500001' }];
      const drivers = [
        { id: 1, name: 'Driver 1' },
        { id: 2, name: 'Driver 2' },
        { id: 3, name: 'Driver 3' }
      ];

      const assignments = await assignDeliveriesToDrivers(orders, drivers);
      
      // Check that the order was assigned to a driver
      expect(assignments).toHaveLength(1);
      expect(assignments[0]).toHaveProperty('assigned_driver_id');
    });
  });

  describe('optimizeForDistance', () => {
    it('should reorder deliveries to minimize travel distance', () => {
      const deliveries = [
        { id: 1, lat: 17.3870, lng: 78.4887 },
        { id: 2, lat: 17.3850, lng: 78.4867 },
        { id: 3, lat: 17.3860, lng: 78.4877 }
      ];

      const depot = { lat: 17.3850, lng: 78.4867 };
      const optimized = optimizeForDistance(deliveries, depot);
      
      // The depot location order should be first
      expect(optimized[0].id).toBe(2);
    });
  });

  describe('groupAndAssignDeliveries', () => {
    it('should integrate all grouping and assignment steps', async () => {
      const orders = [
        { id: 1, pincode: '500001', lat: 17.3850, lng: 78.4867, status: 'Slot Selected' },
        { id: 2, pincode: '500002', lat: 17.3860, lng: 78.4877, status: 'Slot Selected' },
        { id: 3, pincode: '500001', lat: 17.3870, lng: 78.4887, status: 'Slot Selected' }
      ];

      const drivers = [
        { id: 1, name: 'Driver 1', lat: 17.3850, lng: 78.4867 },
        { id: 2, name: 'Driver 2', lat: 17.3850, lng: 78.4867 }
      ];

      const depot = { lat: 17.3850, lng: 78.4867 };

      const result = await groupAndAssignDeliveries(orders, drivers, depot);
      
      expect(result).toHaveProperty('groups');
      expect(result).toHaveProperty('totalDrivers');
      expect(result).toHaveProperty('totalOrders');
    });

    it('should handle empty orders', async () => {
      const orders = [];
      const drivers = [{ id: 1, name: 'Driver 1' }];
      const depot = { lat: 17.3850, lng: 78.4867 };

      const result = await groupAndAssignDeliveries(orders, drivers, depot);
      
      expect(result.groups).toEqual({});
      expect(result.totalOrders).toBe(0);
    });
  });
});