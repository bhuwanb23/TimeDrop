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
                    <MaterialIcons name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.orderNumber}>#{orderNumber}</Text>
                </View>
                <View style={styles.earningsContainer}>
                    <Text style={styles.earnings}>+{earnings}</Text>
                    <Text style={styles.deliveryTime}>{deliveryTime}</Text>
                </View>
            </View>
            
            <View style={styles.customerInfo}>
                <Text style={styles.customerLabel}>{customerName}</Text>
            </View>
            
            <View style={styles.addressContainer}>
                <MaterialIcons name="location-on" size={14} color="#94A3B8" />
                <Text style={styles.address} numberOfLines={1}>{address}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.receiptButton}>
                    <Text style={styles.receiptButtonText}>Receipt</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 14,
        marginHorizontal: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    orderNumber: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
    },
    earningsContainer: {
        alignItems: 'flex-end',
    },
    earnings: {
        fontSize: 15,
        fontWeight: '600',
        color: '#135bec',
        marginBottom: 2,
    },
    deliveryTime: {
        fontSize: 10,
        fontWeight: '500',
        color: '#94A3B8',
    },
    customerInfo: {
        marginBottom: 10,
    },
    customerLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 14,
    },
    address: {
        fontSize: 13,
        color: '#64748B',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    receiptButton: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    receiptButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },
});

export default DeliveredCard;