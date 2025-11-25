import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  deliveries: [],
  currentDelivery: null,
  trackingEnabled: false,
  loading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_DELIVERIES: 'SET_DELIVERIES',
  ADD_DELIVERY: 'ADD_DELIVERY',
  UPDATE_DELIVERY: 'UPDATE_DELIVERY',
  SET_CURRENT_DELIVERY: 'SET_CURRENT_DELIVERY',
  SET_TRACKING_ENABLED: 'SET_TRACKING_ENABLED',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const deliveryReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_DELIVERIES:
      return {
        ...state,
        deliveries: action.payload,
        loading: false,
      };
    case ACTIONS.ADD_DELIVERY:
      return {
        ...state,
        deliveries: [...state.deliveries, action.payload],
        loading: false,
      };
    case ACTIONS.UPDATE_DELIVERY:
      return {
        ...state,
        deliveries: state.deliveries.map(delivery =>
          delivery.id === action.payload.id ? action.payload : delivery
        ),
        loading: false,
      };
    case ACTIONS.SET_CURRENT_DELIVERY:
      return {
        ...state,
        currentDelivery: action.payload,
      };
    case ACTIONS.SET_TRACKING_ENABLED:
      return {
        ...state,
        trackingEnabled: action.payload,
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
const DeliveryContext = createContext();

// Provider component
export const DeliveryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(deliveryReducer, initialState);

  // Load deliveries from local storage on app start
  useEffect(() => {
    loadDeliveriesFromStorage();
  }, []);

  // Save deliveries to local storage whenever they change
  useEffect(() => {
    saveDeliveriesToStorage();
  }, [state.deliveries]);

  const loadDeliveriesFromStorage = async () => {
    try {
      const storedDeliveries = await AsyncStorage.getItem('deliveries');
      if (storedDeliveries) {
        dispatch({ type: ACTIONS.SET_DELIVERIES, payload: JSON.parse(storedDeliveries) });
      }
    } catch (error) {
      console.error('Error loading deliveries from storage:', error);
    }
  };

  const saveDeliveriesToStorage = async () => {
    try {
      await AsyncStorage.setItem('deliveries', JSON.stringify(state.deliveries));
    } catch (error) {
      console.error('Error saving deliveries to storage:', error);
    }
  };

  // Action creators
  const setDeliveries = (deliveries) => {
    dispatch({ type: ACTIONS.SET_DELIVERIES, payload: deliveries });
  };

  const addDelivery = (delivery) => {
    dispatch({ type: ACTIONS.ADD_DELIVERY, payload: delivery });
  };

  const updateDelivery = (delivery) => {
    dispatch({ type: ACTIONS.UPDATE_DELIVERY, payload: delivery });
  };

  const setCurrentDelivery = (delivery) => {
    dispatch({ type: ACTIONS.SET_CURRENT_DELIVERY, payload: delivery });
  };

  const setTrackingEnabled = (enabled) => {
    dispatch({ type: ACTIONS.SET_TRACKING_ENABLED, payload: enabled });
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
    setDeliveries,
    addDelivery,
    updateDelivery,
    setCurrentDelivery,
    setTrackingEnabled,
    setLoading,
    setError,
    clearError,
  };

  return (
    <DeliveryContext.Provider value={value}>
      {children}
    </DeliveryContext.Provider>
  );
};

// Custom hook to use the delivery context
export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};

export default DeliveryContext;