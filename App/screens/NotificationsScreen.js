import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Confirmed',
      message: 'Your order ORD-001 has been confirmed and is being processed.',
      time: '2 hours ago',
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'Delivery Slot Selected',
      message: 'You have selected a delivery slot for order ORD-002.',
      time: '1 day ago',
      type: 'info',
      read: true
    },
    {
      id: 3,
      title: 'Out for Delivery',
      message: 'Your order ORD-003 is out for delivery. Driver Raj Kumar will arrive in 30 minutes.',
      time: '2 days ago',
      type: 'info',
      read: true
    },
    {
      id: 4,
      title: 'Order Delivered',
      message: 'Your order ORD-004 has been successfully delivered.',
      time: '3 days ago',
      type: 'success',
      read: true
    },
    {
      id: 5,
      title: 'Special Offer',
      message: 'Get 20% off on your next order! Use code SAVE20.',
      time: '1 week ago',
      type: 'promotion',
      read: true
    }
  ]);
  
  const navigation = useNavigation();

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    Alert.alert('Success', 'All notifications marked as read');
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => setNotifications([]) }
      ]
    );
  };

  const handleNotificationPress = (notification) => {
    // Mark as read when pressed
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    
    // Navigate based on notification type
    if (notification.title.includes('Order')) {
      const orderId = notification.message.match(/ORD-\d+/)?.[0] || 'ORD-001';
      navigation.navigate('OrderTracking', { orderId });
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return styles.successNotification;
      case 'info':
        return styles.infoNotification;
      case 'promotion':
        return styles.promotionNotification;
      default:
        return styles.defaultNotification;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      case 'promotion':
        return '🎉';
      default:
        return '🔔';
    }
  };

  const renderNotification = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        getNotificationStyle(notification.type),
        !notification.read && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationIcon}>
          {getNotificationIcon(notification.type)}
        </Text>
        <View style={styles.notificationTitleContainer}>
          <Text style={[
            styles.notificationTitle,
            !notification.read && styles.unreadTitle
          ]}>
            {notification.title}
          </Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
      </View>
      <Text style={styles.notificationMessage}>{notification.message}</Text>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>{unreadCount} unread notifications</Text>
      </View>
      
      {notifications.length > 0 ? (
        <>
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Text style={[
                styles.actionButtonText,
                unreadCount === 0 && styles.disabledButtonText
              ]}>
                Mark All Read
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleClearAll}>
              <Text style={styles.actionButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.notificationsList}>
            {notifications.map(renderNotification)}
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No notifications</Text>
          <Text style={styles.emptyStateSubtext}>You're all caught up!</Text>
        </View>
      )}
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#ccc',
  },
  notificationsList: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  notificationCard: {
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
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  notificationTitleContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  unreadTitle: {
    color: '#007AFF',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  successNotification: {
    borderLeftColor: '#34C759',
  },
  infoNotification: {
    borderLeftColor: '#007AFF',
  },
  promotionNotification: {
    borderLeftColor: '#FF9500',
  },
  defaultNotification: {
    borderLeftColor: '#6c757d',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationsScreen;