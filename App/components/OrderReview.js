import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const OrderReview = ({ formData, onBack, onPlaceOrder, orderItems }) => {
    const items = [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            color: 'Midnight Black',
            quantity: 1,
            price: 159.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPg2W063-DgGNea5OskRP4nSdi7-MB76EEnwP8acW-NPdhbd5oe7D7lAJu5cbaunk39TE-l_seNUI4Mldqd3zszSfqE2x-DYHI7yD2KBGVs3pxCNgD4x_105_-mzT_t0GzDABnaT9HtxjRyjSsT8LyEixtKKngRYrsbpoluonRWpe44SOPEwL5tygcELtli5pw0EtFb_jk9ULzgGBKAS6Ky2PHHVL49LougWdGLe1y9deDemtdg-jOBx1m5b6owQvaFT8YzVsn7QA'
        },
        {
            id: 2,
            name: 'Smart Minimalist Watch',
            color: 'Silver / Leather',
            quantity: 1,
            price: 85.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBXZP3iBR2eWYdiI6HsHsDESDMs7q7dZ3mweI9TB9uwHei9NZVepznHcf8wjnWiyWyDMuZBeT7sTGADskINxA7DS2hoPqJTSSHTMuJ9oS6bzqmwXpuiFL_pveqBPgM8eLXmpnbHZasc-MuKeN09OILFGj4TrEr5VxIYPvIQPaEtxawIPkDc8wBPnPUaLlAxlM6RSjc3ypmnu2PH0yNyHWvj8diKAa_prShquosdINSsjNO4UFtC0dj5-M8ECtyVWGhVUpvoDm2l_8'
        },
        {
            id: 3,
            name: 'Protective Case G1',
            color: 'Clear',
            quantity: 1,
            price: 5.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8fDxbexjiUdEcGLPqI7bWncxMp3FAINabrZVOzoCSCcJyBYiK9dhFHifDiXU4MyrgVYA3bXSmNi7EynDWyIsuaOJigzLt3kbhooJMPmVWfKDnda1_115cFi-ifddxcbwTCCGCGjlBXmaDPIXV9Rp_ss96C2ALY3jYyYafdUqK8vnukR03mo_bmG6th7aKVM5XsYFpvRtORy29SfoScPSHs-GhWufnhzH2j7scfKsHAWRlVF-ZGmNsiihNstIymBFIGwTzbS_MgMA'
        }
    ];

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.075; // 7.5% tax
    const total = subtotal + shipping + tax;

    return (
        <View style={styles.container}>
            {/* Shipping Address Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                    <TouchableOpacity>
                        <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.addressContainer}>
                    <MaterialIcons name="location-on" size={20} color="#94a3b8" />
                    <View style={styles.addressText}>
                        <Text style={styles.addressName}>{formData.fullName}</Text>
                        <Text style={styles.addressLine}>{formData.address}</Text>
                        <Text style={styles.addressLine}>{formData.city}, {formData.state} {formData.zip}</Text>
                        <Text style={styles.addressLine}>{formData.phone}</Text>
                    </View>
                </View>
            </View>

            {/* Payment Method Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <TouchableOpacity>
                        <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.paymentContainer}>
                    <View style={styles.cardBrand}>
                        <Text style={styles.cardBrandText}>VISA</Text>
                    </View>
                    <View style={styles.paymentText}>
                        <Text style={styles.paymentName}>Visa ending in {formData.cardNumber?.slice(-4) || '4242'}</Text>
                        <Text style={styles.paymentExpiry}>Expires {formData.expiry || '12/26'}</Text>
                    </View>
                </View>
            </View>

            {/* Order Summary Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Summary ({items.length} Items)</Text>
                <View style={styles.itemsContainer}>
                    {items.map(item => (
                        <View key={item.id} style={styles.itemRow}>
                            <View style={styles.itemImageContainer}>
                                <Image 
                                    source={{ uri: item.image }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.itemDescription}>{item.color} | Qty: {item.quantity}</Text>
                                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Pricing Breakdown */}
            <View style={styles.section}>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Subtotal</Text>
                    <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Shipping</Text>
                    <Text style={styles.priceValueFree}>Free</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Tax</Text>
                    <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Order Total</Text>
                    <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
                By placing your order, you agree to our Terms of Service and Privacy Policy.
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={onBack}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.placeOrderButton}
                    onPress={onPlaceOrder}
                >
                    <Text style={styles.placeOrderText}>Place Order</Text>
                    <MaterialIcons name="keyboard-double-arrow-right" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 24,
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    editButton: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1152d4',
    },
    addressContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    addressText: {
        flex: 1,
    },
    addressName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    addressLine: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 2,
    },
    paymentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardBrand: {
        width: 40,
        height: 24,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBrandText: {
        fontSize: 10,
        fontWeight: '900',
        fontStyle: 'italic',
        color: '#1152d4',
    },
    paymentText: {
        flex: 1,
    },
    paymentName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 2,
    },
    paymentExpiry: {
        fontSize: 14,
        color: '#64748b',
    },
    itemsContainer: {
        gap: 16,
        marginTop: 16,
    },
    itemRow: {
        flexDirection: 'row',
        gap: 16,
    },
    itemImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1152d4',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
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
    priceValueFree: {
        fontSize: 14,
        fontWeight: '500',
        color: '#10b981',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1152d4',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 8,
    },
    termsText: {
        fontSize: 10,
        color: '#94a3b8',
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingBottom: 24,
        lineHeight: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    backButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        paddingHorizontal: 24,
    },
    backButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '600',
    },
    placeOrderButton: {
        flex: 1,
        backgroundColor: '#1152d4',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    placeOrderText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default OrderReview;