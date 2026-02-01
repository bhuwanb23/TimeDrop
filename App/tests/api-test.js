import apiService from '../services/api';

// Simple test to verify API connectivity
const testAPIConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test fetching products
    const response = await apiService.products.getProducts({ limit: 5 });
    console.log('API Connection Successful!');
    console.log('Sample response data:', response.data?.data?.products?.slice(0, 2));
    
    return true;
  } catch (error) {
    console.error('API Connection Failed:', error.message);
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error: No response received');
      console.error('Make sure the backend server is running on http://localhost:3000');
    }
    return false;
  }
};

// Run the test
testAPIConnection();

export default testAPIConnection;