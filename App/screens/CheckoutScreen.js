import React, { useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import CheckoutHeader from '../components/CheckoutHeader';
import ShippingAddressForm from '../components/ShippingAddressForm';
import PaymentMethodForm from '../components/PaymentMethodForm';
import OrderReview from '../components/OrderReview';

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
            // Navigate back to cart or previous screen
            navigation.goBack();
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
                        navigation.navigate('Home'); // or 'Orders' screen
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
        <View style={styles.container}>
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
            >
                {renderCurrentStep()}
            </ScrollView>
        </View>
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
});

export default CheckoutScreen;