import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([
    { 
      id: 'ORD-001', 
      date: '2023-06-15', 
      status: 'Delivered', 
      amount: '₹2,499',
      items: 3,
      deliverySlot: 'Today, 2:00 PM - 4:00 PM',
      customerName: 'Rahul Mehta'
    },
    { 
      id: 'ORD-002', 
      date: '2023-06-10', 
      status: 'Out for Delivery', 
      amount: '₹1,299',
      items: 2,
      deliverySlot: 'Tomorrow, 10:00 AM - 12:00 PM',
      customerName: 'Priya Sharma'
    },
    { 
      id: 'ORD-003', 
      date: '2023-06-05', 
      status: 'Processing', 
      amount: '₹3,999',
      items: 5,
      deliverySlot: 'June 18, 2:00 PM - 4:00 PM',
      customerName: 'John Doe'
    },
    { 
      id: 'ORD-004', 
      date: '2023-05-28', 
      status: 'Slot Selected', 
      amount: '₹899',
      items: 1,
      deliverySlot: 'May 30, 4:00 PM - 6:00 PM',
      customerName: 'Jane Smith'
    },
    { 
      id: 'ORD-005', 
      date: '2023-05-20', 
      status: 'Delivered', 
      amount: '₹1,599',
      items: 2,
      deliverySlot: 'May 22, 2:00 PM - 4:00 PM',
      customerName: 'Robert Johnson'
    },
  ]);
  
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Slot Selected':
        return '🕒';
      case 'Processing':
        return '⚙️';
      case 'Out for Delivery':
        return '🚚';
      case 'Delivered':
        return '✅';
      default:
        return '📋';
    }
  };

  const renderOrder = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.status, getStatusStyle(order.status)]}>
            {getStatusIcon(order.status)} {order.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <Text style={styles.orderAmount}>{order.amount}</Text>
      </View>
      
      <View style={styles.orderMeta}>
        <Text style={styles.orderItems}>{order.items} items</Text>
        <Text style={styles.deliverySlot}>🕒 {order.deliverySlot}</Text>
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
            <Text style={styles.actionButtonText}>
              {order.status === 'Processing' ? 'Select Slot' : 'Change Slot'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const getStatusCounts = () => {
    const counts = {
      'Delivered': 0,
      'Out for Delivery': 0,
      'Processing': 0,
      'Slot Selected': 0,
      'Other': 0
    };
    
    orders.forEach(order => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      } else {
        counts['Other']++;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>{orders.length} orders in total</Text>
      </View>
      
      {/* Status Summary */}
      <View style={styles.statusSummary}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.statusItem}>
            <Text style={styles.statusCount}>{statusCounts['Delivered']}</Text>
            <Text style={styles.statusLabel}>Delivered</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusCount}>{statusCounts['Out for Delivery']}</Text>
            <Text style={styles.statusLabel}>Out</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusCount}>{statusCounts['Processing']}</Text>
            <Text style={styles.statusLabel}>Processing</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusCount}>{statusCounts['Slot Selected']}</Text>
            <Text style={styles.statusLabel}>Scheduled</Text>
          </View>
        </ScrollView>
      </View>
      
      {/* Orders List */}
      <ScrollView 
        style={styles.ordersList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.length > 0 ? (
          orders.map(renderOrder)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No orders found</Text>
            <Text style={styles.emptyStateSubtext}>Create your first order to get started</Text>
            <TouchableOpacity 
              style={styles.createOrderButton} 
              onPress={() => navigation.navigate('OrderCreation')}
            >
              <Text style={styles.createOrderButtonText}>Create Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 5,
  },
  statusSummary: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  statusCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  ordersList: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
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
  customerName: {
    fontSize: 14,
    color: '#333',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  orderItems: {
    fontSize: 12,
    color: '#666',
  },
  deliverySlot: {
    fontSize: 12,
    color: '#666',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  createOrderButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersScreen;