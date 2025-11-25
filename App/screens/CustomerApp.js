import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import OrderCreationScreen from './OrderCreationScreen';
import SlotSelectionScreen from './SlotSelectionScreen';
import OrderConfirmationScreen from './OrderConfirmationScreen';
import OrdersScreen from './OrdersScreen';
import OrderTrackingScreen from './OrderTrackingScreen';
import ProfileScreen from './ProfileScreen';

// Import components
import NotificationCenter from '../components/NotificationCenter';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Order Stack Navigator
const OrderStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="CreateOrder" 
      component={OrderCreationScreen} 
      options={{ 
        title: 'Create Order',
        headerShown: false
      }} 
    />
    <Stack.Screen 
      name="SelectSlot" 
      component={SlotSelectionScreen} 
      options={{ 
        title: 'Select Delivery Slot',
        headerShown: false
      }} 
    />
    <Stack.Screen 
      name="OrderConfirmation" 
      component={OrderConfirmationScreen} 
      options={{ 
        title: 'Order Confirmation',
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
            
            if (route.name === 'Orders') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Create') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Track') {
              iconName = focused ? 'location' : 'location-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
          headerTitle: 'Delivery App',
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
        <Tab.Screen name="Orders" component={OrdersScreen} />
        <Tab.Screen name="Create" component={OrderStack} />
        <Tab.Screen name="Track" component={OrderTrackingScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
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
const CustomerDrawer = () => (
  <Drawer.Navigator
    initialRouteName="MainTabs"
    screenOptions={{
      headerShown: true,
      headerTitle: 'Delivery App',
      headerTintColor: '#007AFF',
    }}
  >
    <Drawer.Screen 
      name="MainTabs" 
      component={MainTabs} 
      options={{ 
        title: 'Home',
        drawerIcon: ({ focused, size }) => (
          <Icon name="home-outline" size={size} color="#007AFF" />
        ),
      }} 
    />
    <Drawer.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ 
        title: 'My Profile',
        drawerIcon: ({ focused, size }) => (
          <Icon name="person-outline" size={size} color="#007AFF" />
        ),
      }} 
    />
    <Drawer.Screen 
      name="Orders" 
      component={OrdersScreen} 
      options={{ 
        title: 'My Orders',
        drawerIcon: ({ focused, size }) => (
          <Icon name="list-outline" size={size} color="#007AFF" />
        ),
      }} 
    />
    <Drawer.Screen 
      name="Settings" 
      component={ProfileScreen} // Using ProfileScreen as placeholder
      options={{ 
        title: 'Settings',
        drawerIcon: ({ focused, size }) => (
          <Icon name="settings-outline" size={size} color="#007AFF" />
        ),
      }} 
    />
  </Drawer.Navigator>
);

export default CustomerDrawer;