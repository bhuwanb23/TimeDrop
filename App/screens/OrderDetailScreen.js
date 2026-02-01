import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import apiService from '../services/api';

const OrderDetailScreen = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { addItem } = useCart();
    
    const [orderId, setOrderId] = useState(route.params?.order?.id || null);

    // Status configuration for visual representation
    const getStatusConfig = (status) => {
        const configs = {
            pending: { color: '#FBBF24', label: 'Pending', icon: 'hourglass-top' },
            confirmed: { color: '#60A5FA', label: 'Confirmed', icon: 'check-circle' },
            processing: { color: '#3B82F6', label: 'Processing', icon: 'autorenew' },
            assigned: { color: '#1D4ED8', label: 'Assigned', icon: 'assignment-ind' },
            picked_up: { color: '#8B5CF6', label: 'Picked Up', icon: 'local-shipping' },
            in_transit: { color: '#EC4899', label: 'In Transit', icon: 'directions-car' },
            delivered: { color: '#10B981', label: 'Delivered', icon: 'local-mall' },
            cancelled: { color: '#EF4444', label: 'Cancelled', icon: 'cancel' },
            returned: { color: '#6B7280', label: 'Returned', icon: 'undo' }
        };
        return configs[status] || { color: '#6B7280', label: status, icon: 'help-outline' };
    };

    // Status timeline for tracking
    const getStatusTimeline = () => {
        const timeline = [
            { status: 'pending', label: 'Order Placed' },
            { status: 'confirmed', label: 'Order Confirmed' },
            { status: 'processing', label: 'Processing' },
            { status: 'assigned', label: 'Assigned to Driver' },
            { status: 'picked_up', label: 'Picked Up' },
            { status: 'in_transit', label: 'Out for Delivery' },
            { status: 'delivered', label: 'Delivered' }
        ];
        
        return timeline;
    };

    const loadOrderDetails = async () => {
        try {
            setLoading(true);
            
            // If we have the order from navigation params, use it directly
            if (route.params?.order) {
                setOrder(route.params.order);
            } else {
                // Otherwise fetch from API
                const response = await apiService.orders.getOrderById(orderId);
                if (response.data && response.data.data) {
                    setOrder(response.data.data);
                }
            }
            
            setError(null);
        } catch (err) {
            console.error('Error loading order details:', err);
            setError(err.message || 'Failed to load order details');
            Alert.alert('Error', 'Could not load order details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrderDetails();
    }, []);

    const handleReorder = async () => {
        if (!order?.items) return;

        try {
            // Add all items from the order to the cart
            for (const orderItem of order.items) {
                const productToAdd = {
                    id: orderItem.product_id,
                    name: orderItem.product?.name || 'Product',
                    price: orderItem.unit_price || orderItem.product?.price || 0,
                    image: orderItem.product?.image_url,
                    size: orderItem.notes || 'N/A',
                    color: 'N/A'
                };

                await addItem(productToAdd, orderItem.quantity);
            }

            Alert.alert(
                'Reorder Added',
                `Successfully added ${order.items.length} items to your cart!`,
                [
                    {
                        text: 'View Cart',
                        onPress: () => navigation.navigate('Cart')
                    },
                    {
                        text: 'Continue Shopping',
                        style: 'cancel'
                    }
                ]
            );
        } catch (error) {
            console.error('Error reordering:', error);
            Alert.alert('Error', `Failed to add items to cart: ${error.message}`);
        }
    };

    const handleCallSupport = () => {
        Alert.alert(
            'Contact Support',
            'Would you like to contact support regarding this order?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call Support', onPress: () => Alert.alert('Call Feature', 'Call functionality would be implemented here.') }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <MaterialIcons name="hourglass-top" size={48} color="#1152d4" />
                <Text style={styles.loadingText}>Loading order details...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color="#EF4444" />
                <Text style={styles.errorText}>Error loading order</Text>
                <Text style={styles.errorMessage}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={loadOrderDetails}
                >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <MaterialIcons name="sentiment-dissatisfied" size={48} color="#6B7280" />
                <Text style={styles.errorText}>Order Not Found</Text>
                <Text style={styles.errorMessage}>The requested order could not be found.</Text>
            </SafeAreaView>
        );
    }

    const statusConfig = getStatusConfig(order.status);
    const timeline = getStatusTimeline();
    const currentStatusIndex = timeline.findIndex(t => t.status === order.status);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.scrollContainer}>
                {/* Order Status Card */}
                <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
                            <MaterialIcons 
                                name={statusConfig.icon} 
                                size={20} 
                                color={statusConfig.color} 
                            />
                            <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                {statusConfig.label}
                            </Text>
                        </View>
                        <Text style={styles.orderNumber}>#{order.order_number}</Text>
                    </View>
                    
                    {/* Status Timeline */}
                    <View style={styles.timelineContainer}>
                        {timeline.map((step, index) => {
                            const isCompleted = index <= currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;
                            
                            return (
                                <View key={step.status} style={styles.timelineStep}>
                                    <View style={[
                                        styles.timelineDot,
                                        isCompleted && styles.timelineDotCompleted,
                                        isCurrent && styles.timelineDotCurrent
                                    ]}>
                                        {isCompleted ? (
                                            <MaterialIcons 
                                                name="check" 
                                                size={16} 
                                                color={isCurrent ? "#ffffff" : statusConfig.color} 
                                            />
                                        ) : (
                                            <MaterialIcons 
                                                name={step.status === 'delivered' ? 'local-mall' : 'fiber-manual-record'} 
                                                size={12} 
                                                color="#CBD5E1" 
                                            />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.timelineLabel,
                                        isCompleted && styles.timelineLabelCompleted,
                                        isCurrent && styles.timelineLabelCurrent
                                    ]}>
                                        {step.label}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Order Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Items ({order.items?.length || 0})</Text>
                    {order.items && order.items.map((item, index) => (
                        <View key={item.id || index} style={styles.orderItem}>
                            <Image 
                                source={{ uri: item.product?.image_url }}
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName} numberOfLines={2}>
                                    {item.product?.name || 'Product'}
                                </Text>
                                <Text style={styles.itemNotes}>
                                    {item.notes || 'No special instructions'}
                                </Text>
                                <View style={styles.itemFooter}>
                                    <Text style={styles.itemPrice}>
                                        ${parseFloat(item.unit_price || 0).toFixed(2)} × {item.quantity}
                                    </Text>
                                    <Text style={styles.itemTotal}>
                                        ${parseFloat(item.total_price || 0).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Delivery Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Information</Text>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="location-on" size={20} color="#64748B" />
                        <View style={styles.infoDetails}>
                            <Text style={styles.infoLabel}>Delivery Address</Text>
                            <Text style={styles.infoValue}>
                                {order.delivery_address?.full_name}
                            </Text>
                            <Text style={styles.infoValue}>
                                {order.delivery_address?.address}, {order.delivery_address?.city}
                            </Text>
                            <Text style={styles.infoValue}>
                                {order.delivery_address?.state} {order.delivery_address?.zip}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <MaterialIcons name="call" size={20} color="#64748B" />
                        <View style={styles.infoDetails}>
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>
                                {order.delivery_address?.phone}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Payment Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Information</Text>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="payment" size={20} color="#64748B" />
                        <View style={styles.infoDetails}>
                            <Text style={styles.infoLabel}>Payment Method</Text>
                            <Text style={styles.infoValue}>
                                {order.payment_method?.replace('_', ' ') || 'N/A'}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <MaterialIcons name="receipt" size={20} color="#64748B" />
                        <View style={styles.infoDetails}>
                            <Text style={styles.infoLabel}>Payment Status</Text>
                            <Text style={styles.infoValue}>
                                {order.payment_status?.replace('_', ' ') || 'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Price Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Summary</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Subtotal</Text>
                        <Text style={styles.priceValue}>
                            ${parseFloat(order.total_amount || 0).toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Shipping</Text>
                        <Text style={styles.priceValue}>Free</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Tax</Text>
                        <Text style={styles.priceValue}>$0.00</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>
                            ${parseFloat(order.total_amount || 0).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Order Date */}
                <View style={styles.section}>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="calendar-today" size={20} color="#64748B" />
                        <View style={styles.infoDetails}>
                            <Text style={styles.infoLabel}>Order Date</Text>
                            <Text style={styles.infoValue}>
                                {new Date(order.createdAt).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <TouchableOpacity 
                        style={styles.contactButton}
                        onPress={handleCallSupport}
                    >
                        <MaterialIcons name="support-agent" size={20} color="#64748B" />
                        <Text style={styles.contactButtonText}>Contact Support</Text>
                    </TouchableOpacity>
                )}
                
                {order.status === 'delivered' && (
                    <TouchableOpacity 
                        style={styles.reorderButton}
                        onPress={handleReorder}
                    >
                        <MaterialIcons name="refresh" size={20} color="#ffffff" />
                        <Text style={styles.reorderButtonText}>Reorder</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f6f8',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f6f8',
        padding: 24,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#EF4444',
        marginTop: 16,
    },
    errorMessage: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
    },
    retryButton: {
        backgroundColor: '#1152d4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 24,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: 'rgba(246, 246, 248, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(226, 232, 240, 0.5)',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        flex: 1,
        textAlign: 'center',
        marginRight: 32,
    },
    headerPlaceholder: {
        width: 40,
    },
    scrollContainer: {
        flex: 1,
    },
    statusCard: {
        backgroundColor: '#ffffff',
        margin: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    orderNumber: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    timelineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    timelineStep: {
        alignItems: 'center',
        flex: 1,
    },
    timelineDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    timelineDotCompleted: {
        backgroundColor: '#10B981',
    },
    timelineDotCurrent: {
        backgroundColor: '#1152d4',
    },
    timelineLabel: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 8,
        textAlign: 'center',
        maxWidth: 60,
    },
    timelineLabelCompleted: {
        color: '#64748B',
        fontWeight: '500',
    },
    timelineLabelCurrent: {
        color: '#1152d4',
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    itemImage: {
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    itemNotes: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 12,
        color: '#64748b',
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1152d4',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    infoDetails: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0f172a',
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1152d4',
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    contactButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    contactButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b',
    },
    reorderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#1152d4',
        paddingVertical: 16,
        borderRadius: 12,
    },
    reorderButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});

export default OrderDetailScreen;