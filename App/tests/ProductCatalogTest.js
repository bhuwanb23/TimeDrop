import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProductCatalogScreen from '../screens/ProductCatalogScreen';

// Mock the apiService
jest.mock('../services/api', () => ({
  products: {
    getProducts: jest.fn(),
  },
}));

describe('ProductCatalogScreen', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Test Product 1',
      price: '29.99',
      image: 'https://example.com/test1.jpg',
      category: 'Electronics',
    },
    {
      id: 2,
      name: 'Test Product 2',
      price: '39.99',
      image: 'https://example.com/test2.jpg',
      category: 'Home',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    const { getByText } = render(<ProductCatalogScreen />);
    expect(getByText('Loading products...')).toBeTruthy();
  });

  it('should render products after successful API call', async () => {
    const { getProducts } = require('../services/api');

    // Mock successful API response
    getProducts.mockResolvedValue({
      data: {
        data: {
          products: mockProducts,
          total: 2,
        },
      },
    });

    const { getByText, queryByText } = render(<ProductCatalogScreen />);

    // Wait for loading to finish and products to render
    await waitFor(() => {
      expect(queryByText('Loading products...')).toBeNull();
      expect(getByText('Test Product 1')).toBeTruthy();
      expect(getByText('Test Product 2')).toBeTruthy();
    });
  });

  it('should handle API error', async () => {
    const { getProducts } = require('../services/api');

    // Mock API error
    getProducts.mockRejectedValue(new Error('Network error'));

    const { getByText, queryByText } = render(<ProductCatalogScreen />);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(queryByText('Loading products...')).toBeNull();
      expect(getByText('Network error')).toBeTruthy();
    });
  });
});