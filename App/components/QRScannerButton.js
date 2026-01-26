import React, { useRef } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const QRScannerButton = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0.1,
                    duration: 100,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 100,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    };

    return (
        <TouchableOpacity 
            style={styles.button}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Animated.View 
                style={[
                    styles.iconContainer,
                    {
                        transform: [
                            { scale: scaleAnim },
                            { rotate: rotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '5deg']
                            })}
                        ]
                    }
                ]}
            >
                <MaterialIcons name="qr-code-scanner" size={28} color="#FFFFFF" />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 64,
        height: 64,
        backgroundColor: '#135bec',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    iconContainer: {
        // Transform will be applied here
    },
});

export default QRScannerButton;