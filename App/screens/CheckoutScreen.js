import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { navigate } from '../utils/RootNavigation';
import { useCart } from '../context/CartContext';
import apiService from '../services/api';
import CheckoutHeader from '../components/CheckoutHeader';
import ShippingAddressForm from '../components/ShippingAddressForm';
import PaymentMethodForm from '../components/PaymentMethodForm';
import OrderReview from '../components/OrderReview';
import CustomerBottomNavbar from '../components/CustomerBottomNavbar';

const CheckoutScreen = ({ navigation }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [checkoutData, setCheckoutData] = useState({
        // Shipping Address Data
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        saveAddress: false,
        
        // Payment Data
        paymentMethod: 'card',
        cardholderName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        saveCard: false,
    });
    
    // Cart context
    const { items: cartItems, totalAmount: cartTotal, clearCart } = useCart();

    const handleStepChange = (step) => {
        // Only allow navigation to completed or current steps
        if (step <= currentStep) {
            setCurrentStep(step);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            // Navigate back to cart screen
            navigation.navigate('Cart');
        }
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleFormDataChange = (newData) => {
        setCheckoutData(prev => ({ ...prev, ...newData }));
    };

    const handlePlaceOrder = async () => {
        // Validate all required data before placing order
        if (!checkoutData.fullName || !checkoutData.cardholderName) {
            Alert.alert('Missing Information', 'Please complete all required fields');
            return;
        }
        
        if (cartItems.length === 0) {
            Alert.alert('Empty Cart', 'Cannot place an order with an empty cart');
            return;
        }
        
        try {
            // Show loading indicator
            Alert.alert(
                'Placing Order...',
                'Please wait while we process your order',
                []
            );
            
            // Prepare order data
            const orderData = {
                items: cartItems.map(item => ({
                    product_id: item.productId,
                    quantity: item.quantity,
                    notes: `Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}`
                })),
                delivery_address: {
                    full_name: checkoutData.fullName,
                    phone: checkoutData.phone,
                    address: checkoutData.address,
                    city: checkoutData.city,
                    state: checkoutData.state,
                    zip: checkoutData.zip
                },
                delivery_notes: 'Please deliver as soon as possible',
                payment_method: checkoutData.paymentMethod,
                total_amount: cartTotal
            };
            
            // Place order via API
            const response = await apiService.orders.createOrder(orderData);
            
            if (response && response.data) {
                // Clear the cart after successful order placement
                clearCart();
                
                Alert.alert(
                    'Order Placed Successfully!',
                    `Thank you for your order. Your order ID is #${response.data.id}. You will receive a confirmation email shortly.`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Reset form and navigate to home
                                setCheckoutData({
                                    fullName: '',
                                    phone: '',
                                    address: '',
                                    city: '',
                                    state: '',
                                    zip: '',
                                    saveAddress: false,
                                    paymentMethod: 'card',
                                    cardholderName: '',
                                    cardNumber: '',
                                    expiry: '',
                                    cvv: '',
                                    saveCard: false,
                                });
                                setCurrentStep(1);
                                // Navigate to home screen after successful order
                                navigation.navigate('CustomerTabs', { screen: 'Home' });
                            }
                        }
                    ]
                );
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            Alert.alert(
                'Order Failed',
                `Failed to place order: ${error.message || 'Unknown error occurred'}`
            );
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <ShippingAddressForm
                        formData={checkoutData}
                        onFormDataChange={handleFormDataChange}
                        onNext={handleNext}
                    />
                );
            case 2:
                return (
                    <PaymentMethodForm
                        formData={checkoutData}
                        onFormDataChange={handleFormDataChange}
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                );
            case 3:
                return (
                    <OrderReview
                        formData={checkoutData}
                        onBack={handleBack}
                        onPlaceOrder={handlePlaceOrder}
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <CheckoutHeader
                currentStep={currentStep}
                onStepPress={handleStepChange}
                onBack={handleBack}
            />
            
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={true}
                bounces={false}
                nestedScrollEnabled={true}
            >
                {renderCurrentStep()}
            </ScrollView>
            
            <View style={styles.bottomNavbarContainer}>
                <CustomerBottomNavbar
                    activeTab="Cart" // Show cart as active since we're in checkout
                    onTabPress={(tab) => {
                        if (tab !== 'Checkout') { // Don't allow navigation away from checkout
                            navigation.navigate(tab);
                        }
                    }}
                />
            </View>
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
    contentContainer: {
        paddingBottom: 24, // Space for content
    },
    bottomNavbarContainer: {
        position: 'relative',
        zIndex: 10,
    },
});

export default CheckoutScreen;