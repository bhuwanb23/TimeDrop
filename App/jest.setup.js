import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  
  const MockMapView = (props) => <View {...props} />;
  const MockMarker = (props) => <View {...props} />;
  const MockPolyline = (props) => <View {...props} />;
  
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Polyline: MockPolyline,
  };
});

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 12.9716,
      longitude: 77.5946,
      accuracy: 5,
    },
    timestamp: Date.now(),
  }),
  reverseGeocodeAsync: jest.fn().mockResolvedValue([
    {
      name: 'Test Location',
      street: 'Main Street',
      city: 'Bangalore',
      region: 'Karnataka',
      country: 'India',
      postalCode: '560001',
    }
  ]),
  geocodeAsync: jest.fn().mockResolvedValue([
    {
      latitude: 12.9716,
      longitude: 77.5946,
    }
  ]),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'ExponentPushToken[test-token]' }),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return (props) => <View {...props} />;
});

// Mock navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock navigation containers
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
  }),
}));

jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
  }),
}));

// Suppress console errors in tests
console.error = jest.fn();
console.warn = jest.fn();