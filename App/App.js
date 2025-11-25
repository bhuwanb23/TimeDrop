import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CustomerHomeScreen from './screens/CustomerHomeScreen';
import OrderCreationScreen from './screens/OrderCreationScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import SlotSelectionScreen from './screens/SlotSelectionScreen';
import DriverLoginScreen from './screens/DriverLoginScreen';
import DriverDashboardScreen from './screens/DriverDashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrdersScreen from './screens/OrdersScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CustomerApp() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={CustomerHomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function DriverApp() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DriverDashboardScreen} />
      <Tab.Screen name="Deliveries" component={DriverDashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DriverLogin" component={DriverLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CustomerApp" component={CustomerApp} options={{ headerShown: false }} />
        <Stack.Screen name="DriverApp" component={DriverApp} options={{ headerShown: false }} />
        <Stack.Screen name="OrderCreation" component={OrderCreationScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="SlotSelection" component={SlotSelectionScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});