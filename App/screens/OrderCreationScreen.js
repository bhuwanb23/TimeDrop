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
  
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setOrderDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateOrder = () => {
    // Validation
    const requiredFields = ['orderId', 'customerName', 'customerPhone', 'deliveryAddress', 'pincode'];
    for (const field of requiredFields) {
      if (!orderDetails[field]) {
        Alert.alert('Error', `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return;
      }
    }

    if (orderDetails.customerPhone.length !== 10 || !/^\d+$/.test(orderDetails.customerPhone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (orderDetails.pincode.length !== 6 || !/^\d+$/.test(orderDetails.pincode)) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      return;
    }

    // Here we would normally make an API call to create the order
    // For now, we'll just show a success message and navigate back
    Alert.alert('Success', 'Order created successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('CustomerHome') }
    ]);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Order</Text>
      
      <View style={styles.form}>
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
        
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        
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
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.createButton]} onPress={handleCreateOrder}>
            <Text style={styles.buttonText}>Create Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
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
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 0.48,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  createButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderCreationScreen;