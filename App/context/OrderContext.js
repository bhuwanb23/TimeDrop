import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_ORDERS: 'SET_ORDERS',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  SET_CURRENT_ORDER: 'SET_CURRENT_ORDER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case ACTIONS.ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload],
        loading: false,
      };
    case ACTIONS.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
        loading: false,
      };
    case ACTIONS.SET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const OrderContext = createContext();

// Provider component
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load orders from local storage on app start
  useEffect(() => {
    loadOrdersFromStorage();
  }, []);

  // Save orders to local storage whenever they change
  useEffect(() => {
    saveOrdersToStorage();
  }, [state.orders]);

  const loadOrdersFromStorage = async () => {
    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      if (storedOrders) {
        dispatch({ type: ACTIONS.SET_ORDERS, payload: JSON.parse(storedOrders) });
      }
    } catch (error) {
      console.error('Error loading orders from storage:', error);
    }
  };

  const saveOrdersToStorage = async () => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(state.orders));
    } catch (error) {
      console.error('Error saving orders to storage:', error);
    }
  };

  // Action creators
  const setOrders = (orders) => {
    dispatch({ type: ACTIONS.SET_ORDERS, payload: orders });
  };

  const addOrder = (order) => {
    dispatch({ type: ACTIONS.ADD_ORDER, payload: order });
  };

  const updateOrder = (order) => {
    dispatch({ type: ACTIONS.UPDATE_ORDER, payload: order });
  };

  const setCurrentOrder = (order) => {
    dispatch({ type: ACTIONS.SET_CURRENT_ORDER, payload: order });
  };

  const setLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    setOrders,
    addOrder,
    updateOrder,
    setCurrentOrder,
    setLoading,
    setError,
    clearError,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;