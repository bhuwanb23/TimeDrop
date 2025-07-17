const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: { LOGIN: '/api/auth/login', REGISTER: '/api/auth/register', LOGOUT: '/api/auth/logout' },
  PRODUCTS: { LIST: '/api/products', DETAIL: (id) => '/api/products/' + id },
  ORDERS: { LIST: '/api/orders', CREATE: '/api/orders' },
  CART: { GET: '/api/cart', ADD: '/api/cart/items' },
  DELIVERIES: { LIST: '/api/deliveries' },
};

export default BASE_URL;