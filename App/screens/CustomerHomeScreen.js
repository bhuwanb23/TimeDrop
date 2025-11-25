import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOrder } from '../context/OrderContext';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

const CustomerHomeScreen = () => {
  const [userName, setUserName] = useState('John Doe');
  const { orders, loading, error } = useOrder();
  const [activeOrders, setActiveOrders] = useState([
    { 
      id: 'ORD-001', 
      status: 'Slot Selected', 
      deliveryTime: 'Today, 2:00 PM - 4:00 PM',
      items: 3,
      amount: '₹2,499'
    },
    { 
      id: 'ORD-002', 
      status: 'Processing', 
      deliveryTime: 'Tomorrow, 10:00 AM - 12:00 PM',
      items: 2,
      amount: '₹1,299'
    },
    { 
      id: 'ORD-003', 
      status: 'Out for Delivery', 
      deliveryTime: 'Today, 4:00 PM - 6:00 PM',
      items: 1,
      amount: '₹899'
    },
  ]);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Confirmed',
      message: 'Your order ORD-001 has been confirmed.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'Out for Delivery',
      message: 'Your order ORD-003 is on the way.',
      time: '30 mins ago',
      read: false
    }
  ]);
  
  const navigation = useNavigation();

  // Example of how to use the order context
  useEffect(() => {
    // In a real app, this would fetch orders from an API
    // For now, we'll just log the orders from context
    console.log('Orders from context:', orders);
  }, [orders]);

  const handleNewOrder = () => {
    navigation.navigate('OrderCreation');
  };

  const handleTrackOrder = (orderId) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  const handleSelectSlot = (orderId) => {
    navigation.navigate('SlotSelection', { orderId });
  };

  const handleViewAllOrders = () => {
    navigation.navigate('Orders');
  };

  const handleViewAllNotifications = () => {
    navigation.navigate('Notifications');
  };

  const renderActiveOrder = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderAmount}>{order.amount}</Text>
        </View>
        <Text style={[styles.status, getStatusStyle(order.status)]}>{order.status}</Text>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderItems}>{order.items} items</Text>
        <Text style={styles.deliveryTime}>🕒 {order.deliveryTime}</Text>
      </View>
      
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
        {order.status === 'Processing' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.selectSlotButton]} 
            onPress={() => handleSelectSlot(order.id)}
          >
            <Text style={styles.actionButtonText}>Select Slot</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderNotification = (notification) => (
    <TouchableOpacity 
      key={notification.id} 
      style={styles.notificationItem}
      onPress={handleViewAllNotifications}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle} numberOfLines={1}>{notification.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={1}>{notification.message}</Text>
      </View>
      <Text style={styles.notificationTime}>{notification.time}</Text>
    </TouchableOpacity>
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

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <ScrollView style={styles.container}>
      {/* Header with greeting and profile */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileIcon} 
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>₹24,500</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>On-Time</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={handleNewOrder}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>+</Text>
          </View>
          <Text style={styles.actionTitle}>New Order</Text>
          <Text style={styles.actionSubtitle}>Create a new delivery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Orders')}>
          <View style={[styles.iconCircle, styles.trackIcon]}>
            <Text style={styles.iconText}>🔍</Text>
          </View>
          <Text style={styles.actionTitle}>Track Orders</Text>
          <Text style={styles.actionSubtitle}>View all deliveries</Text>
        </TouchableOpacity>
      </View>

      {/* Active Orders Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          <TouchableOpacity onPress={handleViewAllOrders}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={styles.loadingText}>Loading orders...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error loading orders: {error}</Text>
        ) : activeOrders.length > 0 ? (
          activeOrders.map(renderActiveOrder)
        ) : (
          <Text style={styles.noOrdersText}>No active orders</Text>
        )}
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <TouchableOpacity onPress={handleViewAllNotifications}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {notifications.length > 0 ? (
          <>
            {notifications.slice(0, 2).map(renderNotification)}
            {unreadNotifications > 0 && (
              <View style={styles.unreadIndicator}>
                <Text style={styles.unreadCount}>{unreadNotifications} unread</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noNotificationsText}>No notifications</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    paddingTop: 50,
    borderBottomLeftRadius: BORDER_RADIUS.large,
    borderBottomRightRadius: BORDER_RADIUS.large,
  },
  greetingContainer: {
    flex: 1,
  },
  welcomeText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
  },
  userName: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
    marginTop: SPACING.s,
  },
  profileIcon: {
    padding: SPACING.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.textInverted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: TYPOGRAPHY.bold,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: SPACING.m,
    marginTop: -25,
  },
  statBox: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
    ...SHADOW,
  },
  statNumber: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: SPACING.m,
    marginBottom: SPACING.s,
  },
  actionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.l,
    alignItems: 'center',
    flex: 0.48,
    ...SHADOW,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  trackIcon: {
    backgroundColor: COLORS.secondary,
  },
  iconText: {
    color: COLORS.textInverted,
    fontSize: 24,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  actionSubtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    ...SHADOW,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.s,
  },
  badgeText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.bold,
  },
  orderCard: {
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  orderId: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  orderAmount: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.bold,
    marginTop: SPACING.xs,
  },
  orderDetails: {
    marginBottom: SPACING.m,
  },
  orderItems: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  deliveryTime: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  status: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  slotSelectedStatus: {
    backgroundColor: COLORS.accentLight,
    color: COLORS.accentDark,
  },
  processingStatus: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
  },
  outForDeliveryStatus: {
    backgroundColor: COLORS.secondary,
    color: COLORS.secondaryDark,
  },
  deliveredStatus: {
    backgroundColor: COLORS.secondary,
    color: COLORS.secondaryDark,
  },
  defaultStatus: {
    backgroundColor: COLORS.gray,
    color: COLORS.textSecondary,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
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
    fontWeight: TYPOGRAPHY.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.l,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: SPACING.s,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  newOrderButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
  },
  newOrderButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
  },
  notificationsList: {
    marginTop: SPACING.s,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  notificationMessage: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  notificationTime: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  emptyNotifications: {
    paddingVertical: SPACING.m,
    alignItems: 'center',
  },
  emptyNotificationsText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  promoBanner: {
    backgroundColor: COLORS.accent,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textInverted,
    marginBottom: SPACING.s,
  },
  promoText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textInverted,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  promoButton: {
    backgroundColor: COLORS.textInverted,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
  },
  promoButtonText: {
    color: COLORS.accent,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
  },
  unreadIndicator: {
    marginTop: SPACING.s,
    padding: SPACING.s,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
  },
  unreadCount: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    padding: SPACING.m,
  },
  errorText: {
    textAlign: 'center',
    color: COLORS.error,
    padding: SPACING.m,
  },
  noOrdersText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    padding: SPACING.m,
  },
  noNotificationsText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    padding: SPACING.m,
  },
});

export default CustomerHomeScreen;