import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StatusToggleCard = () => {
    const [isEnabled, setIsEnabled] = useState(true);
    const switchAnim = new Animated.Value(isEnabled ? 1 : 0);

    const toggleSwitch = () => {
        const newValue = !isEnabled;
        setIsEnabled(newValue);
        Animated.timing(switchAnim, {
            toValue: newValue ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const switchBackgroundColor = switchAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E2E8F0', '#1E618A'],
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Duty Status</Text>
                    <Text style={styles.subtitle}>Accepting delivery requests</Text>
                </View>
                <Switch
                    trackColor={{ false: '#E2E8F0', true: '#1E618A' }}
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