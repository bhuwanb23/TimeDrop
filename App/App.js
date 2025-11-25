import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import LoginScreen from './screens/LoginScreen';
import DriverLoginScreen from './screens/DriverLoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CustomerApp from './screens/CustomerApp';
import DriverApp from './screens/DriverApp';

// Import contexts
import { CacheProvider } from './context/CacheContext';
import { OrderProvider } from './context/OrderContext';
import { DeliveryProvider } from './context/DeliveryContext';

// Import notification center
import NotificationCenter from './components/NotificationCenter';

// Import notification services
import { requestNotificationPermission, handleNotificationReceived, handleNotificationResponse } from './services/notifications';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => {
    // Request notification permissions
    requestNotificationPermission();
    
    // Set up notification listeners
    const notificationReceivedSubscription = handleNotificationReceived(notification => {
      console.log('Notification received:', notification);
    });
    
    const notificationResponseSubscription = handleNotificationResponse(response => {
      console.log('Notification response:', response);
    });
    
    // Cleanup subscriptions
    return () => {
      notificationReceivedSubscription.remove();
      notificationResponseSubscription.remove();
    };
  }, []);
  
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Delivery App</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('Home');
          props.navigation.closeDrawer();
        }}
      >
        <Icon name="home-outline" size={20} color="#007AFF" style={styles.drawerIcon} />
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('Profile');
          props.navigation.closeDrawer();
        }}
      >
        <Icon name="person-outline" size={20} color="#007AFF" style={styles.drawerIcon} />
        <Text style={styles.drawerItemText}>Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('Orders');
          props.navigation.closeDrawer();
        }}
      >
        <Icon name="list-outline" size={20} color="#007AFF" style={styles.drawerIcon} />
        <Text style={styles.drawerItemText}>My Orders</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('Settings');
          props.navigation.closeDrawer();
        }}
      >
        <Icon name="settings-outline" size={20} color="#007AFF" style={styles.drawerIcon} />
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => setShowNotifications(true)}
      >
        <Icon name="notifications-outline" size={20} color="#007AFF" style={styles.drawerIcon} />
        <Text style={styles.drawerItemText}>Notifications</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => {
          // Logout functionality would go here
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        }}
      >
        <Icon name="log-out-outline" size={20} color="#FF3B30" style={styles.drawerIcon} />
        <Text style={styles.drawerItemTextLogout}>Logout</Text>
      </TouchableOpacity>
      
      {/* Notification Center Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showNotifications}
        onRequestClose={() => setShowNotifications(false)}
      >
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      </Modal>
    </View>
  );
};

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="DriverLogin" component={DriverLoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main App Component
export default function App() {
  return (
    <CacheProvider>
      <OrderProvider>
        <DeliveryProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth" component={AuthStack} />
              <Stack.Screen name="CustomerApp" component={CustomerApp} />
              <Stack.Screen name="DriverApp" component={DriverApp} />
            </Stack.Navigator>
          </NavigationContainer>
        </DeliveryProvider>
      </OrderProvider>
    </CacheProvider>
  );
}

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerIcon: {
    marginRight: 15,
    width: 20,
    textAlign: 'center',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  drawerItemTextLogout: {
    fontSize: 16,
    color: '#FF3B30',
    flex: 1,
  },
});