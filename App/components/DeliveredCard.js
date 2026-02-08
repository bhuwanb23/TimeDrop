import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeliveredCard = ({ 
    orderNumber, 
    customerName, 
    address, 
    earnings, 
    deliveryTime,
    onPressDetails
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <MaterialIcons name="check-circle" size={14} color="#10B981" />
                    <Text style={styles.orderNumber}>#{orderNumber}</Text>
                </View>
                <View style={styles.earningsContainer}>
                    <Text style={styles.earnings}>+{earnings}</Text>
                    <Text style={styles.deliveryTime}>{deliveryTime}</Text>
                </View>
            </View>
            
            <View style={styles.customerInfo}>
                <Text style={styles.customerLabel} numberOfLines={1}>{customerName}</Text>
            </View>
            
            <View style={styles.addressContainer}>
                <MaterialIcons name="location-on" size={12} color="#94A3B8" />
                <Text style={styles.address} numberOfLines={1}>{address}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.receiptButton}
                    onPress={onPressDetails}
                >
                    <Text style={styles.receiptButtonText}>Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    orderNumber: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000000',
    },
    earningsContainer: {
        alignItems: 'flex-end',
    },
    earnings: {
        fontSize: 13,
        fontWeight: '600',
        color: '#135bec',
        marginBottom: 2,
    },
    deliveryTime: {
        fontSize: 9,
        fontWeight: '500',
        color: '#94A3B8',
    },
    customerInfo: {
        marginBottom: 8,
    },
    customerLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    address: {
        fontSize: 11,
        color: '#64748B',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 4,
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
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },
});

export default DeliveredCard;