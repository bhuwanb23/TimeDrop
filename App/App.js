import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import RouteScreen from './screens/RouteScreen';
import ProfileScreen from './screens/ProfileScreen';
import CustomerDashboardScreen from './screens/CustomerDashboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator with Bottom Navbar
const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Delivery') {
                        iconName = 'local-shipping';
                    } else if (route.name === 'Profile') {
                        iconName = 'account-circle';
                    }

                    return (
                        <MaterialIcons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: '#1E3A8A',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0',
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                    paddingBottom: 20, // Space for device navbar
                    paddingTop: 12,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500',
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={DashboardScreen}
                options={{ 
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen 
                name="Delivery" 
                component={DeliveryScreen}
                options={{ 
                    tabBarLabel: 'Delivery',
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{ 
                    tabBarLabel: 'Profile',
                }}
            />
        </Tab.Navigator>
    );
};

// Root Navigator
const RootNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
                cardStyle: { pointerEvents: 'box-none' },
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen 
                name="MainTabs" 
                component={MainTabs}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="CustomerDashboard" 
                component={CustomerDashboardScreen}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen name="Route" component={RouteScreen} />
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}