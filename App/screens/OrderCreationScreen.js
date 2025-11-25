import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

const OrderCreationScreen = () => {
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    pincode: '',
    city: '',
    state: '',
    landmark: '',
    orderValue: '',
    orderDescription: '',
  });
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Order Info, 2: Customer Info, 3: Address, 4: Summary
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setOrderDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!orderDetails.orderId) {
        Alert.alert('Error', 'Please enter Order ID');
        return;
      }
    } else if (currentStep === 2) {
      if (!orderDetails.customerName || !orderDetails.customerPhone) {
        Alert.alert('Error', 'Please fill in all customer information');
        return;
      }
      
      if (orderDetails.customerPhone.length !== 10 || !/^\d+$/.test(orderDetails.customerPhone)) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return;
      }
    } else if (currentStep === 3) {
      if (!orderDetails.deliveryAddress || !orderDetails.pincode) {
        Alert.alert('Error', 'Please fill in delivery address and pincode');
        return;
      }
      
      if (orderDetails.pincode.length !== 6 || !/^\d+$/.test(orderDetails.pincode)) {
        Alert.alert('Error', 'Please enter a valid 6-digit pincode');
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateOrder = () => {
    // Final validation
    Alert.alert(
      'Order Confirmation',
      `Are you sure you want to create order ${orderDetails.orderId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // Here we would normally make an API call to create the order
            // For now, we'll just show a success message and navigate to confirmation
            navigation.navigate('OrderConfirmation', { orderId: orderDetails.orderId });
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Order Creation',
      'Are you sure you want to cancel? All entered information will be lost.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleGetCurrentLocation = () => {
    // In a real app, this would use the device's GPS
    Alert.alert(
      'Location Services',
      'In a real application, this would capture your current GPS location. For this prototype, we\'ll use sample coordinates.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use Sample Location', 
          onPress: () => {
            handleInputChange('deliveryAddress', '123 Main Street, Bangalore');
            handleInputChange('pincode', '560001');
            handleInputChange('city', 'Bangalore');
            handleInputChange('state', 'Karnataka');
          }
        }
      ]
    );
  };

  const renderProgressBar = () => (
    <View style={styles.progressBarContainer}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.progressStepContainer}>
          <View style={[
            styles.progressStep,
            step <= currentStep ? styles.progressStepActive : styles.progressStepInactive
          ]}>
            <Text style={[
              styles.progressStepText,
              step <= currentStep ? styles.progressStepTextActive : styles.progressStepTextInactive
            ]}>
              {step}
            </Text>
          </View>
          {step < 4 && (
            <View style={[
              styles.progressConnector,
              step < currentStep ? styles.progressConnectorActive : styles.progressConnectorInactive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStepIndicator = () => {
    const steps = ['Order Info', 'Customer', 'Address', 'Summary'];
    return (
      <View style={styles.stepIndicator}>
        <Text style={styles.stepIndicatorText}>
          Step {currentStep} of 4: {steps[currentStep - 1]}
        </Text>
      </View>
    );
  };

  const renderOrderInfo = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Icon name="clipboard-outline" size={24} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Order Information</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="pricetag-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Order ID (e.g., ORD-001)"
          value={orderDetails.orderId}
          onChangeText={(value) => handleInputChange('orderId', value)}
          placeholderTextColor={COLORS.textLight}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="cash-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Order Value (₹)"
          value={orderDetails.orderValue}
          onChangeText={(value) => handleInputChange('orderValue', value)}
          keyboardType="numeric"
          placeholderTextColor={COLORS.textLight}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="document-text-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Order Description"
          value={orderDetails.orderDescription}
          onChangeText={(value) => handleInputChange('orderDescription', value)}
          multiline
          numberOfLines={3}
          placeholderTextColor={COLORS.textLight}
        />
      </View>
    </View>
  );

  const renderCustomerInfo = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Icon name="person-outline" size={24} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Customer Information</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Customer Name"
          value={orderDetails.customerName}
          onChangeText={(value) => handleInputChange('customerName', value)}
          placeholderTextColor={COLORS.textLight}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Customer Phone"
          value={orderDetails.customerPhone}
          onChangeText={(value) => handleInputChange('customerPhone', value)}
          keyboardType="phone-pad"
          placeholderTextColor={COLORS.textLight}
        />
      </View>
    </View>
  );

  const renderAddressInfo = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Icon name="location-outline" size={24} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Delivery Address</Text>
      </View>
      
      <TouchableOpacity style={styles.locationButton} onPress={handleGetCurrentLocation}>
        <Icon name="locate-outline" size={20} color={COLORS.primary} />
        <Text style={styles.locationButtonText}>Use Current Location</Text>
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <Icon name="home-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Delivery Address"
          value={orderDetails.deliveryAddress}
          onChangeText={(value) => handleInputChange('deliveryAddress', value)}
          multiline
          numberOfLines={3}
          placeholderTextColor={COLORS.textLight}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="navigate-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Landmark (Optional)"
          value={orderDetails.landmark}
          onChangeText={(value) => handleInputChange('landmark', value)}
          placeholderTextColor={COLORS.textLight}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Pincode"
          value={orderDetails.pincode}
          onChangeText={(value) => handleInputChange('pincode', value)}
          keyboardType="numeric"
          placeholderTextColor={COLORS.textLight}
        />
      </View>
      
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Icon name="business-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={orderDetails.city}
            onChangeText={(value) => handleInputChange('city', value)}
            placeholderTextColor={COLORS.textLight}
          />
        </View>
        
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Icon name="map-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="State"
            value={orderDetails.state}
            onChangeText={(value) => handleInputChange('state', value)}
            placeholderTextColor={COLORS.textLight}
          />
        </View>
      </View>
    </View>
  );

  const renderOrderSummary = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Icon name="receipt-outline" size={24} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Order Summary</Text>
      </View>
      
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Order ID:</Text>
          <Text style={styles.summaryValue}>{orderDetails.orderId || 'Not provided'}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Order Value:</Text>
          <Text style={styles.summaryValue}>{orderDetails.orderValue ? `₹${orderDetails.orderValue}` : 'Not provided'}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Description:</Text>
          <Text style={styles.summaryValue}>{orderDetails.orderDescription || 'Not provided'}</Text>
        </View>
      </View>
      
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Customer:</Text>
          <Text style={styles.summaryValue}>{orderDetails.customerName || 'Not provided'}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phone:</Text>
          <Text style={styles.summaryValue}>{orderDetails.customerPhone || 'Not provided'}</Text>
        </View>
      </View>
      
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Address:</Text>
          <Text style={styles.summaryValue}>{orderDetails.deliveryAddress || 'Not provided'}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Landmark:</Text>
          <Text style={styles.summaryValue}>{orderDetails.landmark || 'None'}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Pincode:</Text>
          <Text style={styles.summaryValue}>{orderDetails.pincode || 'Not provided'}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>City:</Text>
          <Text style={styles.summaryValue}>{orderDetails.city || 'Not provided'}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>State:</Text>
          <Text style={styles.summaryValue}>{orderDetails.state || 'Not provided'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create New Order</Text>
      </View>
      
      {renderStepIndicator()}
      {renderProgressBar()}
      
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
        <View style={styles.form}>
          {currentStep === 1 && renderOrderInfo()}
          {currentStep === 2 && renderCustomerInfo()}
          {currentStep === 3 && renderAddressInfo()}
          {currentStep === 4 && renderOrderSummary()}
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack}>
            <Icon name="arrow-back-outline" size={20} color={COLORS.textInverted} />
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 4 ? (
          <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
            <Icon name="arrow-forward-outline" size={20} color={COLORS.textInverted} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreateOrder}>
            <Icon name="checkmark-circle-outline" size={20} color={COLORS.textInverted} />
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Icon name="close-circle-outline" size={20} color={COLORS.textInverted} />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.m,
    alignItems: 'center',
    ...SHADOW,
  },
  title: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  stepIndicator: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    alignItems: 'center',
  },
  stepIndicatorText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.cardBackground,
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: COLORS.primary,
  },
  progressStepInactive: {
    backgroundColor: COLORS.gray,
  },
  progressStepText: {
    fontWeight: TYPOGRAPHY.bold,
  },
  progressStepTextActive: {
    color: COLORS.textInverted,
  },
  progressStepTextInactive: {
    color: COLORS.textSecondary,
  },
  progressConnector: {
    width: 30,
    height: 2,
  },
  progressConnectorActive: {
    backgroundColor: COLORS.primary,
  },
  progressConnectorInactive: {
    backgroundColor: COLORS.gray,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: SPACING.m,
  },
  form: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
    marginLeft: SPACING.s,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.m,
    paddingHorizontal: SPACING.m,
    ...SHADOW,
  },
  inputIcon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  locationButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  locationButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.s,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOW,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
    textAlign: 'right',
    flex: 0.6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.m,
    backgroundColor: COLORS.cardBackground,
    ...SHADOW,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    flex: 0.3,
  },
  backButton: {
    backgroundColor: COLORS.grayDark,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
  },
  createButton: {
    backgroundColor: COLORS.secondary,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.semiBold,
    marginHorizontal: SPACING.xs,
  },
});

export default OrderCreationScreen;