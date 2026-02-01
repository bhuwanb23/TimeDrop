import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const PaymentMethodForm = ({ formData, onFormDataChange, onBack, onNext }) => {
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [errors, setErrors] = useState({});
    
    // Cart context
    const { items: cartItems, totalAmount: cartTotal, totalItems: cartItemCount } = useCart();

    const paymentMethods = [
        {
            id: 'card',
            title: 'Credit/Debit Card',
            subtitle: 'Visa, Mastercard, AMEX',
            icon: 'credit-card',
            color: '#1152d4'
        },
        {
            id: 'wallet',
            title: 'Digital Wallet',
            subtitle: 'Apple Pay, Google Pay, PayPal',
            icon: 'account-balance-wallet',
            color: '#64748b'
        },
        {
            id: 'cod',
            title: 'Cash on Delivery',
            subtitle: 'Pay when you receive your order',
            icon: 'payments',
            color: '#64748b'
        }
    ];

    const validateForm = () => {
        const newErrors = {};
        
        if (selectedMethod === 'card') {
            if (!formData.cardholderName?.trim()) {
                newErrors.cardholderName = 'Cardholder name is required';
            }
            
            if (!formData.cardNumber?.trim()) {
                newErrors.cardNumber = 'Card number is required';
            } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
                newErrors.cardNumber = 'Please enter a valid 16-digit card number';
            }
            
            if (!formData.expiry?.trim()) {
                newErrors.expiry = 'Expiry date is required';
            } else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
                newErrors.expiry = 'Please enter MM/YY format';
            }
            
            if (!formData.cvv?.trim()) {
                newErrors.cvv = 'CVV is required';
            } else if (!/^\d{3,4}$/.test(formData.cvv)) {
                newErrors.cvv = 'Please enter a valid CVV';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
    };

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        onFormDataChange({ ...formData, paymentMethod: methodId });
    };

    const handleInputChange = (field, value) => {
        onFormDataChange({ ...formData, [field]: value });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const formatCardNumber = (text) => {
        const cleaned = text.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/);
        if (match) {
            return match.slice(1).filter(Boolean).join(' ');
        }
        return text;
    };

    const formatExpiry = (text) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Choose Payment Method</Text>
            
            <View style={styles.methodsContainer}>
                {paymentMethods.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[
                            styles.methodCard,
                            selectedMethod === method.id ? styles.methodCardSelected : styles.methodCardUnselected,
                            method.id !== 'card' && styles.methodCardDisabled
                        ]}
                        onPress={() => method.id === 'card' && handleMethodSelect(method.id)}
                        disabled={method.id !== 'card'}
                    >
                        <View style={styles.methodHeader}>
                            <View style={styles.methodInfo}>
                                <View style={[styles.methodIcon, { backgroundColor: `${method.color}10` }]}>
                                    <MaterialIcons 
                                        name={method.icon} 
                                        size={20} 
                                        color={method.color} 
                                    />
                                </View>
                                <View>
                                    <Text style={styles.methodTitle}>{method.title}</Text>
                                    <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                                </View>
                            </View>
                            <View style={[
                                styles.radioButton,
                                selectedMethod === method.id ? styles.radioButtonSelected : styles.radioButtonUnselected
                            ]}>
                                {selectedMethod === method.id && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                        </View>
                        
                        {method.id === 'card' && selectedMethod === 'card' && (
                            <View style={styles.cardForm}>
                                <View style={styles.divider} />
                                
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Cardholder Name</Text>
                                    <TextInput
                                        style={[styles.input, errors.cardholderName && styles.inputError]}
                                        placeholder="e.g. Johnathan Doe"
                                        value={formData.cardholderName}
                                        onChangeText={(value) => handleInputChange('cardholderName', value)}
                                        placeholderTextColor="#94a3b8"
                                    />
                                    {errors.cardholderName && <Text style={styles.errorText}>{errors.cardholderName}</Text>}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Card Number</Text>
                                    <View style={styles.cardNumberContainer}>
                                        <TextInput
                                            style={[styles.input, styles.cardNumberInput, errors.cardNumber && styles.inputError]}
                                            placeholder="0000 0000 0000 0000"
                                            value={formData.cardNumber}
                                            onChangeText={(value) => handleInputChange('cardNumber', formatCardNumber(value))}
                                            keyboardType="numeric"
                                            maxLength={19}
                                            placeholderTextColor="#94a3b8"
                                        />
                                        <View style={styles.cardBrands}>
                                            <View style={styles.cardBrand}>
                                                <Text style={styles.cardBrandText}>VISA</Text>
                                            </View>
                                            <View style={styles.cardBrand}>
                                                <Text style={styles.cardBrandText}>MC</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
                                </View>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, styles.halfWidth]}>
                                        <Text style={styles.label}>Expiry (MM/YY)</Text>
                                        <TextInput
                                            style={[styles.input, errors.expiry && styles.inputError]}
                                            placeholder="MM/YY"
                                            value={formData.expiry}
                                            onChangeText={(value) => handleInputChange('expiry', formatExpiry(value))}
                                            keyboardType="numeric"
                                            maxLength={5}
                                            placeholderTextColor="#94a3b8"
                                        />
                                        {errors.expiry && <Text style={styles.errorText}>{errors.expiry}</Text>}
                                    </View>
                                    
                                    <View style={[styles.inputGroup, styles.halfWidth]}>
                                        <Text style={styles.label}>CVV</Text>
                                        <TextInput
                                            style={[styles.input, errors.cvv && styles.inputError]}
                                            placeholder="***"
                                            value={formData.cvv}
                                            onChangeText={(value) => handleInputChange('cvv', value)}
                                            keyboardType="numeric"
                                            maxLength={4}
                                            secureTextEntry
                                            placeholderTextColor="#94a3b8"
                                        />
                                        {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
                                    </View>
                                </View>

                                <View style={styles.checkboxContainer}>
                                    <TouchableOpacity 
                                        style={styles.checkbox}
                                        onPress={() => handleInputChange('saveCard', !formData.saveCard)}
                                    >
                                        <View style={[styles.checkboxBox, formData.saveCard && styles.checkboxBoxChecked]}>
                                            {formData.saveCard && <View style={styles.checkboxCheck} />}
                                        </View>
                                        <Text style={styles.checkboxLabel}>Save card for future purchases</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.orderSummary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal ({cartItemCount || 0} items)</Text>
                    <Text style={styles.summaryValue}>${cartTotal?.toFixed(2) || '0.00'}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValueFree}>Free</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                    <Text style={styles.summaryTotalValue}>${cartTotal?.toFixed(2) || '0.00'}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={onBack}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>Review Order</Text>
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
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 24,
    },
    methodsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    methodCard: {
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
    },
    methodCardSelected: {
        borderColor: '#1152d4',
        borderWidth: 2,
    },
    methodCardUnselected: {
        opacity: 1,
    },
    methodCardDisabled: {
        opacity: 0.8,
    },
    methodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    methodInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    methodIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    methodTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 2,
    },
    methodSubtitle: {
        fontSize: 12,
        color: '#64748b',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        borderColor: '#1152d4',
    },
    radioButtonUnselected: {
        borderColor: '#cbd5e1',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#1152d4',
    },
    cardForm: {
        marginTop: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
        marginBottom: 8,
    },
    input: {
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#0f172a',
    },
    inputError: {
        borderColor: '#ef4444',
        borderWidth: 2,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    cardNumberContainer: {
        position: 'relative',
    },
    cardNumberInput: {
        paddingRight: 80,
    },
    cardBrands: {
        position: 'absolute',
        right: 12,
        top: 12,
        flexDirection: 'row',
        gap: 4,
    },
    cardBrand: {
        width: 32,
        height: 20,
        backgroundColor: '#f1f5f9',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBrandText: {
        fontSize: 8,
        fontWeight: '700',
        color: '#1152d4',
        fontStyle: 'italic',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfWidth: {
        flex: 1,
    },
    checkboxContainer: {
        paddingTop: 8,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkboxBox: {
        width: 16,
        height: 16,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: '#cbd5e1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxBoxChecked: {
        backgroundColor: '#1152d4',
        borderColor: '#1152d4',
    },
    checkboxCheck: {
        width: 8,
        height: 8,
        borderRadius: 1,
        backgroundColor: '#ffffff',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    orderSummary: {
        backgroundColor: 'rgba(17, 82, 212, 0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0f172a',
    },
    summaryValueFree: {
        fontSize: 14,
        fontWeight: '500',
        color: '#10b981',
    },
    summaryTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
    },
    summaryTotalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1152d4',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    backButton: {
        flex: 1,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    backButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        flex: 2,
        backgroundColor: '#1152d4',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default PaymentMethodForm;