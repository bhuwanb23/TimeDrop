import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Animated, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatusToggleCard = () => {
    const [isEnabled, setIsEnabled] = useState(true);
    const switchAnim = new Animated.Value(isEnabled ? 1 : 0);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const savedStatus = await AsyncStorage.getItem('driverStatus');
            if (savedStatus !== null) {
                const status = savedStatus === 'true';
                setIsEnabled(status);
                switchAnim.setValue(status ? 1 : 0);
            }
        } catch (error) {
            console.error('Error loading status:', error);
        }
    };

    const toggleSwitch = () => {
        const newValue = !isEnabled;
        setIsEnabled(newValue);
        Animated.timing(switchAnim, {
            toValue: newValue ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();

        // Save status
        saveStatus(newValue);
        
        // Show feedback
        Alert.alert(
            'Status Updated',
            newValue ? 'You are now accepting delivery requests' : 'You are now offline',
            [{ text: 'OK' }]
        );
    };

    const saveStatus = async (status) => {
        try {
            await AsyncStorage.setItem('driverStatus', status.toString());
            // In a real app, you would also update the backend
            // await apiService.drivers.updateStatus(status);
        } catch (error) {
            console.error('Error saving status:', error);
        }
    };

    const switchBackgroundColor = switchAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E2E8F0', '#10B981'],
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Duty Status</Text>
                    <Text style={styles.subtitle}>
                        {isEnabled ? 'Accepting delivery requests' : 'Currently offline'}
                    </Text>
                </View>
                <Switch
                    trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                    thumbColor={'#FFFFFF'}
                    ios_backgroundColor="#E2E8F0"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    style={styles.switch}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    switch: {
        transform: [{ scale: 1.2 }],
    },
});

export default StatusToggleCard;