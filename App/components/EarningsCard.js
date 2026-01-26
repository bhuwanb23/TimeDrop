import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';

const EarningsCard = () => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>WEEKLY EARNINGS</Text>
                    <Animated.Text style={[styles.amount, { transform: [{ scale: pulseAnim }] }]}>
                        $1,240.50
                    </Animated.Text>
                </View>
                <View style={styles.chartContainer}>
                    <Svg height="48" width="96" viewBox="0 0 100 40">
                        <Path
                            d="M0,35 Q10,10 20,25 T40,15 T60,30 T80,10 T100,20"
                            fill="none"
                            stroke="#1E618A"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </Svg>
                </View>
            </View>
            <View style={styles.footer}>
                <Text style={styles.linkText}>View detailed history</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#1E618A" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748B',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    amount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1E293B',
        lineHeight: 36,
    },
    chartContainer: {
        width: 96,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    linkText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E618A',
    },
});

export default EarningsCard;