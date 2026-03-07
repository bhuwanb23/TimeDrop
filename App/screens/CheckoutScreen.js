import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
// Removed: import apiService from '../services/api';

const CheckoutScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    
    // Mock checkout data
    const [checkoutData] = useState({
        items: [
            { id: 1, name: 'Wireless Bluetooth Headphones', price: 79.99, quantity: 1 },
            { id: 2, name: 'Smart Watch Series 7', price: 399.99, quantity: 1 }
        ],
        subtotal: 479.98,
        deliveryFee: 5.99,
        tax: 48.00,
        total: 533.97
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [deliveryAddress, setDeliveryAddress] = useState('123 Main St, San Francisco, CA 94102');

    const handlePlaceOrder = () => {
        setLoading(true);
        // Simulate order placement
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                'Order Placed!',
                'Your order has been successfully placed.',
                [{ text: 'OK', onPress: () => navigation.navigate('MyOrders') }]
            );
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.addressCard}>
                        <MaterialIcons name="location-on" size={24} color="#10B981" />
                        <View style={styles.addressDetails}>
                            <Text style={styles.addressLabel}>Home</Text>
                            <Text style={styles.addressText}>{deliveryAddress}</Text>
                        </View>
                        <TouchableOpacity onPress={() => Alert.alert('Edit Address', 'Address editing would go here')}>
                            <MaterialIcons name="edit" size={20} color="#10B981" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryCard}>
                        {checkoutData.items.map((item) => (
                            <View key={item.id} style={styles.summaryItem}>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                </View>
                                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                            </View>
                        ))}
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>${checkoutData.subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Delivery Fee</Text>
                            <Text style={styles.totalValue}>${checkoutData.deliveryFee.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tax</Text>
                            <Text style={styles.totalValue}>${checkoutData.tax.toFixed(2)}</Text>
                        </View>
                        
                        <View style={[styles.totalRow, styles.grandTotal]}>
                            <Text style={[styles.totalLabel, styles.grandTotalLabel]}>Total</Text>
                            <Text style={[styles.totalValue, styles.grandTotalValue]}>${checkoutData.total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.paymentMethods}>
                        <TouchableOpacity 
                            style={[styles.paymentMethod, paymentMethod === 'card' && styles.paymentMethodActive]}
                            onPress={() => setPaymentMethod('card')}
                        >
                            <MaterialIcons 
                                name="credit-card" 
                                size={24} 
                                color={paymentMethod === 'card' ? '#fff' : '#1e3b8a'} 
                            />
                            <Text style={[styles.paymentMethodText, paymentMethod === 'card' && styles.paymentMethodTextActive]}>
                                Card
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.paymentMethod, paymentMethod === 'cash' && styles.paymentMethodActive]}
                            onPress={() => setPaymentMethod('cash')}
                        >
                            <MaterialIcons 
                                name="money" 
                                size={24} 
                                color={paymentMethod === 'cash' ? '#fff' : '#1e3b8a'} 
                            />
                            <Text style={[styles.paymentMethodText, paymentMethod === 'cash' && styles.paymentMethodTextActive]}>
                                Cash
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.paymentMethod, paymentMethod === 'digital' && styles.paymentMethodActive]}
                            onPress={() => setPaymentMethod('digital')}
                        >
                            <MaterialIcons 
                                name="phone-android" 
                                size={24} 
                                color={paymentMethod === 'digital' ? '#fff' : '#1e3b8a'} 
                            />
                            <Text style={[styles.paymentMethodText, paymentMethod === 'digital' && styles.paymentMethodTextActive]}>
                                Digital
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Place Order Button */}
                <TouchableOpacity 
                    style={[styles.placeOrderButton, loading && styles.placeOrderButtonDisabled]} 
                    onPress={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.placeOrderButtonText}>Place Order</Text>
                            <MaterialIcons name="shopping-cart-checkout" size={24} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingTop: 16,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    placeholder: {
        width: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10B981',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#6B7280',
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 12,
        color: '#6B7280',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#10B981',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    grandTotal: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    grandTotalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    grandTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981',
    },
    paymentMethods: {
        flexDirection: 'row',
        gap: 12,
    },
    paymentMethod: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    paymentMethodActive: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    paymentMethodText: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
    },
    paymentMethodTextActive: {
        color: '#FFFFFF',
    },
    placeOrderButton: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 24,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    placeOrderButtonDisabled: {
        opacity: 0.5,
    },
    placeOrderButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default CheckoutScreen;