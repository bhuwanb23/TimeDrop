import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const OrderDetailScreen = ({ route, navigation }) => {
    const { orderId } = route.params || {};
    
    // Mock order data
    const [order, setOrder] = useState({
        id: orderId || 1,
        order_number: 'ORD-98210',
        status: 'in_transit',
        total_amount: 479.98,
        createdAt: new Date().toISOString(),
        customer: {
            name: 'John Doe',
            phone: '+1 (555) 123-4567',
            email: 'john.doe@example.com'
        },
        delivery_address: '123 Main St, San Francisco, CA 94102',
        items: [
            { 
                id: 1, 
                product: { name: 'Wireless Bluetooth Headphones', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
                quantity: 1,
                price: 79.99
            },
            { 
                id: 2, 
                product: { name: 'Smart Watch Series 7', image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400' },
                quantity: 1,
                price: 399.99
            }
        ],
        tracking: {
            current_status: 'Out for Delivery',
            estimated_delivery: 'Today by 8:00 PM',
            driver: {
                name: 'Alex Thompson',
                phone: '+1 (555) 987-6543',
                rating: 4.95
            }
        }
    });
    
    const [loading, setLoading] = useState(false);

    const getStatusConfig = (status) => {
        const configs = {
            pending: { color: '#FBBF24', label: 'Pending', icon: 'hourglass-top' },
            confirmed: { color: '#60A5FA', label: 'Confirmed', icon: 'check-circle' },
            processing: { color: '#3B82F6', label: 'Processing', icon: 'autorenew' },
            in_transit: { color: '#10B981', label: 'In Transit', icon: 'directions-car' },
            delivered: { color: '#10B981', label: 'Delivered', icon: 'local-mall' },
            cancelled: { color: '#EF4444', label: 'Cancelled', icon: 'cancel' }
        };
        return configs[status] || { color: '#6B7280', label: status, icon: 'help-outline' };
    };

    const handleContactDriver = () => {
        Alert.alert('Contact Driver', `Calling ${order.tracking.driver.name}...`);
    };

    const statusConfig = getStatusConfig(order.status);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Order Details</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Order Status Card */}
                <View style={styles.statusCard}>
                    <View style={[styles.statusIconContainer, { backgroundColor: `${statusConfig.color}20` }]}>
                        <MaterialIcons name={statusConfig.icon} size={32} color={statusConfig.color} />
                    </View>
                    <Text style={styles.statusText}>{statusConfig.label}</Text>
                    <Text style={styles.orderNumber}>#{order.order_number}</Text>
                    <Text style={styles.estimatedDelivery}>{order.tracking.estimated_delivery}</Text>
                </View>

                {/* Items Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Items</Text>
                    {order.items.map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <View style={styles.itemImageContainer}>
                                <View style={styles.itemImagePlaceholder}>
                                    <MaterialIcons name="image" size={24} color="#9CA3AF" />
                                </View>
                            </View>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.product.name}</Text>
                                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.addressCard}>
                        <MaterialIcons name="location-on" size={24} color="#1e3b8a" />
                        <Text style={styles.addressText}>{order.delivery_address}</Text>
                    </View>
                </View>

                {/* Driver Info */}
                {order.tracking.driver && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Driver</Text>
                        <View style={styles.driverCard}>
                            <View style={styles.driverInfo}>
                                <MaterialIcons name="person" size={32} color="#1e3b8a" />
                                <View style={styles.driverDetails}>
                                    <Text style={styles.driverName}>{order.tracking.driver.name}</Text>
                                    <View style={styles.driverRating}>
                                        <MaterialIcons name="star" size={16} color="#FBBF24" />
                                        <Text style={styles.ratingText}>{order.tracking.driver.rating}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.contactButton} onPress={handleContactDriver}>
                                <MaterialIcons name="phone" size={20} color="#1e3b8a" />
                                <Text style={styles.contactButtonText}>Call</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Order Total */}
                <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>${(order.total_amount * 0.9).toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Delivery Fee</Text>
                        <Text style={styles.totalValue}>$5.99</Text>
                    </View>
                    <View style={[styles.totalRow, styles.totalRowBorder]}>
                        <Text style={styles.totalLabel}>Tax</Text>
                        <Text style={styles.totalValue}>${(order.total_amount * 0.1).toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, styles.totalLabelBold]}>Total</Text>
                        <Text style={[styles.totalValue, styles.totalValueBold]}>${order.total_amount.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    scrollView: {
        flex: 1,
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
    placeholder: {
        width: 40,
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
    statusIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 8,
    },
    orderNumber: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
        marginBottom: 8,
    },
    estimatedDelivery: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '400',
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
    itemCard: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    itemImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImagePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
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
    itemQuantity: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1152d4',
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    addressText: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '500',
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    driverDetails: {
        flex: 1,
    },
    driverName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    driverRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#64748b',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    contactButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e3b8a',
    },
    totalSection: {
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
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    totalRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    totalLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0f172a',
    },
    totalLabelBold: {
        fontWeight: '700',
    },
    totalValueBold: {
        fontWeight: '700',
        color: '#1152d4',
    },
});

export default OrderDetailScreen;