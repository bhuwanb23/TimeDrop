// Simple math functions for testing
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const subtract = (a, b) => a - b;

describe('Math Functions', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers correctly', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should add positive and negative numbers correctly', () => {
      expect(add(5, -3)).toBe(2);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers correctly', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should multiply negative numbers correctly', () => {
      expect(multiply(-3, -4)).toBe(12);
    });

    it('should multiply positive and negative numbers correctly', () => {
      expect(multiply(5, -3)).toBe(-15);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should subtract negative numbers correctly', () => {
      expect(subtract(-5, -3)).toBe(-2);
    });

    it('should subtract positive and negative numbers correctly', () => {
      expect(subtract(5, -3)).toBe(8);
    });
  });
});