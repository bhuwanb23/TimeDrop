import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomerHomeScreen = () => {
  const [userName, setUserName] = useState('John Doe');
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
        
        {activeOrders.length > 0 ? (
          activeOrders.map(renderActiveOrder)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No active orders</Text>
            <Text style={styles.emptyStateSubtext}>Create your first order to get started</Text>
            <TouchableOpacity style={styles.newOrderButton} onPress={handleNewOrder}>
              <Text style={styles.newOrderButtonText}>Create Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.notificationsHeader}>
            {unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotifications}</Text>
              </View>
            )}
            <TouchableOpacity onPress={handleViewAllNotifications}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {notifications.length > 0 ? (
          <View style={styles.notificationsList}>
            {notifications.slice(0, 3).map(renderNotification)}
          </View>
        ) : (
          <View style={styles.emptyNotifications}>
            <Text style={styles.emptyNotificationsText}>No new notifications</Text>
          </View>
        )}
      </View>

      {/* Promotional Banner */}
      <View style={styles.promoBanner}>
        <Text style={styles.promoTitle}>Refer & Earn</Text>
        <Text style={styles.promoText}>Get ₹100 for every friend you refer!</Text>
        <TouchableOpacity style={styles.promoButton}>
          <Text style={styles.promoButtonText}>Share Now</Text>
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
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  profileIcon: {
    padding: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: -25,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginBottom: 10,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  trackIcon: {
    backgroundColor: '#34C759',
  },
  iconText: {
    color: '#fff',
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
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
  orderAmount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 3,
  },
  orderDetails: {
    marginBottom: 15,
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
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
    paddingVertical: 30,
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
  newOrderButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  newOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationsList: {
    marginTop: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#666',
  },
  notificationTime: {
    fontSize: 10,
    color: '#999',
  },
  emptyNotifications: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyNotificationsText: {
    fontSize: 14,
    color: '#666',
  },
  promoBanner: {
    backgroundColor: '#FF6B35',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  promoText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  promoButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  promoButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomerHomeScreen;