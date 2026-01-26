import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RouteCard = () => {
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
                            <View style={styles.pulseAnimation}>
                                <View style={styles.iconBackground}>
                                    <MaterialIcons name="navigation" size={20} color="#135bec" />
                                </View>
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.statusText}>CURRENT NEXT STOP</Text>
                            <Text style={styles.distanceText}>1.2 miles • 8 mins ETA</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start</Text>
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
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    imageBackground: {
        height: 176,
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
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
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
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        backgroundColor: 'rgba(19, 91, 236, 0.2)',
        borderRadius: 12,
        opacity: 0.4,
    },
    iconBackground: {
        position: 'relative',
        padding: 8,
        backgroundColor: 'rgba(19, 91, 236, 0.1)',
        borderRadius: 8,
    },
    textContainer: {
        gap: 2,
    },
    statusText: {
        fontSize: 10,
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
        backgroundColor: '#135bec',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        shadowColor: 'rgba(19, 91, 236, 0.4)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(19, 91, 236, 0.5)',
    },
    startButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default RouteCard;