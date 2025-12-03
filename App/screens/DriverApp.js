import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Modal, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/DesignSystem';
import { useAuth } from '../context/AuthContext';

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
  const { session } = useAuth();
  const driverProfile = session?.type === 'driver' ? session.profile : null;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            if (route.name === 'Dashboard') {
              iconName = focused ? 'speedometer' : 'speedometer-outline';
            } else if (route.name === 'Route') {
              iconName = focused ? 'navigate' : 'navigate-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          headerShown: false,
          tabBarStyle: {
            paddingBottom: SPACING.xs,
            paddingTop: SPACING.xs,
            height: 60,
            backgroundColor: COLORS.cardBackground,
            borderTopWidth: 1,
            borderTopColor: COLORS.grayLight,
          },
          tabBarLabelStyle: {
            fontSize: TYPOGRAPHY.caption,
            fontWeight: TYPOGRAPHY.medium,
          },
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DriverDashboardScreen} 
          options={{ 
            title: 'Dashboard',
          }} 
        />
        <Tab.Screen 
          name="Route" 
          component={DeliveryStack} 
          options={{ 
            title: 'Route',
          }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={DriverProfileScreen} 
          options={{ 
            title: 'Profile',
          }} 
        />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

const DriverApp = () => <MainTabs />;

export default DriverApp;