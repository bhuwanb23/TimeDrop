import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

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
        return 'time-outline';
      case 'Processing':
        return 'construct-outline';
      case 'Out for Delivery':
        return 'car-outline';
      case 'Delivered':
        return 'checkmark-circle-outline';
      default:
        return 'clipboard-outline';
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
          <View style={[styles.status, getStatusStyle(order.status)]}>
            <Icon name={getStatusIcon(order.status)} size={12} color={COLORS.textInverted} style={styles.statusIcon} />
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.customerName}>{order.customerName}</Text>
        <Text style={styles.orderAmount}>{order.amount}</Text>
      </View>
      
      <View style={styles.orderMeta}>
        <View style={styles.metaItem}>
          <Icon name="cube-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.orderItems}>{order.items} items</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="time-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.deliverySlot}>{order.deliverySlot}</Text>
        </View>
      </View>
      
      <View style={styles.orderActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleTrackOrder(order.id)}
        >
          <Icon name="location-outline" size={16} color={COLORS.textInverted} />
          <Text style={styles.actionButtonText}>Track</Text>
        </TouchableOpacity>
        
        {(order.status === 'Processing' || order.status === 'Slot Selected') && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.selectSlotButton]} 
            onPress={() => handleSelectSlot(order.id)}
          >
            <Icon name="time-outline" size={16} color={COLORS.textInverted} />
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
            <Icon name="checkmark-circle-outline" size={24} color={COLORS.secondary} />
            <Text style={styles.statusCount}>{statusCounts['Delivered']}</Text>
            <Text style={styles.statusLabel}>Delivered</Text>
          </View>
          <View style={styles.statusItem}>
            <Icon name="car-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statusCount}>{statusCounts['Out for Delivery']}</Text>
            <Text style={styles.statusLabel}>Out</Text>
          </View>
          <View style={styles.statusItem}>
            <Icon name="construct-outline" size={24} color={COLORS.primaryLight} />
            <Text style={styles.statusCount}>{statusCounts['Processing']}</Text>
            <Text style={styles.statusLabel}>Processing</Text>
          </View>
          <View style={styles.statusItem}>
            <Icon name="time-outline" size={24} color={COLORS.accentLight} />
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
            <Icon name="clipboard-outline" size={60} color={COLORS.gray} />
            <Text style={styles.emptyStateText}>No orders found</Text>
            <Text style={styles.emptyStateSubtext}>Create your first order to get started</Text>
            <TouchableOpacity 
              style={styles.createOrderButton} 
              onPress={() => navigation.navigate('OrderCreation')}
            >
              <Icon name="add-outline" size={20} color={COLORS.textInverted} />
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
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    paddingTop: 50,
    borderBottomLeftRadius: BORDER_RADIUS.large,
    borderBottomRightRadius: BORDER_RADIUS.large,
  },
  title: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textInverted,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textInverted,
    opacity: 0.8,
    marginTop: SPACING.s,
  },
  statusSummary: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  statusItem: {
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    borderRightWidth: 1,
    borderRightColor: COLORS.grayLight,
    minWidth: 80,
  },
  statusCount: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.s,
  },
  statusLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
  ordersList: {
    flex: 1,
    padding: SPACING.m,
    paddingTop: 0,
  },
  orderCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    ...SHADOW,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  statusIcon: {
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textInverted,
  },
  slotSelectedStatus: {
    backgroundColor: COLORS.accentLight,
  },
  processingStatus: {
    backgroundColor: COLORS.primaryLight,
  },
  outForDeliveryStatus: {
    backgroundColor: COLORS.secondary,
  },
  deliveredStatus: {
    backgroundColor: COLORS.secondary,
  },
  defaultStatus: {
    backgroundColor: COLORS.gray,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  customerName: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
  },
  orderAmount: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
  },
  orderMeta: {
    marginBottom: SPACING.m,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  orderItems: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.s,
  },
  deliverySlot: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.s,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
    marginLeft: SPACING.s,
  },
  selectSlotButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: SPACING.s,
    marginTop: SPACING.m,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  createOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.small,
  },
  createOrderButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.s,
  },
});

export default OrdersScreen;