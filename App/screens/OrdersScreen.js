import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusDisplayOrder = [
  'Delivered',
  'Out for Delivery',
  'Assigned to Driver',
  'Slot Selected',
  'Pending Slot Selection',
  'Customer Not Available',
  'Rescheduled'
];

const normalizeOrder = (order) => ({
  id: order.id,
  orderCode: order.order_id,
  status: order.status,
  createdAt: order.created_at,
  slotDate: order.slot_date,
  slotTime: order.slot_time,
  address: order.address,
  pincode: order.pincode,
  assignedDriverId: order.assigned_driver_id
});

const OrdersScreen = () => {
  const navigation = useNavigation();
  const { session } = useAuth();
  const customerProfile = session?.type === 'customer' ? session.profile : null;

  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState(customerProfile?.phone || '');

  const fetchOrders = useCallback(async (phoneNumber, { showLoader = true } = {}) => {
    const sanitized = (phoneNumber || '').trim();
    if (!sanitized) {
      Alert.alert('Phone number required', 'Please enter a phone number to load orders.');
      setRefreshing(false);
      return;
    }
    if (sanitized.length !== 10) {
      Alert.alert('Invalid phone', 'Phone number must be 10 digits.');
      setRefreshing(false);
      return;
    }

    try {
      if (showLoader) setLoading(true);
      const response = await customerAPI.getOrders(sanitized);
      const list = response.data?.data || [];
      setOrders(list.map(normalizeOrder));
    } catch (error) {
      console.error('Error loading orders:', error);
      const message = error.response?.data?.message || 'Failed to load orders. Please try again.';
      Alert.alert('Error', message);
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (customerProfile?.phone) {
      fetchOrders(customerProfile.phone);
    }
  }, [customerProfile?.phone, fetchOrders]);

  const handleTrackOrder = (orderId) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  const handleSelectSlot = (order) => {
    if (!['Pending Slot Selection', 'Slot Selected', 'Rescheduled'].includes(order.status)) {
      Alert.alert('Slot Selection Unavailable', 'Slot selection is only available for pending or scheduled orders.');
      return;
    }
    navigation.navigate('SlotSelection', { 
      orderId: order.id,
      orderCode: order.orderCode,
      slotDate: order.slotDate,
      slotTime: order.slotTime
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Slot Selected':
        return styles.slotSelectedStatus;
      case 'Pending Slot Selection':
        return styles.processingStatus;
      case 'Assigned to Driver':
        return styles.assignedStatus;
      case 'Out for Delivery':
        return styles.outForDeliveryStatus;
      case 'Delivered':
        return styles.deliveredStatus;
      case 'Customer Not Available':
      case 'Rescheduled':
        return styles.warningStatus;
      default:
        return styles.defaultStatus;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Slot Selected':
        return 'time-outline';
      case 'Pending Slot Selection':
        return 'construct-outline';
      case 'Assigned to Driver':
        return 'swap-horizontal-outline';
      case 'Out for Delivery':
        return 'car-outline';
      case 'Delivered':
        return 'checkmark-circle-outline';
      case 'Customer Not Available':
        return 'alert-circle-outline';
      case 'Rescheduled':
        return 'refresh-outline';
      default:
        return 'clipboard-outline';
    }
  };

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  };

  const formatSlotWindow = (order) => {
    if (order.slotDate && order.slotTime) {
      return `${order.slotDate} • ${order.slotTime}`;
    }
    return 'Slot not scheduled';
  };

  const statusCounts = useMemo(() => {
    const counts = {};
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(phoneInput || customerProfile?.phone, { showLoader: false });
  };

  const renderOrder = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{order.orderCode}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.status, getStatusStyle(order.status)]}>
            <Icon name={getStatusIcon(order.status)} size={12} color={COLORS.textInverted} style={styles.statusIcon} />
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.customerName}>{order.address}</Text>
        <Text style={styles.orderAmount}>{order.slotDate ? 'Scheduled' : 'Pending'}</Text>
      </View>
      
      <View style={styles.orderMeta}>
        <View style={styles.metaItem}>
          <Icon name="time-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.deliverySlot}>{formatSlotWindow(order)}</Text>
        </View>
        {order.assignedDriverId && (
          <View style={styles.metaItem}>
            <Icon name="person-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.orderItems}>Driver #{order.assignedDriverId}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.orderActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleTrackOrder(order.id)}
        >
          <Icon name="location-outline" size={16} color={COLORS.textInverted} />
          <Text style={styles.actionButtonText}>Track</Text>
        </TouchableOpacity>
        
        {['Pending Slot Selection', 'Slot Selected', 'Rescheduled'].includes(order.status) && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.selectSlotButton]} 
            onPress={() => handleSelectSlot(order)}
          >
            <Icon name="time-outline" size={16} color={COLORS.textInverted} />
            <Text style={styles.actionButtonText}>
              {order.status === 'Pending Slot Selection' ? 'Select Slot' : 'Change Slot'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>{orders.length} orders in total</Text>
      </View>

      <View style={styles.lookupCard}>
        <Text style={styles.lookupLabel}>Lookup orders by phone number</Text>
        <View style={styles.lookupRow}>
          <TextInput
            value={phoneInput}
            onChangeText={setPhoneInput}
            keyboardType="number-pad"
            placeholder="Enter 10-digit phone"
            placeholderTextColor={COLORS.textLight}
            style={styles.lookupInput}
            maxLength={10}
          />
          <TouchableOpacity 
            style={styles.lookupButton}
            onPress={() => fetchOrders(phoneInput)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textInverted} size="small" />
            ) : (
              <Text style={styles.lookupButtonText}>Fetch</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.statusSummary}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusDisplayOrder.map((statusKey) => (
            <View key={statusKey} style={styles.statusItem}>
              <Icon name={getStatusIcon(statusKey)} size={24} color={COLORS.primary} />
              <Text style={styles.statusCount}>{statusCounts[statusKey] || 0}</Text>
              <Text style={styles.statusLabel}>{statusKey}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
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
            <Text style={styles.emptyStateSubtext}>Pull to refresh or create a new order</Text>
            <TouchableOpacity 
              style={styles.createOrderButton} 
              onPress={() => navigation.navigate('Create')}
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
  lookupCard: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: SPACING.m,
    marginTop: -SPACING.l,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  lookupLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
  },
  lookupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lookupInput: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    color: COLORS.textPrimary,
    marginRight: SPACING.s,
  },
  lookupButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lookupButtonText: {
    color: COLORS.textInverted,
    fontWeight: TYPOGRAPHY.semiBold,
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
  assignedStatus: {
    backgroundColor: COLORS.secondaryLight,
  },
  outForDeliveryStatus: {
    backgroundColor: COLORS.secondary,
  },
  deliveredStatus: {
    backgroundColor: COLORS.secondary,
  },
  warningStatus: {
    backgroundColor: COLORS.accent,
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