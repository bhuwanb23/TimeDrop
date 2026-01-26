import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EarningsCard = ({ earnings = '$142.50', percentage = '+12%' }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>Today's Total Earnings</Text>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amount}>{earnings}</Text>
                        <Text style={styles.percentage}>{percentage} from yesterday</Text>
                    </View>
                </View>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="payments" size={32} color="#FFFFFF" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#135bec',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginVertical: 16,
        shadowColor: '#135bec',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
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
        fontSize: 12,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.7)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    amount: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    percentage: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    iconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 12,
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
    },
});

export default EarningsCard;