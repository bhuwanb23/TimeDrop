import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeliveredCard = ({ 
    orderNumber, 
    customerName, 
    address, 
    earnings, 
    deliveryTime 
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <MaterialIcons name="check-circle" size={18} color="#10B981" />
                    <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
                </View>
                <View style={styles.earningsContainer}>
                    <Text style={styles.earnings}>+{earnings}</Text>
                    <Text style={styles.deliveryTime}>Delivered {deliveryTime}</Text>
                </View>
            </View>
            
            <View style={styles.customerInfo}>
                <Text style={styles.customerLabel}>Customer: {customerName}</Text>
            </View>
            
            <View style={styles.addressContainer}>
                <MaterialIcons name="location-on" size={16} color="#94A3B8" />
                <Text style={styles.address} numberOfLines={1}>{address}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.receiptButton}>
                    <Text style={styles.receiptButtonText}>View Receipt</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
    },
    earningsContainer: {
        alignItems: 'flex-end',
    },
    earnings: {
        fontSize: 16,
        fontWeight: '700',
        color: '#135bec',
        marginBottom: 2,
    },
    deliveryTime: {
        fontSize: 10,
        fontWeight: '600',
        color: '#94A3B8',
    },
    customerInfo: {
        marginBottom: 12,
    },
    customerLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    address: {
        fontSize: 14,
        color: '#64748B',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    receiptButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    receiptButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
});

export default DeliveredCard;