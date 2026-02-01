import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

const ShippingAddressForm = ({ formData, onFormDataChange, onNext }) => {
    const [errors, setErrors] = useState({});

    // Cart context
    const { items: cartItems, totalAmount: cartTotal, totalItems: cartItemCount } = useCart();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName?.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.phone?.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.address?.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city?.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.state?.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formData.zip?.trim()) {
            newErrors.zip = 'ZIP code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
            newErrors.zip = 'Please enter a valid ZIP code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
    };

    const handleInputChange = (field, value) => {
        onFormDataChange({ ...formData, [field]: value });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>

            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={[styles.input, errors.fullName && styles.inputError]}
                        placeholder="e.g. Johnathan Doe"
                        value={formData.fullName}
                        onChangeText={(value) => handleInputChange('fullName', value)}
                        placeholderTextColor="#94a3b8"
                    />
                    {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={[styles.input, errors.phone && styles.inputError]}
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        keyboardType="phone-pad"
                        placeholderTextColor="#94a3b8"
                    />
                    {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Street Address</Text>
                    <TextInput
                        style={[styles.input, errors.address && styles.inputError]}
                        placeholder="Street name and house number"
                        value={formData.address}
                        onChangeText={(value) => handleInputChange('address', value)}
                        placeholderTextColor="#94a3b8"
                    />
                    {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={[styles.input, errors.city && styles.inputError]}
                            placeholder="City"
                            value={formData.city}
                            onChangeText={(value) => handleInputChange('city', value)}
                            placeholderTextColor="#94a3b8"
                        />
                        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                    </View>

                    <View style={[styles.inputGroup, styles.halfWidth]}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            style={[styles.input, errors.state && styles.inputError]}
                            placeholder="State"
                            value={formData.state}
                            onChangeText={(value) => handleInputChange('state', value)}
                            placeholderTextColor="#94a3b8"
                        />
                        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>ZIP Code</Text>
                    <TextInput
                        style={[styles.input, errors.zip && styles.inputError]}
                        placeholder="00000"
                        value={formData.zip}
                        onChangeText={(value) => handleInputChange('zip', value)}
                        keyboardType="numeric"
                        maxLength={5}
                        placeholderTextColor="#94a3b8"
                    />
                    {errors.zip && <Text style={styles.errorText}>{errors.zip}</Text>}
                </View>

                <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => handleInputChange('saveAddress', !formData.saveAddress)}
                    >
                        <View style={[styles.checkboxBox, formData.saveAddress && styles.checkboxBoxChecked]}>
                            {formData.saveAddress && <View style={styles.checkboxCheck} />}
                        </View>
                        <Text style={styles.checkboxLabel}>Save this address as default</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.orderSummary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal ({cartItemCount || 0} items)</Text>
                    <Text style={styles.summaryValue}>${cartTotal?.toFixed(2) || '0.00'}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValueFree}>Calculated later</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                    <Text style={styles.summaryTotalValue}>${cartTotal?.toFixed(2) || '0.00'}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>Continue to Payment</Text>
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
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 32,
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
        width: 20,
        height: 20,
        borderRadius: 4,
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
        width: 10,
        height: 10,
        borderRadius: 2,
        backgroundColor: '#ffffff',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
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
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 8,
    },
    buttonContainer: {
        marginBottom: 24,
    },
    nextButton: {
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

export default ShippingAddressForm;