import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Animated,
    Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RouteCard = ({ navigation }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Simplified pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleStartPress = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
        
        if (navigation) {
            navigation.navigate('Route');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80' }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
            >
                <View style={styles.glassCard}>
                    <View style={styles.contentLeft}>
                        <View style={styles.iconContainer}>
                            <Animated.View 
                                style={[
                                    styles.pulseAnimation,
                                    { transform: [{ scale: pulseAnim }] }
                                ]}
                            />
                            <View style={styles.iconBackground}>
                                <MaterialIcons name="navigation" size={16} color="#059669" />
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.statusText}>NEXT STOP</Text>
                            <Text style={styles.distanceText}>1.2 mi • 8 min</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.startButton}
                        onPress={handleStartPress}
                        activeOpacity={0.8}
                    >
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <Text style={styles.startButtonText}>Start</Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        marginVertical: 12,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    imageBackground: {
        height: 140,
        width: '100%',
    },
    imageStyle: {
        resizeMode: 'cover',
    },
    glassCard: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    contentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        position: 'relative',
    },
    pulseAnimation: {
        position: 'absolute',
        top: -6,
        left: -6,
        right: -6,
        bottom: -6,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderRadius: 16,
        opacity: 0.6,
    },
    iconBackground: {
        position: 'relative',
        padding: 10,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderRadius: 10,
        zIndex: 1,
    },
    textContainer: {
        gap: 2,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    distanceText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    startButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.6)',
    },
    startButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default RouteCard;