import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderConfirmationScreen = () => {
  const [order, setOrder] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};

  // Mock order data - in a real app, this would come from the created order
  useEffect(() => {
    if (orderId) {
      // Simulate order data
      const mockOrder = {
        id: orderId,
        date: new Date().toLocaleDateString(),
        status: 'Pending Slot Selection',
        customerName: 'John Doe',
        customerPhone: '9876543210',
        deliveryAddress: '123 Main Street, Bangalore, Karnataka 560001',
        orderValue: '₹2,499',
        orderDescription: 'Electronics package',
        estimatedDelivery: '3-5 business days'
      };
      setOrder(mockOrder);
    }
  }, [orderId]);

  const handleSelectSlot = () => {
    navigation.navigate('SlotSelection', { orderId: order.id });
  };

  const handleViewOrders = () => {
    navigation.navigate('Orders');
  };

  const handleCreateAnother = () => {
    navigation.navigate('OrderCreation');
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Loading order details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>Your order has been successfully created</Text>
      </View>

      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
          <Text style={[styles.status, styles.pendingStatus]}>{order.status}</Text>
        </View>
        
        <View style={styles.orderDetails}>
          <Text style={styles.orderDate}>Date: {order.date}</Text>
          <Text style={styles.orderValue}>Total: {order.orderValue}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.customerInfo}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.infoText}>Name: {order.customerName}</Text>
          <Text style={styles.infoText}>Phone: {order.customerPhone}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.deliveryInfo}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <Text style={styles.infoText}>Address: {order.deliveryAddress}</Text>
          <Text style={styles.infoText}>Estimated Delivery: {order.estimatedDelivery}</Text>
        </View>
      </View>

      <View style={styles.nextSteps}>
        <Text style={styles.nextStepsTitle}>Next Steps</Text>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Select a delivery slot for your order</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Driver will be assigned based on your slot</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Track your order in real-time</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSelectSlot}>
          <Text style={styles.buttonText}>Select Delivery Slot</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleViewOrders}>
          <Text style={styles.secondaryButtonText}>View All Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tertiaryButton} onPress={handleCreateAnother}>
          <Text style={styles.tertiaryButtonText}>Create Another Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#34C759',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pendingStatus: {
    backgroundColor: '#74B9FF',
    color: '#0984E3',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  customerInfo: {
    marginBottom: 15,
  },
  deliveryInfo: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  nextSteps: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    marginRight: 15,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  actions: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tertiaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderConfirmationScreen;