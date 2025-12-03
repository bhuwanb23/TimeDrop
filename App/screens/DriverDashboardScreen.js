import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Linking, Platform, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const DriverDashboardScreen = () => {
  const { session } = useAuth();
  const driverProfile = session?.type === 'driver' ? session.profile : null;
  const [driverInfo, setDriverInfo] = useState({
    name: driverProfile?.name || 'John Driver',
    vehicle: driverProfile?.vehicle || 'DL 01 AB 1234',
    phone: driverProfile?.phone || '9876543215',
  });
  
  // Sample data for demonstration
  const [deliveriesState, setDeliveriesState] = useState([
    {
      id: 1,
      order_id: 'ORD-001',
      customer_name: 'Alice Johnson',
      address: '123 Main St, Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      phone: '9876543210',
      status: 'Assigned to Driver',
      slot_date: '2023-06-15',
      slot_time: '10:00 AM - 12:00 PM'
    },
    {
      id: 2,
      order_id: 'ORD-002',
      customer_name: 'Bob Smith',
      address: '456 Park Ave, Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      phone: '9876543211',
      status: 'Out for Delivery',
      slot_date: '2023-06-15',
      slot_time: '2:00 PM - 4:00 PM'
    },
    {
      id: 3,
      order_id: 'ORD-003',
      customer_name: 'Charlie Brown',
      address: '789 Elm St, Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      phone: '9876543212',
      status: 'Delivered',
      slot_date: '2023-06-15',
      slot_time: '6:00 PM - 8:00 PM'
    }
  ]);
  
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [deliveriesError, setDeliveriesError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Performance metrics with sample data
  const [performanceMetrics, setPerformanceMetrics] = useState({
    onTimeDeliveries: 24,
    totalDeliveries: 30,
    rating: 4.8,
    completedToday: 2
  });
  
  // Earnings summary with sample data
  const [earnings, setEarnings] = useState({
    today: 1200,
    week: 6500,
    month: 24000
  });
  
  const navigation = useNavigation();

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    if (!driverProfile?.id) {
      Alert.alert('Not Authorized', 'Please sign in as a driver to update order status.');
      return;
    }
    try {
      // Update local state instead of making API call for demo
      setDeliveriesState(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
        )
      );
      Alert.alert('Status Updated', `Order updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleNavigate = (delivery) => {
    if (!delivery.lat || !delivery.lng) {
      Alert.alert('Location unavailable', 'No coordinates available for this delivery.');
      return;
    }
    const latLng = `${delivery.lat},${delivery.lng}`;
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${latLng}`,
      android: `geo:${latLng}?q=${latLng}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latLng}`
    });
    Linking.openURL(url).catch(() => {
      Alert.alert('Unable to open maps', 'Please open your maps app manually.');
    });
  };

  const handleContactCustomer = (delivery) => {
    if (!delivery.phone) {
      Alert.alert('No phone number', 'Customer phone number unavailable.');
      return;
    }
    Linking.openURL(`tel:${delivery.phone}`).catch(() => {
      Alert.alert('Unable to place call', 'Please dial the number manually.');
    });
  };
  
  const handleProofOfDelivery = (delivery) => {
    Alert.alert(
      'Proof of Delivery', 
      `Collect proof of delivery for order ${delivery.order_id}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Collect Signature', onPress: () => {/* Placeholder */} },
        { text: 'Take Photo', onPress: () => {/* Placeholder */} }
      ]
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Assigned to Driver':
        return styles.pendingStatus;
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

  const formatSlotWindow = (delivery) => {
    if (delivery.slot_date && delivery.slot_time) {
      return `${delivery.slot_date} • ${delivery.slot_time}`;
    }
    return 'Slot not scheduled';
  };

  const renderDelivery = (delivery) => (
    <View key={delivery.id} style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <Text style={styles.orderId}>Order: {delivery.order_id}</Text>
        <Text style={[styles.statusBadge, getStatusStyle(delivery.status)]}>
          {delivery.status}
        </Text>
      </View>
      
      <Text style={styles.customerName}>{delivery.customer_name}</Text>
      <Text style={styles.address}>{delivery.address}</Text>
      <Text style={styles.slot}>Slot: {formatSlotWindow(delivery)}</Text>
      
      <View style={styles.deliveryActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleNavigate(delivery)}
        >
          <Icon name="navigate-outline" size={14} color={COLORS.textInverted} style={styles.actionIcon} />
          <Text style={styles.actionButtonText}>Navigate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleContactCustomer(delivery)}
        >
          <Icon name="call-outline" size={14} color={COLORS.textInverted} style={styles.actionIcon} />
          <Text style={styles.actionButtonText}>Contact</Text>
        </TouchableOpacity>
        
        {delivery.status === 'Assigned to Driver' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.updateButton]} 
            onPress={() => handleUpdateStatus(delivery.id, 'Out for Delivery')}
          >
            <Icon name="bicycle-outline" size={14} color={COLORS.textInverted} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Start</Text>
          </TouchableOpacity>
        )}
        
        {delivery.status === 'Out for Delivery' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]} 
            onPress={() => handleUpdateStatus(delivery.id, 'Delivered')}
          >
            <Icon name="checkmark-circle-outline" size={14} color={COLORS.textInverted} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Deliver</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const pendingDeliveries = deliveriesState.filter(d => d.status !== 'Delivered');
  const completedDeliveries = deliveriesState.filter(d => d.status === 'Delivered');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />
        }
      >
        {/* Header with driver info */}
        <View style={styles.header}>
          <View style={styles.driverInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{driverInfo.name.charAt(0)}</Text>
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driverInfo.name}</Text>
              <Text style={styles.driverVehicle}>{driverInfo.vehicle}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="person-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Performance Summary Cards - Enhanced design */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Icon name="cash-outline" size={24} color={COLORS.primary} style={styles.summaryIcon} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryValue}>₹{earnings.today}</Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <Icon name="cube-outline" size={24} color={COLORS.success} style={styles.summaryIcon} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryValue}>{performanceMetrics.completedToday}</Text>
              <Text style={styles.summaryLabel}>Delivered</Text>
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            <Icon name="star-outline" size={24} color={COLORS.warning} style={styles.summaryIcon} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryValue}>{performanceMetrics.rating}</Text>
              <Text style={styles.summaryLabel}>Rating</Text>
            </View>
          </View>
        </View>
        
        {/* Quick Actions - Enhanced design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={styles.quickActionIconContainer}>
                <Icon name="location-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.quickActionText}>Update Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <View style={styles.quickActionIconContainer}>
                <Icon name="call-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.quickActionText}>Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Route')}
            >
              <View style={styles.quickActionIconContainer}>
                <Icon name="navigate-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.quickActionText}>Route</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Pending Deliveries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Deliveries</Text>
            <Text style={styles.sectionCount}>{pendingDeliveries.length}</Text>
          </View>
          
          {pendingDeliveries.length > 0 ? (
            pendingDeliveries.map(renderDelivery)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="checkmark-circle-outline" size={36} color={COLORS.success} />
              <Text style={styles.emptyStateText}>No pending deliveries</Text>
              <Text style={styles.emptyStateSubtext}>Great job!</Text>
            </View>
          )}
        </View>
        
        {/* Completed Today */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Completed Today</Text>
            <Text style={styles.sectionCount}>{completedDeliveries.length}</Text>
          </View>
          
          {completedDeliveries.length > 0 ? (
            completedDeliveries.slice(0, 2).map(renderDelivery)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="time-outline" size={36} color={COLORS.textLight} />
              <Text style={styles.emptyStateText}>No deliveries completed</Text>
              <Text style={styles.emptyStateSubtext}>Start delivering</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.s,
    backgroundColor: COLORS.cardBackground,
    ...SHADOW,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.s,
  },
  avatarText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
  },
  driverDetails: {
    justifyContent: 'center',
  },
  driverName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  driverVehicle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  profileButton: {
    padding: SPACING.xs,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.small,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: SPACING.s,
    backgroundColor: COLORS.cardBackground,
    ...SHADOW,
    margin: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.xs,
    flexDirection: 'row',
  },
  summaryIcon: {
    marginRight: SPACING.s,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'left',
  },
  section: {
    margin: SPACING.s,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.s,
    ...SHADOW,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  sectionCount: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.s,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.small,
    marginHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  quickActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  quickActionText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.medium,
    textAlign: 'center',
  },
  deliveryCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.s,
    marginBottom: SPACING.xs,
    ...SHADOW,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  orderId: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.medium,
  },
  pendingStatus: {
    backgroundColor: COLORS.warningLight,
    color: COLORS.warning,
  },
  outForDeliveryStatus: {
    backgroundColor: COLORS.infoLight,
    color: COLORS.info,
  },
  deliveredStatus: {
    backgroundColor: COLORS.successLight,
    color: COLORS.success,
  },
  warningStatus: {
    backgroundColor: COLORS.errorLight,
    color: COLORS.error,
  },
  defaultStatus: {
    backgroundColor: COLORS.grayLight,
    color: COLORS.textSecondary,
  },
  customerName: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  address: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  slot: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.s,
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    marginHorizontal: SPACING.xs,
  },
  actionIcon: {
    marginRight: SPACING.xs,
  },
  actionButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.medium,
  },
  updateButton: {
    backgroundColor: COLORS.secondary,
  },
  completeButton: {
    backgroundColor: COLORS.success,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.m,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.s,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default DriverDashboardScreen;