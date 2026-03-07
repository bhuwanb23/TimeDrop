import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../utils/RootNavigation';
import apiService from '../services/api';

const LogoutButton = () => {
    const navigation = useNavigation();
    
    const handleLogout = async () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { 
                    text: 'Cancel', 
                    style: 'cancel',
                    onPress: () => console.log('Logout cancelled')
                },
                { 
                    text: 'Log Out', 
                    style: 'destructive', 
                    onPress: async () => {
                        try {
                            console.log('Driver logout initiated...');
                            
                            // Step 1: Call backend logout endpoint (optional)
                            try {
                                await apiService.auth.logout();
                                console.log('Backend logout successful');
                            } catch (apiError) {
                                if (apiError.code !== 'ERR_NETWORK') {
                                    console.error('Backend logout failed:', apiError.message);
                                }
                                // Continue with local cleanup even if backend call fails
                            }
                            
                            // Step 2: Clear all authentication data from AsyncStorage
                            await AsyncStorage.multiRemove([
                                'token',
                                'driverProfile',
                                'driverStatus',
                                'todayEarnings'
                            ]);
                            
                            console.log('Local storage cleared successfully');
                            
                            // Step 3: Reset navigation stack to Login screen
                            if (navigationRef && navigationRef.current) {
                                navigationRef.current.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    })
                                );
                                console.log('Navigation reset to Login screen successful');
                            } else {
                                // Fallback: Direct navigation
                                navigation.navigate('Login');
                                console.log('Fallback navigation to Login');
                            }
                            
                        } catch (error) {
                            console.error('Logout error:', error);
                            
                            // Final fallback: Try direct navigation
                            try {
                                navigation.navigate('Login');
                                console.log('Final fallback navigation successful');
                            } catch (navError) {
                                console.error('Final navigation attempt failed:', navError);
                                Alert.alert('Error', 'Unable to log out. Please restart the app.');
                            }
                        }
                    }
                }
            ]
        );
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#059669" />
            <Text style={styles.text}>Log Out</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#A7F3D0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#059669',
    },
});

export default LogoutButton;