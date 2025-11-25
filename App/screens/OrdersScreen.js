import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([
    { 
      id: 'ORD-001', 
      date: '2023-06-15', 
      status: 'Delivered', 
      amount: '₹2,499',
      items: 3,
      deliverySlot: 'Today, 2:00 PM - 4:00 PM'
    },
    { 
      id: 'ORD-002', 
      date: '2023-06-10', 
      status: 'Out for Delivery', 
      amount: '₹1,299',
      items: 2,
      deliverySlot: 'Tomorrow, 10:00 AM - 12:00 PM'
    },
    { 
      id: 'ORD-003', 
      date: '2023-06-05', 
      status: 'Processing', 
      amount: '₹3,999',
      items: 5,
      deliverySlot: 'June 18, 2:00 PM - 4:00 PM'
    },
    { 
      id: 'ORD-004', 
      date: '2023-05-28', 
      status: 'Delivered', 
      amount: '₹899',
      items: 1,
      deliverySlot: 'May 30, 4:00 PM - 6:00 PM'
    },
  ]);
  
  const navigation = useNavigation();

  const handleTrackOrder = (orderId) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  const handleSelectSlot = (orderId) => {
    // Check if the order is eligible for slot selection
    const order = orders.find(o => o.id === orderId);
    if (order && (order.status === 'Processing' || order.status === 'Slot Selected')) {
      navigation.navigate('SlotSelection', { orderId });
    } else {
      Alert.alert('Slot Selection Unavailable', 'Slot selection is only available for orders with "Processing" or "Slot Selected" status.');
    }
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

  const renderOrder = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <Text style={[styles.status, getStatusStyle(order.status)]}>{order.status}</Text>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderDate}>{order.date}</Text>
        <Text style={styles.orderAmount}>{order.amount}</Text>
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderItems}>{order.items} items</Text>
        <Text style={styles.deliverySlot}>Slot: {order.deliverySlot}</Text>
      </View>
      
      <View style={styles.orderActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleTrackOrder(order.id)}
        >
          <Text style={styles.actionButtonText}>Track</Text>
        </TouchableOpacity>
        
        {(order.status === 'Processing' || order.status === 'Slot Selected') && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.selectSlotButton]} 
            onPress={() => handleSelectSlot(order.id)}
          >
            <Text style={styles.actionButtonText}>Change Slot</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      
      <View style={styles.ordersList}>
        {orders.length > 0 ? (
          orders.map(renderOrder)
        ) : (
          <Text style={styles.noOrdersText}>No orders found</Text>
        )}
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
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  slotSelectedStatus: {
    backgroundColor: '#FFEAA7',
    color: '#D35400',
  },
  processingStatus: {
    backgroundColor: '#74B9FF',
    color: '#0984E3',
  },
  outForDeliveryStatus: {
    backgroundColor: '#00B894',
    color: '#00A085',
  },
  deliveredStatus: {
    backgroundColor: '#00B894',
    color: '#00A085',
  },
  defaultStatus: {
    backgroundColor: '#DDDDDD',
    color: '#666666',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  orderInfo: {
    marginBottom: 15,
  },
  orderItems: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  deliverySlot: {
    fontSize: 14,
    color: '#007AFF',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  selectSlotButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noOrdersText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 50,
  },
});

export default OrdersScreen;