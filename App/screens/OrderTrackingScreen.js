import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderTrackingScreen = () => {
  const [order, setOrder] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};

  // Mock order data - in a real app, this would come from an API
  useEffect(() => {
    if (orderId) {
      // Simulate API call
      const mockOrder = {
        id: orderId,
        customerName: 'John Doe',
        customerPhone: '9876543210',
        deliveryAddress: '123 Main Street, Bangalore, Karnataka 560001',
        orderValue: '₹2,499',
        orderDescription: 'Electronics package',
        status: 'Out for Delivery',
        selectedSlot: 'Today, 2:00 PM - 4:00 PM',
        assignedDriver: 'Raj Kumar',
        driverPhone: '9876543211',
        driverVehicle: 'KA-01-AB-1234',
        estimatedDelivery: '30 mins',
        statusHistory: [
          { status: 'Order Placed', timestamp: '2023-06-15 10:30 AM', location: 'Warehouse' },
          { status: 'Processing', timestamp: '2023-06-15 11:15 AM', location: 'Sorting Facility' },
          { status: 'Slot Selected', timestamp: '2023-06-15 12:00 PM', location: 'Customer' },
          { status: 'Out for Delivery', timestamp: '2023-06-15 1:45 PM', location: 'Delivery Hub' },
        ]
      };
      setOrder(mockOrder);
    }
  }, [orderId]);

  const handleSelectSlot = () => {
    navigation.navigate('SlotSelection', { orderId });
  };

  const handleContactDriver = () => {
    Alert.alert('Contact Driver', `Call ${order.assignedDriver} at ${order.driverPhone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => {/* In a real app, this would initiate a phone call */} }
    ]);
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
      <Text style={styles.title}>Order Tracking</Text>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>{order.id}</Text>
        <Text style={styles.orderValue}>{order.orderValue}</Text>
        <Text style={styles.orderDescription}>{order.orderDescription}</Text>
      </View>
      
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
        
        {order.estimatedDelivery && (
          <Text style={styles.estimatedDelivery}>
            Estimated delivery: {order.estimatedDelivery}
          </Text>
        )}
        
        <View style={styles.statusActions}>
          {order.status === 'Slot Selected' && (
            <TouchableOpacity style={styles.actionButton} onPress={handleSelectSlot}>
              <Text style={styles.actionButtonText}>Change Slot</Text>
            </TouchableOpacity>
          )}
          
          {order.assignedDriver && (
            <TouchableOpacity style={[styles.actionButton, styles.contactButton]} onPress={handleContactDriver}>
              <Text style={styles.actionButtonText}>Contact Driver</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.driverSection}>
        <Text style={styles.sectionTitle}>Delivery Information</Text>
        {order.assignedDriver ? (
          <>
            <Text style={styles.driverInfo}>Driver: {order.assignedDriver}</Text>
            <Text style={styles.driverInfo}>Vehicle: {order.driverVehicle}</Text>
            <Text style={styles.driverInfo}>Slot: {order.selectedSlot}</Text>
          </>
        ) : (
          <Text style={styles.noDriver}>Driver will be assigned soon</Text>
        )}
      </View>
      
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Status History</Text>
        {order.statusHistory.map((historyItem, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyStatus}>{historyItem.status}</Text>
              <Text style={styles.historyTime}>{historyItem.timestamp}</Text>
            </View>
            <Text style={styles.historyLocation}>{historyItem.location}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Slot Selected':
      return styles.slotSelectedStatus;
    case 'Processing':
      return styles.processingStatus;
    case 'Out for Delivery':
      return styles.outForDeliveryStatus;
    case 'Delivered':
      return styles.deliveredStatus;
    default:
      return styles.defaultStatus;
  }
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
  orderInfo: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 10,
  },
  orderDescription: {
    fontSize: 16,
    color: '#666',
  },
  statusSection: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  slotSelectedStatus: {
    backgroundColor: '#FFEAA7',
  },
  processingStatus: {
    backgroundColor: '#74B9FF',
  },
  outForDeliveryStatus: {
    backgroundColor: '#00B894',
  },
  deliveredStatus: {
    backgroundColor: '#00B894',
  },
  defaultStatus: {
    backgroundColor: '#DDDDDD',
  },
  estimatedDelivery: {
    fontSize: 16,
    color: '#00B894',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  contactButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  driverSection: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  noDriver: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  historySection: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
    marginBottom: 15,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  historyStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
  },
  historyLocation: {
    fontSize: 14,
    color: '#999',
  },
});

export default OrderTrackingScreen;