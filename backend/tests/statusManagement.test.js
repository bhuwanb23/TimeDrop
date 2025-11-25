const {
  ORDER_STATUSES,
  VALID_STATUS_TRANSITIONS,
  validateStatusTransition,
  logStatusChange,
  sendStatusNotification
} = require('../src/utils/statusManagement');

describe('Status Management Utility', () => {
  describe('ORDER_STATUSES', () => {
    it('should define all required order statuses', () => {
      expect(ORDER_STATUSES).toContain('Pending Slot Selection');
      expect(ORDER_STATUSES).toContain('Slot Selected');
      expect(ORDER_STATUSES).toContain('Out for Delivery');
      expect(ORDER_STATUSES).toContain('Delivered');
      expect(ORDER_STATUSES).toContain('Customer Not Available');
      expect(ORDER_STATUSES).toContain('Rescheduled');
    });
  });

  describe('VALID_STATUS_TRANSITIONS', () => {
    it('should define valid transitions for each status', () => {
      expect(VALID_STATUS_TRANSITIONS['Pending Slot Selection']).toContain('Slot Selected');
      expect(VALID_STATUS_TRANSITIONS['Slot Selected']).toContain('Out for Delivery');
      expect(VALID_STATUS_TRANSITIONS['Out for Delivery']).toContain('Delivered');
      expect(VALID_STATUS_TRANSITIONS['Out for Delivery']).toContain('Customer Not Available');
    });
  });

  describe('validateStatusTransition', () => {
    it('should allow valid status transitions', () => {
      const result = validateStatusTransition(
        'Pending Slot Selection',
        'Slot Selected'
      );
      expect(result).toBe(true);
    });

    it('should reject invalid status transitions', () => {
      const result = validateStatusTransition(
        'Delivered',
        'Pending Slot Selection'
      );
      expect(result).toBe(false);
    });

    it('should handle same status transition', () => {
      const result = validateStatusTransition(
        'Slot Selected',
        'Slot Selected'
      );
      expect(result).toBe(false);
    });
  });

  describe('logStatusChange', () => {
    it('should log status changes with timestamp', () => {
      const orderId = 'TEST-001';
      const oldStatus = ORDER_STATUSES.PENDING_SLOT_SELECTION;
      const newStatus = ORDER_STATUSES.SLOT_SELECTED;
      
      // Mock console.log to capture output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      logStatusChange(orderId, oldStatus, newStatus);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('sendStatusNotification', () => {
    it('should send notification for status changes', () => {
      const order = {
        order_id: 'TEST-001',
        customer_name: 'Test Customer',
        phone: '9876543210'
      };
      const status = ORDER_STATUSES.SLOT_SELECTED;
      
      // Mock console.log to capture output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      sendStatusNotification(order, status);
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});