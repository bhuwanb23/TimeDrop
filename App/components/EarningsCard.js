import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EarningsCard = () => {
    const [earnings, setEarnings] = useState('$0.00');
    const [percentage, setPercentage] = useState('+0%');

    useEffect(() => {
        loadEarnings();
    }, []);

    const loadEarnings = async () => {
        try {
            // In a real app, fetch from backend
            // const response = await apiService.drivers.getTodayEarnings();
            
            // For now, use mock data with some variation
            const savedEarnings = await AsyncStorage.getItem('todayEarnings');
            if (savedEarnings) {
                setEarnings(savedEarnings);
            } else {
                // Generate random earnings between $100-$200
                const randomEarnings = (Math.random() * 100 + 100).toFixed(2);
                const earningsStr = `$${randomEarnings}`;
                setEarnings(earningsStr);
                await AsyncStorage.setItem('todayEarnings', earningsStr);
                
                // Random percentage change
                const randomPercent = Math.floor(Math.random() * 20);
                setPercentage(`+${randomPercent}%`);
            }
        } catch (error) {
            console.error('Error loading earnings:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>Today's Earnings</Text>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amount}>{earnings}</Text>
                        <Text style={styles.percentage}>{percentage}</Text>
                    </View>
                </View>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="payments" size={24} color="#FFFFFF" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#10B981',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 12,
        marginVertical: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.8)',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        marginBottom: 4,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    amount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    percentage: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    iconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 10,
        borderRadius: 10,
    },
});

export default EarningsCard;