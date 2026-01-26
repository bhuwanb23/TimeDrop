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

const RouteCard = () => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Pulse animation for the icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
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
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy8PrTglRdMjq7tq6dA4IArIFlgKzsW2f3plY-M7Oz-NqtdaDkkdd2qyWJ8bwPAJX1Vwlks3W429IKgfP5KGGZkxx0pVue8198Z4cuUXV62WQD9LXeWi043YKaOBM_47T1IMEOxe4OY2JuV9APpdmdQz4YbcQSCKOhl4jokxa9HUjSUJFvshuOzAzWZFBXxmK9YqNygRyZ2lrpKCWN6qy2HWXN0R8NDARWl0wq0LtgjRAPFIZYklkkna01jveO97DG30FOx_JhKtA' }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
            >
                {/* Glass Card Overlay */}
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
                                <MaterialIcons name="navigation" size={20} color="#135bec" />
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.statusText}>CURRENT NEXT STOP</Text>
                            <Text style={styles.distanceText}>1.2 miles • 8 mins ETA</Text>
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
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    imageBackground: {
        height: 180,
        width: '100%',
    },
    imageStyle: {
        resizeMode: 'cover',
    },
    glassCard: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(20px)',
    },
    contentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        position: 'relative',
    },
    pulseAnimation: {
        position: 'absolute',
        top: -8,
        left: -8,
        right: -8,
        bottom: -8,
        backgroundColor: 'rgba(19, 91, 236, 0.3)',
        borderRadius: 20,
        opacity: 0.6,
    },
    iconBackground: {
        position: 'relative',
        padding: 12,
        backgroundColor: 'rgba(19, 91, 236, 0.15)',
        borderRadius: 12,
        zIndex: 1,
    },
    textContainer: {
        gap: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    distanceText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        letterSpacing: -0.2,
    },
    startButton: {
        backgroundColor: '#135bec',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: 'rgba(19, 91, 236, 0.5)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(19, 91, 236, 0.6)',
    },
    startButtonText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});

export default RouteCard;