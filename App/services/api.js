import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API configuration
// For development, use your machine's IP address or 'localhost' depending on your setup
// For Android emulator, 10.0.2.2 usually refers to host machine's localhost
// For iOS simulator, localhost typically works
const getBaseUrl = () => {
  // For Android emulator, use 10.0.2.2 to reach host machine's localhost
  // For iOS simulator, use localhost
  // This assumes you're using Expo DevTools which sets Platform.OS
  const platform = typeof navigator !== 'undefined' ? 'web' : 'native';
  if (__DEV__) {
    // In development, you may need to change this depending on your target device
    // Use 'http://10.0.2.2:3000/api' for Android emulator
    // Use 'http://localhost:3000/api' for iOS simulator
    return 'http://localhost:3000/api'; // Change this as needed for your environment
  }
  return 'https://your-production-api.com/api';
};

// Simple in-memory cache for optimization
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with caching and error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle specific error responses
    if (error.response?.status === 401) {
      // Token might be expired or invalid, clear it
      await AsyncStorage.removeItem('token');
      // Optionally redirect to login screen
    }
    
    // Return error for handling in components
    return Promise.reject(error);
  }
);

// Cache helper functions
const generateCacheKey = (url, params = {}) => {
  const sortedParams = Object.keys(params).sort().reduce((obj, key) => {
    obj[key] = params[key];
    return obj;
  }, {});
  return `${url}_${JSON.stringify(sortedParams)}`;
};

const getCachedData = (key) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Clear expired cache entries
const cleanCache = () => {
  const now = Date.now();
  for (const [key, value] of apiCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      apiCache.delete(key);
    }
  }
};

// Clean cache periodically
setInterval(cleanCache, 60000); // Clean every minute

// AUTHENTICATION ENDPOINTS
const authAPI = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  
  getProfile: async () => {
    return api.get('/auth/profile');
  },
  
  updateProfile: async (profileData) => {
    return api.put('/auth/profile', profileData);
  },
  
  logout: async () => {
    return api.post('/auth/logout');
  }
};

// PRODUCT ENDPOINTS with caching
const productAPI = {
  getProducts: async (params = {}) => {
    const cacheKey = generateCacheKey('/products', params);
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return { data: cachedData, fromCache: true };
    }
    
    const response = await api.get('/products', { params });
    setCachedData(cacheKey, response.data);
    return response;
  },
  
  getProductById: async (id) => {
    const cacheKey = generateCacheKey(`/products/${id}`);
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      return { data: cachedData, fromCache: true };
    }
    
    const response = await api.get(`/products/${id}`);
    setCachedData(cacheKey, response.data);
    return response;
  },
  
  // Clear product cache when needed
  clearProductCache: () => {
    for (const key of apiCache.keys()) {
      if (key.startsWith('/products')) {
        apiCache.delete(key);
      }
    }
  }
};

// ORDER ENDPOINTS
const orderAPI = {
  getOrders: async (params = {}) => {
    return api.get('/orders', { params });
  },
  
  getOrderById: async (id) => {
    return api.get(`/orders/${id}`);
  },
  
  createOrder: async (orderData) => {
    return api.post('/orders', orderData);
  },
  
  updateOrderStatus: async (id, status) => {
    return api.put(`/orders/${id}/status`, { status });
  }
};

// COMBINED API SERVICE
const apiService = {
  auth: authAPI,
  products: productAPI,
  orders: orderAPI,
  
  // Utility function to set token
  setAuthToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      await AsyncStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },
  
  // Utility function to get token
  getAuthToken: async () => {
    return await AsyncStorage.getItem('token');
  }
};

export default apiService;