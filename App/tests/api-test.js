/**
 * API Service Test Utility
 * This file contains simple test functions to verify that the API service is working correctly.
 */

import apiService from '../services/api';

// Test function to verify API connectivity
export const testAPIConnectivity = async () => {
  try {
    console.log('Testing API connectivity...');
    
    // Test products endpoint
    console.log('Fetching products...');
    const productsResponse = await apiService.products.getProducts({ limit: 5 });
    console.log('✓ Products endpoint working:', productsResponse.data?.data?.products?.length || 0, 'products received');
    
    // If there are products, test getting a specific product
    if (productsResponse.data?.data?.products?.length > 0) {
      const firstProductId = productsResponse.data.data.products[0].id;
      console.log(`Fetching product with ID: ${firstProductId}`);
      const productResponse = await apiService.products.getProductById(firstProductId);
      console.log('✓ Product detail endpoint working:', productResponse.data?.data?.name);
    }
    
    console.log('✓ API Service is properly configured and connected to backend');
    return true;
  } catch (error) {
    console.error('✗ API Service test failed:', error.message);
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network error - unable to reach server');
      console.error('Make sure the backend server is running on http://localhost:3000');
    }
    return false;
  }
};

// Test authentication endpoints
export const testAuthEndpoints = async () => {
  try {
    console.log('Testing authentication endpoints...');
    
    // Try to get profile without authentication (should fail)
    try {
      await apiService.auth.getProfile();
      console.log('✗ Auth protection failed - should have required authentication');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✓ Auth protection working correctly');
      } else {
        console.log('⚠ Unexpected error during auth test:', error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Auth test error:', error.message);
    return false;
  }
};

// Run basic tests
export const runAPITests = async () => {
  console.log('=== Running API Service Tests ===');
  
  const apiTestResult = await testAPIConnectivity();
  const authTestResult = await testAuthEndpoints();
  
  if (apiTestResult) {
    console.log('\n✓ API Service is ready for use!');
    console.log('Next steps:');
    console.log('- Integrate with components to fetch dynamic data');
    console.log('- Implement user authentication flow');
    console.log('- Add order creation functionality');
  } else {
    console.log('\n✗ API Service needs configuration or backend server is not running');
    console.log('Troubleshooting:');
    console.log('- Ensure backend server is running on http://localhost:3000');
    console.log('- Check network connectivity');
    console.log('- Verify API base URL configuration');
  }
  
  return { apiTestResult, authTestResult };
};