import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING } from '../styles/DesignSystem';

// Import screens
import CustomerHomeScreen from './CustomerHomeScreen';
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
const MainTabs = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Orders') {
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
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          headerShown: false,
          tabBarStyle: {
            paddingBottom: SPACING.xs,
            paddingTop: SPACING.xs,
            height: 60,
          },
        })}
      >
        <Tab.Screen name="Home" component={CustomerHomeScreen} />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

const CustomerApp = () => <MainTabs />;

export default CustomerApp;