import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { navigationRef } from './utils/RootNavigation';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import RouteScreen from './screens/RouteScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductCatalogScreen from './screens/ProductCatalogScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';

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

// Customer Main Tab Navigator with Bottom Navbar
const CustomerMainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Categories') {
                        iconName = 'grid-view';
                    } else if (route.name === 'Wishlist') {
                        iconName = 'favorite';
                    } else if (route.name === 'Cart') {
                        iconName = 'shopping-cart';
                    } else if (route.name === 'Profile') {
                        iconName = 'person';
                    }

                    return (
                        <MaterialIcons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: '#1152d4',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0',
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 10,
                    paddingBottom: 20, // Safe area inset
                    paddingTop: 12,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={ProductCatalogScreen}
                options={{ 
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen 
                name="Categories" 
                component={ProductCatalogScreen} // Placeholder - will create actual category screen later
                options={{ 
                    tabBarLabel: 'Categories',
                }}
            />
            <Tab.Screen 
                name="Wishlist" 
                component={ProductCatalogScreen} // Placeholder - will create actual wishlist screen later
                options={{ 
                    tabBarLabel: 'Wishlist',
                }}
            />
            <Tab.Screen 
                name="Cart" 
                component={ProductCatalogScreen} // Placeholder - will create actual cart screen later
                options={{ 
                    tabBarLabel: 'Cart',
                    tabBarBadge: 2, // Example badge
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProductCatalogScreen} // Placeholder - will create actual profile screen later
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
                name="CustomerMainTabs" 
                component={CustomerMainTabs}
                options={{ 
                    headerShown: false,
                }}
            />
            <Stack.Screen name="Route" component={RouteScreen} />
            <Stack.Screen 
                name="ProductDetail" 
                component={ProductDetailScreen}
                options={{ 
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
                <RootNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}