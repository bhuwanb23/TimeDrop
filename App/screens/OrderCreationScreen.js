import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
      <Text style={styles.sectionTitle}>Order Information</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Order ID (e.g., ORD-001)"
        value={orderDetails.orderId}
        onChangeText={(value) => handleInputChange('orderId', value)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Order Value (₹)"
        value={orderDetails.orderValue}
        onChangeText={(value) => handleInputChange('orderValue', value)}
        keyboardType="numeric"
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Order Description"
        value={orderDetails.orderDescription}
        onChangeText={(value) => handleInputChange('orderDescription', value)}
        multiline
        numberOfLines={3}
      />
    </View>
  );

  const renderCustomerInfo = () => (
    <View>
      <Text style={styles.sectionTitle}>Customer Information</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={orderDetails.customerName}
        onChangeText={(value) => handleInputChange('customerName', value)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Customer Phone"
        value={orderDetails.customerPhone}
        onChangeText={(value) => handleInputChange('customerPhone', value)}
        keyboardType="phone-pad"
      />
    </View>
  );

  const renderAddressInfo = () => (
    <View>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      
      <TouchableOpacity style={styles.locationButton} onPress={handleGetCurrentLocation}>
        <Text style={styles.locationButtonText}>📍 Use Current Location</Text>
      </TouchableOpacity>
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Delivery Address"
        value={orderDetails.deliveryAddress}
        onChangeText={(value) => handleInputChange('deliveryAddress', value)}
        multiline
        numberOfLines={3}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Landmark (Optional)"
        value={orderDetails.landmark}
        onChangeText={(value) => handleInputChange('landmark', value)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        value={orderDetails.pincode}
        onChangeText={(value) => handleInputChange('pincode', value)}
        keyboardType="numeric"
      />
      
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="City"
          value={orderDetails.city}
          onChangeText={(value) => handleInputChange('city', value)}
        />
        
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="State"
          value={orderDetails.state}
          onChangeText={(value) => handleInputChange('state', value)}
        />
      </View>
    </View>
  );

  const renderOrderSummary = () => (
    <View>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      
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
    <View style={styles.container}>
      <Text style={styles.title}>Create New Order</Text>
      
      {renderStepIndicator()}
      {renderProgressBar()}
      
      <ScrollView style={styles.formContainer}>
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
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 4 ? (
          <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreateOrder}>
            <Text style={styles.buttonText}>Create Order</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  stepIndicator: {
    backgroundColor: '#007AFF',
    padding: 15,
    alignItems: 'center',
  },
  stepIndicatorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
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
    backgroundColor: '#007AFF',
  },
  progressStepInactive: {
    backgroundColor: '#ddd',
  },
  progressStepText: {
    fontWeight: 'bold',
  },
  progressStepTextActive: {
    color: '#fff',
  },
  progressStepTextInactive: {
    color: '#666',
  },
  progressConnector: {
    width: 30,
    height: 2,
  },
  progressConnectorActive: {
    backgroundColor: '#007AFF',
  },
  progressConnectorInactive: {
    backgroundColor: '#ddd',
  },
  formContainer: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: '#007AFF',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  locationButton: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  locationButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    flex: 0.6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flex: 0.3,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#6c757d',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  createButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrderCreationScreen;