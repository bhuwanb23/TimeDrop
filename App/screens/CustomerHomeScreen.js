import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomerHomeScreen = () => {
  const [userName, setUserName] = useState('John Doe');
  const [activeOrders, setActiveOrders] = useState([
    { id: 'ORD-001', status: 'Slot Selected', deliveryTime: 'Today, 2:00 PM - 4:00 PM' },
    { id: 'ORD-002', status: 'Processing', deliveryTime: 'Tomorrow, 10:00 AM - 12:00 PM' },
  ]);
  
  const navigation = useNavigation();

  const handleNewOrder = () => {
    navigation.navigate('OrderCreation');
  };

  const handleTrackOrder = (orderId) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  const handleSelectSlot = (orderId) => {
    navigation.navigate('SlotSelection', { orderId });
  };

  const renderActiveOrder = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <Text style={[styles.status, getStatusStyle(order.status)]}>{order.status}</Text>
      </View>
      <Text style={styles.deliveryTime}>{order.deliveryTime}</Text>
      <View style={styles.orderActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleTrackOrder(order.id)}
        >
          <Text style={styles.actionButtonText}>Track</Text>
        </TouchableOpacity>
        {order.status === 'Slot Selected' && (
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.newOrderButton} onPress={handleNewOrder}>
          <Text style={styles.newOrderButtonText}>+ New Order</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Orders</Text>
        {activeOrders.length > 0 ? (
          activeOrders.map(renderActiveOrder)
        ) : (
          <Text style={styles.noOrdersText}>No active orders</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>On-Time</Text>
          </View>
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
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActions: {
    padding: 20,
    backgroundColor: '#fff',
  },
  newOrderButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  newOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
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
    fontSize: 14,
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
  deliveryTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default CustomerHomeScreen;