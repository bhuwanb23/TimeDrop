import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RouteHeader from '../components/RouteHeader';

const RouteScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [deliveries, setDeliveries] = useState([
        {
            id: 1,
            orderNumber: 'ORD-98210',
            customerName: 'John Doe',
            address: '123 Main St, San Francisco, CA',
            coordinates: { latitude: 37.7749, longitude: -122.4194 },
            status: 'in_transit',
            priority: 'high',
            phone: '(555) 123-4567',
            items: ['Wireless Bluetooth Headphones', 'Smart Watch Series 7'],
            totalAmount: '$479.98',
            estimatedTime: '2:15 PM',
            distance: '2.3 km'
        },
        {
            id: 2,
            orderNumber: 'ORD-98215',
            customerName: 'Jane Smith',
            address: '789 Oak Rd, San Francisco, CA',
            coordinates: { latitude: 37.7849, longitude: -122.4094 },
            status: 'in_transit',
            priority: 'normal',
            phone: '(555) 234-5678',
            items: ['Minimalist Desk Lamp'],
            totalAmount: '$89.99',
            estimatedTime: '3:00 PM',
            distance: '3.8 km'
        },
        {
            id: 3,
            orderNumber: 'ORD-98220',
            customerName: 'Bob Wilson',
            address: '555 Pine St, San Francisco, CA',
            coordinates: { latitude: 37.7649, longitude: -122.4294 },
            status: 'assigned',
            priority: 'low',
            phone: '(555) 345-6789',
            items: ['Premium Yoga Mat', 'Resistance Bands Set'],
            totalAmount: '$124.50',
            estimatedTime: '3:45 PM',
            distance: '5.1 km'
        }
    ]);
    const [error, setError] = useState(null);

    const handleCallCustomer = (customerName, phone) => {
        console.log(`Calling ${customerName} at ${phone}`);
        // In a real app, this would initiate a phone call
    };

    const handleNavigate = (delivery) => {
        console.log('Navigating to:', delivery.address);
        // In a real app, this would open maps navigation
    };

    const renderDeliveryCard = (delivery, index) => (
        <TouchableOpacity key={delivery.id} style={styles.deliveryCard}>
            {/* Order Number Badge */}
            <View style={[
                styles.orderBadge,
                index === 0 && styles.orderBadgeActive
            ]}>
                <Text style={[
                    styles.orderBadgeText,
                    index === 0 && styles.orderBadgeTextActive
                ]}>
                    {index + 1}
                </Text>
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
                {/* Customer Header */}
                <View style={styles.customerHeader}>
                    <View style={styles.customerInfo}>
                        <View style={styles.avatarContainer}>
                            <Ionicons 
                                name="person-circle" 
                                size={40} 
                                color={index === 0 ? '#1152d4' : '#94a3b8'} 
                            />
                        </View>
                        <View style={styles.customerDetails}>
                            <Text style={styles.customerName}>{delivery.customerName}</Text>
                            <View style={styles.contactRow}>
                                <Ionicons name="call" size={12} color="#64748B" />
                                <Text style={styles.customerPhone}>{delivery.phone}</Text>
                            </View>
                        </View>
                    </View>
                    {index === 0 && (
                        <View style={styles.nextBadge}>
                            <Ionicons name="navigate" size={12} color="#1d4ed8" />
                            <Text style={styles.nextBadgeText}>NEXT</Text>
                        </View>
                    )}
                </View>

                {/* Order Details */}
                <View style={styles.orderDetails}>
                    <View style={styles.detailRow}>
                        <Ionicons name="ticket-outline" size={16} color="#64748B" />
                        <Text style={styles.orderNumber}>{delivery.orderNumber}</Text>
                        <View style={[
                            styles.priorityTag,
                            delivery.priority === 'high' && styles.priorityTagHigh
                        ]}>
                            <Ionicons 
                                name={delivery.priority === 'high' ? 'flame' : 'checkmark-circle'} 
                                size={12} 
                                color={delivery.priority === 'high' ? '#f59e0b' : '#10b981'} 
                            />
                            <Text style={[
                                styles.priorityTagText,
                                delivery.priority === 'high' && styles.priorityTagTextHigh
                            ]}>
                                {delivery.priority === 'high' ? 'HIGH PRIORITY' : 'STANDARD'}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={16} color="#64748B" />
                        <Text style={styles.addressText} numberOfLines={2}>
                            {delivery.address}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color="#64748B" />
                        <Text style={styles.timeText}>ETA: {delivery.estimatedTime}</Text>
                        <Ionicons name="walk-outline" size={16} color="#64748B" />
                        <Text style={styles.distanceText}>{delivery.distance}</Text>
                    </View>
                </View>

                {/* Items List */}
                <View style={styles.itemsList}>
                    {delivery.items.map((item, itemIndex) => (
                        <View key={itemIndex} style={styles.itemRow}>
                            <Ionicons name="cube-outline" size={14} color="#94a3b8" />
                            <Text style={styles.itemText}>{item}</Text>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount:</Text>
                        <Text style={styles.totalAmount}>{delivery.totalAmount}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.callButton}
                        onPress={() => handleCallCustomer(delivery.customerName, delivery.phone)}
                    >
                        <Ionicons name="call-outline" size={18} color="#1152d4" />
                        <Text style={styles.callButtonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.navigateButton}
                        onPress={() => handleNavigate(delivery)}
                    >
                        <Ionicons name="navigate-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.navigateButtonText}>Navigate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <RouteHeader navigation={navigation} />
            
            {/* Route Summary Header */}
            <View style={styles.routeSummary}>
                <View style={styles.summaryStat}>
                    <Ionicons name="cube-outline" size={24} color="#1152d4" />
                    <Text style={styles.statNumber}>{deliveries.length}</Text>
                    <Text style={styles.statLabel}>Orders</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStat}>
                    <Ionicons name="navigate-outline" size={24} color="#1152d4" />
                    <Text style={styles.statNumber}>{deliveries.filter(d => d.priority === 'high').length}</Text>
                    <Text style={styles.statLabel}>High Priority</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStat}>
                    <Ionicons name="time-outline" size={24} color="#1152d4" />
                    <Text style={styles.statNumber}>~3h</Text>
                    <Text style={styles.statLabel}>Est. Time</Text>
                </View>
            </View>

            {/* Deliveries List */}
            <ScrollView style={styles.deliveriesList} showsVerticalScrollIndicator={false}>
                {deliveries.map((delivery, index) => renderDeliveryCard(delivery, index))}
            </ScrollView>

            {/* Bottom Action Button */}
            <View style={styles.bottomAction}>
                <TouchableOpacity style={styles.startDeliveryButton}>
                    <Ionicons name="play-skip-forward-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.startDeliveryText}>START DELIVERY ROUTE</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    routeSummary: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    summaryStat: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1152d4',
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#e2e8f0',
        marginHorizontal: 8,
    },
    deliveriesList: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    deliveryCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    orderBadge: {
        width: 40,
        minWidth: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    orderBadgeActive: {
        backgroundColor: '#1152d4',
        borderColor: '#1152d4',
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    orderBadgeText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#94a3b8',
    },
    orderBadgeTextActive: {
        color: '#FFFFFF',
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    customerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(17, 82, 212, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    customerDetails: {
        gap: 4,
    },
    customerName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111318',
        letterSpacing: -0.2,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    customerPhone: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },
    nextBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dbeafe',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    nextBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1d4ed8',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    orderDetails: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    orderNumber: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        flex: 1,
    },
    priorityTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    priorityTagHigh: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    priorityTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#10b981',
        letterSpacing: 0.5,
    },
    priorityTagTextHigh: {
        color: '#f59e0b',
    },
    addressText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
        flex: 1,
        lineHeight: 18,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    distanceText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    itemsList: {
        marginBottom: 12,
        gap: 6,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
        flex: 1,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111318',
    },
    totalAmount: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1152d4',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#eff6ff',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    callButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1152d4',
    },
    navigateButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#1152d4',
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    navigateButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    bottomAction: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    startDeliveryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#1152d4',
        paddingVertical: 14,
        borderRadius: 14,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 6,
    },
    startDeliveryText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});

export default RouteScreen;