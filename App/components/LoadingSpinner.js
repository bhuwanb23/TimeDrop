import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const LoadingSpinner = ({ size = 'large', color = '#1152d4', text = '' }) => {
    const spinValue = new Animated.Value(0);
    
    // Start spinning animation
    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        })
    ).start();

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
                <Text style={[styles.spinnerText, { color }]}>●</Text>
            </Animated.View>
            {text ? <Text style={styles.loadingText}>{text}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(246, 246, 248, 0.8)',
    },
    spinner: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerText: {
        fontSize: 32,
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
    },
});

export default LoadingSpinner;