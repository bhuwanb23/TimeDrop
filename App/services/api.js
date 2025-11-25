import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://192.168.31.67:3000/api', // Replace with your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      // Server responded with a status code that falls out of the range of 2xx
      console.error('API Error Response:', error.response.status, error.response.data);
      
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - token might be invalid, clear it
          AsyncStorage.removeItem('authToken');
          // You might want to redirect to login screen here
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Internal server error
          console.error('Internal server error');
          break;
        default:
          console.error('Unknown API error');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Customer login
  customerLogin: (phone, password) => 
    api.post('/customers/login', { phone, password }),
  
  // Driver login
  driverLogin: (phone, password) => 
    api.post('/drivers/login', { phone, password }),
};

// Customer API calls
export const customerAPI = {
  // Get customer orders
  getOrders: (phone) => 
    api.get(`/customers/orders?phone=${phone}`),
  
  // Create new order
  createOrder: (orderData) => 
    api.post('/orders/new', orderData),
  
  // Select delivery slot
  selectSlot: (orderId, slotData) => 
    api.put(`/orders/${orderId}/select-slot`, slotData),
};

// Driver API calls
export const driverAPI = {
  // Get driver deliveries
  getDeliveries: (driverId) => 
    api.get(`/drivers/${driverId}/deliveries`),
  
  // Update driver location
  updateLocation: (driverId, locationData) => 
    api.put(`/drivers/${driverId}/update-location`, locationData),
  
  // Update order status
  updateOrderStatus: (driverId, orderId, status) => 
    api.put(`/drivers/${driverId}/orders/${orderId}/status`, { status }),
};

// Utility functions
export const setAuthToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const clearAuthToken = async () => {
  await AsyncStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
};

export const getAuthToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export default api;