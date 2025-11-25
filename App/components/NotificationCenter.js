import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getInAppNotifications, markNotificationAsRead, deleteInAppNotification } from '../services/notifications';

const NotificationCenter = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const loadedNotifications = await getInAppNotifications();
      setNotifications(loadedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleNotificationPress = async (notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
      // Refresh notifications
      loadNotifications();
    }
    
    // Show alert with notification details
    Alert.alert(
      notification.title || 'Notification',
      notification.body || 'You have a new notification',
      [
        { text: 'OK' }
      ]
    );
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteInAppNotification(notificationId);
      loadNotifications(); // Refresh the list
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const renderNotification = ({ item }) => (
    <View style={[styles.notificationItem, item.read ? styles.readNotification : styles.unreadNotification]}>
      <TouchableOpacity 
        style={styles.notificationContent}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, item.read ? styles.readTitle : styles.unreadTitle]}>
            {item.title || 'Notification'}
          </Text>
          <Text style={styles.notificationTime}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
        <Text style={[styles.notificationBody, item.read ? styles.readBody : styles.unreadBody]} numberOfLines={2}>
          {item.body || 'You have a new notification'}
        </Text>
        <Text style={styles.notificationDate}>
          {formatDate(item.timestamp)}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteNotification(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
      
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          style={styles.notificationsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  readNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  notificationContent: {
    flex: 1,
    padding: 15,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  readTitle: {
    color: '#333',
  },
  unreadTitle: {
    color: '#000',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 5,
  },
  readBody: {
    color: '#666',
  },
  unreadBody: {
    color: '#333',
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    backgroundColor: '#FF3B30',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default NotificationCenter;