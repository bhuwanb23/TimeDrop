import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DeliveryNavigationScreen = ({ route, navigation }) => {
    const { delivery } = route.params || {};
    
    // Mock data if no delivery passed
    const deliveryData = delivery || {
        id: 1,
        orderNumber: 'ORD-98210',
        customerName: 'John Doe',
        address: '123 Main St, San Francisco, CA 94102',
        phone: '(555) 123-4567',
        email: 'john.doe@example.com',
        items: [
            { 
                id: 1, 
                name: 'Wireless Bluetooth Headphones', 
                price: 79.99, 
                quantity: 1,
                image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
            },
            { 
                id: 2, 
                name: 'Smart Watch Series 7', 
                price: 399.99, 
                quantity: 1,
                image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400'
            }
        ],
        totalAmount: '$479.98',
        estimatedTime: '2:15 PM',
        distance: '2.3 km',
        status: 'in_transit'
    };

    const [currentStep, setCurrentStep] = useState(0);
    const [showQRCode, setShowQRCode] = useState(false);

    // Turn-by-turn navigation instructions
    const navigationSteps = [
        {
            id: 1,
            instruction: 'Head north on Market St toward 4th St',
            distance: '0.2 km',
            duration: '2 min',
            icon: 'arrow-upward',
            type: 'start'
        },
        {
            id: 2,
            instruction: 'Turn right onto 4th St',
            distance: '0.3 km',
            duration: '3 min',
            icon: 'turn-right',
            type: 'turn'
        },
        {
            id: 3,
            instruction: 'Continue straight onto Mission St',
            distance: '0.5 km',
            duration: '5 min',
            icon: 'arrow-forward',
            type: 'straight'
        },
        {
            id: 4,
            instruction: 'Turn left onto Valencia St',
            distance: '0.4 km',
            duration: '4 min',
            icon: 'turn-left',
            type: 'turn'
        },
        {
            id: 5,
            instruction: 'Turn right onto 17th St',
            distance: '0.3 km',
            duration: '3 min',
            icon: 'turn-right',
            type: 'turn'
        },
        {
            id: 6,
            instruction: 'Arrive at destination on the right',
            distance: '0.1 km',
            duration: '1 min',
            icon: 'location',
            type: 'arrive'
        }
    ];

    const handleDeliverOrder = () => {
        Alert.alert(
            'Confirm Delivery',
            'Have you handed the package to the customer?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Yes, Deliver', 
                    onPress: () => {
                        setShowQRCode(true);
                        Alert.alert(
                            'Show QR Code',
                            'Ask customer to scan the QR code to confirm delivery',
                            [{ text: 'OK' }]
                        );
                    }
                }
            ]
        );
    };

    const renderNavigationStep = (step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
            <TouchableOpacity 
                key={step.id} 
                style={[
                    styles.navStep,
                    isActive && styles.navStepActive,
                    isCompleted && styles.navStepCompleted
                ]}
                onPress={() => setCurrentStep(index)}
            >
                <View style={[
                    styles.stepNumberContainer,
                    isActive && styles.stepNumberContainerActive,
                    isCompleted && styles.stepNumberContainerCompleted
                ]}>
                    {isCompleted ? (
                        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                    ) : (
                        <Text style={[
                            styles.stepNumber,
                            isActive && styles.stepNumberActive
                        ]}>
                            {index + 1}
                        </Text>
                    )}
                </View>
                
                <View style={styles.stepLineContainer}>
                    <View style={[
                        styles.stepLine,
                        isCompleted && styles.stepLineCompleted
                    ]} />
                </View>

                <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                        <Ionicons 
                            name={step.icon} 
                            size={20} 
                            color={isActive ? '#1152d4' : '#94a3b8'} 
                        />
                        <Text style={[
                            styles.stepInstruction,
                            isActive && styles.stepInstructionActive
                        ]}>
                            {step.instruction}
                        </Text>
                    </View>
                    <View style={styles.stepDetails}>
                        <Text style={styles.stepDistance}>{step.distance}</Text>
                        <Text style={styles.stepDuration}>• {step.duration}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#111318" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Delivery Navigation</Text>
                    <Text style={styles.headerSubtitle}>{deliveryData.orderNumber}</Text>
                </View>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Customer Details Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-circle" size={40} color="#1152d4" />
                        <View style={styles.customerInfo}>
                            <Text style={styles.customerName}>{deliveryData.customerName}</Text>
                            <View style={styles.contactInfo}>
                                <Ionicons name="call" size={14} color="#64748B" />
                                <Text style={styles.contactText}>{deliveryData.phone}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.callButtonSmall}>
                            <Ionicons name="call-outline" size={20} color="#1152d4" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.addressSection}>
                        <Ionicons name="location" size={20} color="#f59e0b" />
                        <Text style={styles.addressText}>{deliveryData.address}</Text>
                    </View>

                    <View style={styles.deliveryInfo}>
                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={18} color="#1152d4" />
                            <Text style={styles.infoLabel}>ETA:</Text>
                            <Text style={styles.infoValue}>{deliveryData.estimatedTime}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="walk-outline" size={18} color="#1152d4" />
                            <Text style={styles.infoLabel}>Distance:</Text>
                            <Text style={styles.infoValue}>{deliveryData.distance}</Text>
                        </View>
                    </View>
                </View>

                {/* Products to Deliver */}
                <View style={styles.card}>
                    <View style={styles.cardTitleRow}>
                        <Ionicons name="cube" size={20} color="#1152d4" />
                        <Text style={styles.cardTitle}>Products to Deliver</Text>
                        <Text style={styles.productCount}>{deliveryData.items.length} items</Text>
                    </View>

                    {deliveryData.items.map((item) => (
                        <View key={item.id} style={styles.productItem}>
                            <Image source={{ uri: item.image_url }} style={styles.productImage} />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
                                <Text style={styles.productPrice}>${item.price ? item.price.toFixed(2) : '0.00'}</Text>
                            </View>
                        </View>
                    ))}

                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>Total Amount:</Text>
                        <Text style={styles.totalAmount}>{deliveryData.totalAmount}</Text>
                    </View>
                </View>

                {/* Turn-by-Turn Navigation */}
                <View style={styles.card}>
                    <View style={styles.cardTitleRow}>
                        <Ionicons name="navigate-circle" size={20} color="#1152d4" />
                        <Text style={styles.cardTitle}>Navigation Steps</Text>
                        {navigationSteps && navigationSteps.length > 0 && (
                            <Text style={styles.stepsCount}>{navigationSteps.length} steps</Text>
                        )}
                    </View>

                    <View style={styles.navigationList}>
                        {navigationSteps && navigationSteps.length > 0 ? (
                            navigationSteps.map((step, index) => renderNavigationStep(step, index))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="location" size={48} color="#94A3B8" />
                                <Text style={styles.emptyText}>No navigation steps available</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* QR Code Section (shown after delivery confirmation) */}
                {showQRCode && (
                    <View style={styles.card}>
                        <View style={styles.cardTitleRow}>
                            <Ionicons name="qr-code" size={20} color="#10b981" />
                            <Text style={styles.cardTitle}>Delivery Confirmation</Text>
                        </View>
                        
                        <View style={styles.qrCodeContainer}>
                            <View style={styles.qrCodePlaceholder}>
                                <Ionicons name="qr-code" size={120} color="#111318" />
                            </View>
                            <Text style={styles.qrInstruction}>Ask customer to scan this code</Text>
                            <Text style={styles.qrSubtext}>This confirms successful delivery</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Action Buttons */}
            {!showQRCode && (
                <View style={styles.bottomActions}>
                    <TouchableOpacity 
                        style={styles.completeButton}
                        onPress={handleDeliverOrder}
                    >
                        <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                        <Text style={styles.completeButtonText}>COMPLETE DELIVERY</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECFDF5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#D1FAE5',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#064E3B',
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#059669',
        marginTop: 2,
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    customerInfo: {
        flex: 1,
        gap: 4,
    },
    customerName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#064E3B',
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    contactText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#059669',
    },
    callButtonSmall: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addressSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: '#ECFDF5',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    addressText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#059669',
        flex: 1,
        lineHeight: 20,
    },
    deliveryInfo: {
        flexDirection: 'row',
        gap: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#A7F3D0',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#059669',
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#064E3B',
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#064E3B',
        flex: 1,
    },
    productCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    stepsCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    productItem: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111318',
    },
    productQuantity: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },
    productPrice: {
        fontSize: 13,
        fontWeight: '700',
        color: '#10B981',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 2,
        borderTopColor: '#10B981',
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#064E3B',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '800',
        color: '#10B981',
    },
    navigationList: {
        gap: 0,
    },
    navStep: {
        flexDirection: 'row',
        paddingVertical: 16,
        position: 'relative',
    },
    navStepActive: {
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
    },
    navStepCompleted: {
        opacity: 0.7,
    },
    stepNumberContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        zIndex: 2,
    },
    stepNumberContainerActive: {
        backgroundColor: '#1152d4',
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    stepNumberContainerCompleted: {
        backgroundColor: '#10b981',
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#059669',
    },
    stepNumberActive: {
        color: '#FFFFFF',
    },
    stepLineContainer: {
        position: 'absolute',
        left: 28,
        top: 32,
        bottom: 0,
        width: 2,
    },
    stepLine: {
        flex: 1,
        backgroundColor: '#A7F3D0',
    },
    stepLineCompleted: {
        backgroundColor: '#10b981',
    },
    stepContent: {
        flex: 1,
        marginLeft: 8,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 6,
    },
    stepInstruction: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
        flex: 1,
    },
    stepInstructionActive: {
        color: '#10B981',
        fontWeight: '700',
    },
    stepDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepDistance: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
    },
    stepDuration: {
        fontSize: 12,
        fontWeight: '500',
        color: '#059669',
    },
    qrCodeContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    qrCodePlaceholder: {
        width: 160,
        height: 160,
        backgroundColor: '#D1FAE5',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#10B981',
    },
    qrInstruction: {
        fontSize: 15,
        fontWeight: '700',
        color: '#064E3B',
        marginBottom: 8,
    },
    qrSubtext: {
        fontSize: 13,
        fontWeight: '500',
        color: '#059669',
        textAlign: 'center',
    },
    bottomActions: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#A7F3D0',
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#10b981',
        paddingVertical: 14,
        borderRadius: 14,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 6,
    },
    completeButtonText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#94A3B8',
        marginTop: 12,
        textAlign: 'center',
    },
});

export default DeliveryNavigationScreen;
