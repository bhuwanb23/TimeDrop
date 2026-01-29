import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { navigate } from '../utils/RootNavigation';
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

    const handlePlaceOrder = () => {
        // Validate all required data before placing order
        if (!checkoutData.fullName || !checkoutData.cardholderName) {
            Alert.alert('Missing Information', 'Please complete all required fields');
            return;
        }

        Alert.alert(
            'Order Placed Successfully!',
            'Thank you for your order. You will receive a confirmation email shortly.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Reset form and navigate to home or orders screen
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
                        navigation.navigate('Cart'); // Navigate back to cart screen
                    }
                }
            ]
        );
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