import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  cache: {},
  loading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_CACHE: 'SET_CACHE',
  ADD_TO_CACHE: 'ADD_TO_CACHE',
  REMOVE_FROM_CACHE: 'REMOVE_FROM_CACHE',
  CLEAR_CACHE: 'CLEAR_CACHE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const cacheReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CACHE:
      return {
        ...state,
        cache: action.payload,
        loading: false,
      };
    case ACTIONS.ADD_TO_CACHE:
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.payload.key]: {
            data: action.payload.data,
            timestamp: Date.now(),
            ttl: action.payload.ttl || 300000, // Default 5 minutes
          },
        },
        loading: false,
      };
    case ACTIONS.REMOVE_FROM_CACHE:
      const newCache = { ...state.cache };
      delete newCache[action.payload];
      return {
        ...state,
        cache: newCache,
        loading: false,
      };
    case ACTIONS.CLEAR_CACHE:
      return {
        ...state,
        cache: {},
        loading: false,
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
const CacheContext = createContext();

// Provider component
export const CacheProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cacheReducer, initialState);

  // Load cache from local storage on app start
  useEffect(() => {
    loadCacheFromStorage();
  }, []);

  // Save cache to local storage whenever it changes
  useEffect(() => {
    saveCacheToStorage();
  }, [state.cache]);

  // Periodically clean up expired cache entries
  useEffect(() => {
    const interval = setInterval(() => {
      cleanExpiredCache();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const loadCacheFromStorage = async () => {
    try {
      const storedCache = await AsyncStorage.getItem('app_cache');
      if (storedCache) {
        dispatch({ type: ACTIONS.SET_CACHE, payload: JSON.parse(storedCache) });
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  };

  const saveCacheToStorage = async () => {
    try {
      await AsyncStorage.setItem('app_cache', JSON.stringify(state.cache));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  };

  const cleanExpiredCache = () => {
    const now = Date.now();
    const newCache = { ...state.cache };
    let cleaned = false;

    for (const key in newCache) {
      const entry = newCache[key];
      if (entry.timestamp + entry.ttl < now) {
        delete newCache[key];
        cleaned = true;
      }
    }

    if (cleaned) {
      dispatch({ type: ACTIONS.SET_CACHE, payload: newCache });
    }
  };

  // Action creators
  const setCache = (cache) => {
    dispatch({ type: ACTIONS.SET_CACHE, payload: cache });
  };

  const addToCache = (key, data, ttl) => {
    dispatch({ type: ACTIONS.ADD_TO_CACHE, payload: { key, data, ttl } });
  };

  const removeFromCache = (key) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CACHE, payload: key });
  };

  const clearCache = () => {
    dispatch({ type: ACTIONS.CLEAR_CACHE });
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

  // Helper function to get data from cache
  const getFromCache = (key) => {
    const entry = state.cache[key];
    if (!entry) return null;

    const now = Date.now();
    if (entry.timestamp + entry.ttl < now) {
      // Entry expired, remove it
      removeFromCache(key);
      return null;
    }

    return entry.data;
  };

  // Context value
  const value = {
    ...state,
    setCache,
    addToCache,
    removeFromCache,
    clearCache,
    getFromCache,
    setLoading,
    setError,
    clearError,
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};

// Custom hook to use the cache context
export const useCache = () => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

export default CacheContext;