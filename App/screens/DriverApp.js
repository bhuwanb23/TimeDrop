import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '../styles/DesignSystem';

// Import screens
import DriverDashboardScreen from './DriverDashboardScreen';
import RouteOptimizationScreen from './RouteOptimizationScreen';
import DriverProfileScreen from './DriverProfileScreen';

// Import components
import NotificationCenter from '../components/NotificationCenter';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// Delivery Stack Navigator
const DeliveryStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Dashboard" 
      component={DriverDashboardScreen} 
      options={{ 
        title: 'Dashboard',
        headerShown: false
      }} 
    />
    <Stack.Screen 
      name="RouteOptimization" 
      component={RouteOptimizationScreen} 
      options={{ 
        title: 'Optimize Route',
        headerShown: false
      }} 
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            if (route.name === 'Dashboard') {
              iconName = focused ? 'speedometer' : 'speedometer-outline';
            } else if (route.name === 'Deliveries') {
              iconName = focused ? 'cube' : 'cube-outline';
            } else if (route.name === 'Route') {
              iconName = focused ? 'navigate' : 'navigate-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          headerShown: true,
          headerTitle: 'Driver App',
          headerTitleStyle: {
            fontWeight: TYPOGRAPHY.bold,
            fontSize: TYPOGRAPHY.h3,
          },
          headerTintColor: COLORS.primary,
          headerRight: () => (
            <Icon 
              name="notifications-outline" 
              size={24} 
              color={COLORS.primary} 
              style={{ marginRight: 15 }}
              onPress={() => setShowNotifications(true)}
            />
          ),
        })}
      >
        <Tab.Screen name="Dashboard" component={DriverDashboardScreen} />
        <Tab.Screen name="Route" component={DeliveryStack} />
        <Tab.Screen name="Profile" component={DriverProfileScreen} />
      </Tab.Navigator>
      
      {/* Notification Center Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showNotifications}
        onRequestClose={() => setShowNotifications(false)}
      >
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      </Modal>
    </>
  );
};

const DriverApp = () => <MainTabs />;

export default DriverApp;