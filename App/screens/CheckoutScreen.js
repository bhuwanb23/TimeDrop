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
                        <MaterialIcons name="location-on" size={24} color="#1e3b8a" />
                        <View style={styles.addressDetails}>
                            <Text style={styles.addressLabel}>Home</Text>
                            <Text style={styles.addressText}>{deliveryAddress}</Text>
                        </View>
                        <TouchableOpacity onPress={() => Alert.alert('Edit Address', 'Address editing would go here')}>
                            <MaterialIcons name="edit" size={20} color="#1e3b8a" />
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