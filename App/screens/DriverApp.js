import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import DriverDashboardScreen from './DriverDashboardScreen';
import DeliveryManagementScreen from './DeliveryManagementScreen';
import RouteOptimizationScreen from './RouteOptimizationScreen';
import DriverProfileScreen from './DriverProfileScreen';

// Import components
import NotificationCenter from '../components/NotificationCenter';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
      name="DeliveryManagement" 
      component={DeliveryManagementScreen} 
      options={{ 
        title: 'Manage Deliveries',
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
const MainTabs = ({ navigation }) => {
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
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
          headerTitle: 'Driver App',
          headerTintColor: '#007AFF',
          headerRight: () => (
            <Icon 
              name="notifications-outline" 
              size={24} 
              color="#007AFF" 
              style={{ marginRight: 15 }}
              onPress={() => setShowNotifications(true)}
            />
          ),
        })}
      >
        <Tab.Screen name="Dashboard" component={DriverDashboardScreen} />
        <Tab.Screen name="Deliveries" component={DeliveryStack} />
        <Tab.Screen name="Route" component={RouteOptimizationScreen} />
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

// Drawer Navigator with Main Tabs as content
const DriverDrawer = () => (
  <Drawer.Navigator
    initialRouteName="MainTabs"
    screenOptions={{
      headerShown: true,
      headerTitle: 'Driver App',
      headerTintColor: '#007AFF',
    }}
  >
    <Drawer.Screen 
      name="MainTabs" 
      component={MainTabs} 
      options={{ 
        title: 'Dashboard',
        drawerIcon: ({ focused, size }) => (
          <Icon name="home-outline" size={size} color="#007AFF" />
        ),
      }} 
    />
    <Drawer.Screen 
      name="Profile" 
      component={DriverProfileScreen} 
      options={{ 
        title: 'My Profile',
        drawerIcon: ({ focused, size }) => (
          <Icon name="person-outline" size={size} color="#007AFF" />
        ),
      }} 
    />
    <Drawer.Screen 
      name="Deliveries" 
      component={DeliveryManagementScreen} 
      options={{ 
        title: 'Manage Deliveries',
        drawerIcon: ({ focused, size }) => (
          <Icon name="cube-outline" size={size} color="#007AFF" />
        ),
      }} 
    />
    <Drawer.Screen 
      name="Settings" 
      component={DriverProfileScreen} // Using ProfileScreen as placeholder
      options={{ 
        title: 'Settings',
        drawerIcon: ({ focused, size }) => (
          <Icon name="settings-outline" size={size} color="#007AFF" />
        ),
      }} 
    />
  </Drawer.Navigator>
);

export default DriverDrawer;