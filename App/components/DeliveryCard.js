import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeliveryCard = ({ 
    orderNumber, 
    customerName, 
    address, 
    status, 
    isNext = false,
    isReady = false 
}) => {
    const getStatusStyle = () => {
        if (isNext) return styles.inTransitBadge;
        if (isReady) return styles.readyBadge;
        return styles.defaultBadge;
    };

    const getStatusText = () => {
        if (isNext) return 'IN TRANSIT';
        if (isReady) return 'READY';
        return 'PENDING';
    };

    return (
        <View style={[
            styles.container,
            isNext && styles.nextDeliveryBorder
        ]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    {isNext && (
                        <Text style={styles.nextDeliveryTag}>NEXT DELIVERY</Text>
                    )}
                    <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
                    <View style={styles.customerRow}>
                        <Text style={styles.customerName}>Customer: {customerName}</Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.actionButton}>
                                <MaterialIcons name="call" size={14} color="#135bec" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <MaterialIcons name="chat-bubble" size={14} color="#135bec" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={getStatusStyle()}>
                    <Text style={styles.badgeText}>{getStatusText()}</Text>
                </View>
            </View>

            {/* Address */}
            <View style={styles.addressRow}>
                <MaterialIcons name="location-on" size={16} color="#94A3B8" />
                <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    styles.updateButton,
                    isNext && styles.updateButtonActive
                ]}>
                    <Text style={[
                        styles.updateButtonText,
                        isNext && styles.updateButtonTextActive
                    ]}>
                        Update Status
                    </Text>
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
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 12,
    },
    nextDeliveryBorder: {
        borderColor: 'rgba(19, 91, 236, 0.3)',
        shadowColor: '#135bec',
        shadowOpacity: 0.1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
    },
    nextDeliveryTag: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFFFFF',
        backgroundColor: '#135bec',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 2,
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    customerName: {
        fontSize: 12,
        color: '#64748B',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 6,
        marginLeft: 4,
    },
    actionButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inTransitBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    readyBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    defaultBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#92400E',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    addressText: {
        fontSize: 14,
        color: '#475569',
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    detailsButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    updateButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    updateButtonActive: {
        backgroundColor: '#135bec',
        shadowColor: 'rgba(19, 91, 236, 0.4)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(19, 91, 236, 0.5)',
    },
    updateButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
    updateButtonTextActive: {
        color: '#FFFFFF',
    },
});

export default DeliveryCard;