import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.m,
  },
  actionButton: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: BORDER_RADIUS.small,
    ...SHADOW,
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.bold,
  },
  disabledButtonText: {
    color: COLORS.textLight,
  },
  notificationsList: {
    flex: 1,
    padding: SPACING.m,
    paddingTop: 0,
  },
  notificationCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    ...SHADOW,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: SPACING.s,
  },
  notificationTitleContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  unreadTitle: {
    color: COLORS.primary,
  },
  notificationTime: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  notificationMessage: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  successNotification: {
    borderLeftColor: COLORS.secondary,
  },
  infoNotification: {
    borderLeftColor: COLORS.primary,
  },
  promotionNotification: {
    borderLeftColor: COLORS.accent,
  },
  defaultNotification: {
    borderLeftColor: COLORS.grayDark,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
});

export default NotificationsScreen;