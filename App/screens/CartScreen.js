import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Leather Sneakers',
            price: 120.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjgpqdGZ25XswzLe9G3WUZ1dOFa1LYCK4Ifsz3Iq3y9AympfbQqNHTCTmxqI926-cvXpW8mN5zp5Z474riV_AA8O7O_xbiZgNE5fAu_86OxbgflgNMQdC338pqvwvI1M_bsKSr8IWbNtYyVKEXuYc9_o67WYNibYVYvY5iausRUSmbFQn2smDYdmoXGxgyfkwQSPJu9HmX04TMszKBHRaRZSWXJP25e40mGtO42mtIvST_DvRkwc8Zh8DsyJJIEUCaO2Ly5XldNCs',
            size: '10',
            color: 'White',
            quantity: 1
        },
        {
            id: 2,
            name: 'Organic Cotton Tee',
            price: 35.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCekpLqvq1f3jwGr81ZIne41gAtTkbO97p8xUe3t9t3ra2pwiY_xQH0qgr8U5FEdFTZf8RZhyRuCnrrTBZDS9L7SMsZ1mQOt9d99kmi72pO5hLKMfL8D3lSh6wIMppEPuRog0dQUgA-Eusc2t-XzmK4HKm7_vJdL00hKdTQiqOAJWp_oR4ECnJ7PSU2ybPRtoQJWFb8Y8V2zHovIbf7DyOa86wJUltsBhCrfHpfMh7kPq8tXZZ-JXo7WkzPilpnOT9nRTyGtB-FJxk',
            size: 'M',
            color: 'Navy',
            quantity: 2
        }
    ]);

    const [savedItems] = useState([
        {
            id: 3,
            name: 'Minimal Desk Lamp',
            price: 85.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB-bWafTGQn5QT8C2X6ovOuBU_Ki_Y0HUve30AfHKXiEGPyciPlDh6EZ5UMAegPq_KkNA6PROGNVY0NEIsod4lonao5WtXKgj7EURMWiqwPJh8v7FSQ1Qr2W1Ogaehv7nxrlVvoor0HL9bBL-1pkx9dZqTz3yXMfz9tOGOQ92q5_RS6Jwtlq4tXUDBC2uTFrpgzFMD1BNB4dS6raUtkPFNbyYFl0qQ-UUeEjlxI4GtVFcQIP35MfQFJB7SzZhTNzEdBfGKgU1CUxI'
        },
        {
            id: 4,
            name: 'Ceramic Mug Set',
            price: 24.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBouS316W8T35WAEuLmaI9FDruF0EQMR2GaXjhpo-CzYou_-c3BAWA6f4qgezZZupzdrhMACuTmBWuJXteMYvttXN53RwpGgDbZuSUm2famJhHhUXG9HtS_XanTABFZ_YOEOKvFT9g1TkPfIOhzOvn1UfEDbRY56r17zmX2-3urhxcPD_RZ9sl-2AA88ScAEKCnaVEFHnhgNZRnyvtHtrv2lwGrITDmsU1ib3DEhrZGOa8hYzgoXlgojQaHS5dyQJ_LS6cJH6x9a2o'
        }
    ]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const handleRemoveItem = (itemId) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setCartItems(prevItems =>
                            prevItems.filter(item => item.id !== itemId)
                        );
                    }
                }
            ]
        );
    };

    const handleMoveToCart = (item) => {
        const newItem = {
            ...item,
            quantity: 1,
            size: 'M',
            color: 'Black'
        };
        setCartItems(prevItems => [...prevItems, newItem]);
        Alert.alert('Success', `${item.name} moved to cart`);
    };

    const handleProceedToCheckout = () => {
        if (cartItems.length === 0) {
            Alert.alert('Empty Cart', 'Please add items to your cart before proceeding to checkout.');
            return;
        }
        // Navigate to checkout tab
        navigation.navigate('Checkout');
    };

    const CartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image 
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="cover"
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemAttributes}>Size: {item.size}, Color: {item.color}</Text>
                <View style={styles.itemBottomRow}>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                            <MaterialIcons name="remove" size={18} color="#6b7280" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                            <MaterialIcons name="add" size={18} color="#6b7280" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity 
                style={styles.removeItemButton}
                onPress={() => handleRemoveItem(item.id)}
            >
                <MaterialIcons name="delete" size={20} color="#6b7280" />
            </TouchableOpacity>
        </View>
    );

    const SavedItem = ({ item }) => (
        <View style={styles.savedItem}>
            <Image 
                source={{ uri: item.image }}
                style={styles.savedItemImage}
                resizeMode="cover"
            />
            <Text style={styles.savedItemName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.savedItemPrice}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity 
                style={styles.moveToCartButton}
                onPress={() => handleMoveToCart(item)}
            >
                <Text style={styles.moveToCartText}>Move to Cart</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Top App Bar */}
            <View style={styles.appBar}>
                <TouchableOpacity style={styles.backButton}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="#0d121b" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Cart ({cartItems.length})</Text>
                <TouchableOpacity style={styles.deleteButton}>
                    <MaterialIcons name="delete" size={24} color="#0d121b" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Cart Items */}
                <View style={styles.itemsSection}>
                    {cartItems.map(item => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </View>

                {/* Order Summary */}
                <View style={styles.summarySection}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.sectionTitle}>Order Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shipping</Text>
                            <Text style={[styles.summaryValue, styles.freeShipping]}>Free</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Estimated Tax</Text>
                            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.checkoutButton}
                            onPress={handleProceedToCheckout}
                        >
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Saved for Later */}
                <View style={styles.savedSection}>
                    <View style={styles.savedHeader}>
                        <Text style={styles.sectionTitle}>Saved for Later ({savedItems.length})</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.savedGrid}>
                        {savedItems.map(item => (
                            <SavedItem key={item.id} item={item} />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Spacer */}
            <View style={styles.bottomSpacer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    appBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: 'rgba(246, 246, 248, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(209, 213, 219, 0.5)',
        zIndex: 10,
    },
    backButton: {
        padding: 8,
    },
    appBarTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0d121b',
        flex: 1,
        textAlign: 'center',
    },
    deleteButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    itemsSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 8,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0d121b',
        marginBottom: 4,
    },
    itemAttributes: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 8,
    },
    itemBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1152d4',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f6f6f8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    quantityButton: {
        padding: 4,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '700',
        width: 16,
        textAlign: 'center',
        color: '#0d121b',
    },
    removeItemButton: {
        padding: 8,
        marginLeft: 8,
    },
    summarySection: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    summaryCard: {
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0d121b',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0d121b',
    },
    freeShipping: {
        color: '#16a34a',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0d121b',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1152d4',
    },
    checkoutButton: {
        backgroundColor: '#1152d4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    checkoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    savedSection: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    savedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1152d4',
    },
    savedGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    savedItem: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    savedItemImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 12,
    },
    savedItemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0d121b',
        marginBottom: 4,
    },
    savedItemPrice: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 8,
    },
    moveToCartButton: {
        backgroundColor: 'rgba(17, 82, 212, 0.1)',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    moveToCartText: {
        color: '#1152d4',
        fontSize: 12,
        fontWeight: '700',
    },
    bottomSpacer: {
        height: 32,
        backgroundColor: '#f6f6f8',
    },
});

export default CartScreen;