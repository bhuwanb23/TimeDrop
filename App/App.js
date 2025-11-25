import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import DriverProfileScreen from './screens/DriverProfileScreen';
import RouteOptimizationScreen from './screens/RouteOptimizationScreen';

// Import providers
import { OrderProvider } from './context/OrderContext';
import { DeliveryProvider } from './context/DeliveryContext';
import { CacheProvider } from './context/CacheContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content Component
function CustomDrawerContent({ navigation, state }) {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Delivery App</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Orders')}
      >
        <Text style={styles.drawerItemText}>My Orders</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.drawerItemText}>Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Notifications')}
      >
        <Text style={styles.drawerItemText}>Notifications</Text>
      </TouchableOpacity>
      
      <View style={styles.drawerSeparator} />
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Help')}
      >
        <Text style={styles.drawerItemText}>Help & Support</Text>
      </TouchableOpacity>
    </View>
  );
}

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
      <Tab.Screen name="Route" component={RouteOptimizationScreen} />
      <Tab.Screen name="Profile" component={DriverProfileScreen} />
    </Tab.Navigator>
  );
}

function CustomerAppWithDrawer() {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 240,
        },
        drawerActiveBackgroundColor: '#007AFF',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={CustomerApp}
        options={{ 
          drawerLabel: 'Home',
          title: 'Delivery App'
        }} 
      />
    </Drawer.Navigator>
  );
}

function DriverAppWithDrawer() {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 240,
        },
        drawerActiveBackgroundColor: '#007AFF',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={DriverApp}
        options={{ 
          drawerLabel: 'Dashboard',
          title: 'Driver App'
        }} 
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <CacheProvider>
      <OrderProvider>
        <DeliveryProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="DriverLogin" component={DriverLoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="CustomerApp" component={CustomerAppWithDrawer} options={{ headerShown: false }} />
              <Stack.Screen name="DriverApp" component={DriverAppWithDrawer} options={{ headerShown: false }} />
              <Stack.Screen name="OrderCreation" component={OrderCreationScreen} />
              <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
              <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
              <Stack.Screen name="SlotSelection" component={SlotSelectionScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </DeliveryProvider>
      </OrderProvider>
    </CacheProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  drawerHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  drawerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
  drawerSeparator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
});