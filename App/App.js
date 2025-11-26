import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
import { AuthProvider } from './context/AuthContext';

const Stack = createStackNavigator();

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
    <AuthProvider>
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
    </AuthProvider>
  );
}