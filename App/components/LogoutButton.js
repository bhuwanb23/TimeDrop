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
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Log Out', 
                    style: 'destructive', 
                    onPress: async () => {
                        try {
                            console.log('Driver logout pressed - clearing auth and navigating to Login');
                            
                            // Call backend logout endpoint (optional; local cleanup continues if unreachable)
                            try {
                                await apiService.auth.logout();
                            } catch (apiError) {
                                if (apiError.code !== 'ERR_NETWORK') {
                                    console.error('Backend logout failed:', apiError);
                                }
                                // Continue with local cleanup even if backend call fails
                            }
                            
                            // Clear any stored authentication tokens
                            await AsyncStorage.removeItem('token');
                            
                            // Reset navigation stack to Login screen
                            if (navigationRef && navigationRef.current) {
                                navigationRef.current.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    })
                                );
                            } else {
                                // Fallback navigation
                                navigation.navigate('Login');
                            }
                            
                            console.log('Driver navigation to Login successful');
                        } catch (error) {
                            console.error('Driver logout failed:', error);
                            
                            // Final fallback: try direct navigation
                            try {
                                navigation.navigate('Login');
                            } catch (navError) {
                                console.error('Final navigation attempt failed:', navError);
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