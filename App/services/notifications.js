import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export const requestNotificationPermission = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Get notification token
export const getNotificationToken = async () => {
  try {
    const token = await AsyncStorage.getItem('notificationToken');
    if (token) {
      return token;
    }
    
    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
      projectId: 'YOUR_PROJECT_ID', // Replace with your Expo project ID
    });
    
    await AsyncStorage.setItem('notificationToken', expoPushToken);
    return expoPushToken;
  } catch (error) {
    console.error('Error getting notification token:', error);
    return null;
  }
};

// Schedule a local notification
export const scheduleNotification = async (title, body, trigger = null) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        badge: 1,
      },
      trigger: trigger || {
        seconds: 1, // Show immediately if no trigger specified
      },
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Send an immediate notification
export const sendImmediateNotification = async (title, body) => {
  return await scheduleNotification(title, body);
};

// Send a scheduled notification
export const sendScheduledNotification = async (title, body, date) => {
  const trigger = {
    date,
  };
  
  return await scheduleNotification(title, body, trigger);
};

// Send a repeating notification
export const sendRepeatingNotification = async (title, body, interval) => {
  // interval can be: minute, hour, day, week, month, year
  const trigger = {
    seconds: interval === 'minute' ? 60 :
             interval === 'hour' ? 3600 :
             interval === 'day' ? 86400 :
             interval === 'week' ? 604800 : 60,
    repeats: true,
  };
  
  return await scheduleNotification(title, body, trigger);
};

// Cancel a specific notification
export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

// Handle notification response (when user taps on notification)
export const handleNotificationResponse = (callback) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

// Handle notification received (when app is in foreground)
export const handleNotificationReceived = (callback) => {
  return Notifications.addNotificationReceivedListener(callback);
};

// Notification categories for delivery status alerts
export const sendDeliveryStatusNotification = async (orderId, status) => {
  let title, body;
  
  switch (status) {
    case 'confirmed':
      title = 'Order Confirmed';
      body = `Your order #${orderId} has been confirmed and is being prepared.`;
      break;
    case 'out_for_delivery':
      title = 'Out for Delivery';
      body = `Your order #${orderId} is on its way to you.`;
      break;
    case 'delivered':
      title = 'Order Delivered';
      body = `Your order #${orderId} has been successfully delivered.`;
      break;
    case 'delayed':
      title = 'Delivery Delayed';
      body = `Your order #${orderId} delivery is delayed. We apologize for the inconvenience.`;
      break;
    default:
      title = 'Order Update';
      body = `Your order #${orderId} status has been updated.`;
  }
  
  return await sendImmediateNotification(title, body);
};

// Reminder notification for delivery slots
export const sendSlotReminderNotification = async (slotTime, address) => {
  const title = 'Delivery Slot Reminder';
  const body = `Your delivery is scheduled for ${slotTime} at ${address}. Please be available.`;
  
  // Schedule 30 minutes before the slot
  const reminderTime = new Date(slotTime);
  reminderTime.setMinutes(reminderTime.getMinutes() - 30);
  
  return await sendScheduledNotification(title, body, reminderTime);
};

// In-app notification storage
const IN_APP_NOTIFICATIONS_KEY = 'inAppNotifications';

export const saveInAppNotification = async (notification) => {
  try {
    const notifications = await getInAppNotifications();
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    notifications.unshift(newNotification);
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    await AsyncStorage.setItem(IN_APP_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return newNotification;
  } catch (error) {
    console.error('Error saving in-app notification:', error);
    return null;
  }
};

export const getInAppNotifications = async () => {
  try {
    const notifications = await AsyncStorage.getItem(IN_APP_NOTIFICATIONS_KEY);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Error getting in-app notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notifications = await getInAppNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    await AsyncStorage.setItem(IN_APP_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    return updatedNotifications;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
};

export const deleteInAppNotification = async (notificationId) => {
  try {
    const notifications = await getInAppNotifications();
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    await AsyncStorage.setItem(IN_APP_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    return updatedNotifications;
  } catch (error) {
    console.error('Error deleting in-app notification:', error);
    return null;
  }
};

export const clearAllInAppNotifications = async () => {
  try {
    await AsyncStorage.removeItem(IN_APP_NOTIFICATIONS_KEY);
  } catch (error) {
    console.error('Error clearing in-app notifications:', error);
  }
};

export default {
  requestNotificationPermission,
  getNotificationToken,
  sendImmediateNotification,
  sendScheduledNotification,
  sendRepeatingNotification,
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  handleNotificationResponse,
  handleNotificationReceived,
  sendDeliveryStatusNotification,
  sendSlotReminderNotification,
  saveInAppNotification,
  getInAppNotifications,
  markNotificationAsRead,
  deleteInAppNotification,
  clearAllInAppNotifications,
};