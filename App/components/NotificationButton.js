import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getInAppNotifications } from '../services/notifications';

const NotificationButton = ({ onPress }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    
    // Set up interval to periodically check for new notifications
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const notifications = await getInAppNotifications();
      const unread = notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name="notifications-outline" size={24} color="#007AFF" />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 10,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NotificationButton;