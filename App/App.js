import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { navigationRef } from './utils/RootNavigation';
import { CartProvider, useCart } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import RouteScreen from './screens/RouteScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductCatalogScreen from './screens/ProductCatalogScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import CustomerProfileScreen from './screens/CustomerProfileScreen';
import CategoryScreen from './screens/CategoryScreen';
import WishlistScreen from './screens/WishlistScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import DeliveryNavigationScreen from './screens/DeliveryNavigationScreen';

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
                        iconName = 'home-outline';
                    } else if (route.name === 'Delivery') {
                        iconName = 'car-sport-outline';
                    } else if (route.name === 'Profile') {
                        iconName = 'person-outline';
                    }

                    return (
                        <Ionicons
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
    const { totalItems: cartItemCount } = useCart(); // Get cart count from context

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Categories') {
                        iconName = 'grid-outline';
                    } else if (route.name === 'Wishlist') {
                        iconName = 'heart-outline';
                    } else if (route.name === 'Cart') {
                        iconName = 'cart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = 'person-outline';
                    }

                    return (
                        <Ionicons
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
                component={CategoryScreen}
                options={{
                    tabBarLabel: 'Categories',
                }}
            />
            <Tab.Screen
                name="Orders"
                component={MyOrdersScreen}
                options={{
                    tabBarLabel: 'Orders',
                }}
            />
            <Tab.Screen
                name="Wishlist"
                component={WishlistScreen}
                options={{
                    tabBarLabel: 'Wishlist',
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarLabel: 'Cart',
                    tabBarBadge: cartItemCount > 0 ? Number(cartItemCount) : undefined,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={CustomerProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                }}
            />
        </Tab.Navigator>
    );
};

// Customer Stack Navigator to wrap tab navigator and add checkout screen
const CustomerStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="CustomerTabs" component={CustomerMainTabs} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
        </Stack.Navigator>
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
                component={CustomerStackNavigator}
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
            <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="MyOrders"
                component={MyOrdersScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="OrderDetail"
                component={OrderDetailScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="DeliveryNavigation" 
                component={DeliveryNavigationScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <ErrorBoundary>
            <CartProvider>
                <SafeAreaProvider>
                    <NavigationContainer ref={navigationRef}>
                        <RootNavigator />
                    </NavigationContainer>
                </SafeAreaProvider>
            </CartProvider>
        </ErrorBoundary>
    );
}