import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Linking, Platform, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MapComponent from '../components/MapComponent';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';
import { driverAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const DriverDashboardScreen = () => {
  const { session } = useAuth();
  const driverProfile = session?.type === 'driver' ? session.profile : null;
  const [driverInfo, setDriverInfo] = useState({
    name: driverProfile?.name || 'Driver',
    vehicle: driverProfile?.vehicle || 'Vehicle ID',
    phone: driverProfile?.phone || '—',
  });
  
  const [deliveriesState, setDeliveriesState] = useState([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [deliveriesError, setDeliveriesError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    onTimeDeliveries: 24,
    totalDeliveries: 30,
    rating: 4.8,
    completedToday: 2
  });
  
  // Earnings summary
  const [earnings, setEarnings] = useState({
    today: 1200,
    week: 6500,
    month: 24000
  });
  
  const navigation = useNavigation();
  const fetchDeliveries = useCallback(async () => {
    if (!driverProfile?.id) {
      return;
    }
    try {
      setLoadingDeliveries(true);
      const response = await driverAPI.getDeliveries(driverProfile.id);
      const list = response.data?.data || [];
      setDeliveriesState(list);
      setDeliveriesError(null);
    } catch (error) {
      console.error('Error fetching driver deliveries:', error);
      const message = error.response?.data?.message || 'Unable to load deliveries';
      setDeliveriesError(message);
      Alert.alert('Error', message);
    } finally {
      setLoadingDeliveries(false);
      setRefreshing(false);
    }
  }, [driverProfile?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDeliveries();
  }, [fetchDeliveries]);

  useFocusEffect(
    useCallback(() => {
      if (driverProfile?.id) {
        fetchDeliveries();
      }
    }, [driverProfile?.id, fetchDeliveries])
  );

  useEffect(() => {
    if (driverProfile) {
      setDriverInfo((prev) => ({
        ...prev,
        name: driverProfile.name || prev.name,
        phone: driverProfile.phone || prev.phone,
        vehicle: driverProfile.vehicle || prev.vehicle,
      }));
    }
  }, [driverProfile]);

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    if (!driverProfile?.id) {
      Alert.alert('Not Authorized', 'Please sign in as a driver to update order status.');
      return;
    }
    try {
      await driverAPI.updateOrderStatus(driverProfile.id, deliveryId, newStatus);
      Alert.alert('Status Updated', `Order updated to ${newStatus}`);
      fetchDeliveries();
    } catch (error) {
      console.error('Error updating status:', error);
      const message = error.response?.data?.message || 'Failed to update status';
      Alert.alert('Error', message);
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

  const handleLocationUpdate = async (location) => {
    if (!driverProfile?.id) return;
    try {
      await driverAPI.updateLocation(driverProfile.id, location);
    } catch (error) {
      console.log('Unable to update driver location', error);
    }
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
          <Icon name="navigate-outline" size={16} color={COLORS.textInverted} style={styles.actionIcon} />
          <Text style={styles.actionButtonText}>Navigate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleContactCustomer(delivery)}
        >
          <Icon name="call-outline" size={16} color={COLORS.textInverted} style={styles.actionIcon} />
          <Text style={styles.actionButtonText}>Contact</Text>
        </TouchableOpacity>
        
        {delivery.status === 'Assigned to Driver' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.updateButton]} 
            onPress={() => handleUpdateStatus(delivery.id, 'Out for Delivery')}
          >
            <Icon name="bicycle-outline" size={16} color={COLORS.textInverted} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Start Delivery</Text>
          </TouchableOpacity>
        )}
        
        {delivery.status === 'Out for Delivery' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]} 
            onPress={() => handleUpdateStatus(delivery.id, 'Delivered')}
          >
            <Icon name="checkmark-circle-outline" size={16} color={COLORS.textInverted} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Mark Delivered</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const pendingDeliveries = deliveriesState.filter(d => d.status !== 'Delivered');
  const completedDeliveries = deliveriesState.filter(d => d.status === 'Delivered');

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
          <Icon name="person-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Performance Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>₹{earnings.today}</Text>
          <Text style={styles.summaryLabel}>Today's Earnings</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{performanceMetrics.completedToday}</Text>
          <Text style={styles.summaryLabel}>Deliveries</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{performanceMetrics.rating}</Text>
          <Text style={styles.summaryLabel}>Rating</Text>
        </View>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="location-outline" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Update Location</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="call-outline" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Route')}
          >
            <Icon name="navigate-outline" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Optimize Route</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Pending Deliveries */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Deliveries</Text>
          <Text style={styles.sectionCount}>{pendingDeliveries.length}</Text>
        </View>
        
        {loadingDeliveries ? (
          <ActivityIndicator color={COLORS.primary} style={styles.loadingIndicator} />
        ) : pendingDeliveries.length > 0 ? (
          pendingDeliveries.map(renderDelivery)
        ) : (
          <View style={styles.emptyState}>
            <Icon name="checkmark-circle-outline" size={48} color={COLORS.success} />
            <Text style={styles.emptyStateText}>No pending deliveries</Text>
            <Text style={styles.emptyStateSubtext}>Great job! You've completed all deliveries for now.</Text>
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
          completedDeliveries.slice(0, 3).map(renderDelivery)
        ) : (
          <View style={styles.emptyState}>
            <Icon name="time-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyStateText}>No deliveries completed yet</Text>
            <Text style={styles.emptyStateSubtext}>Start delivering to see completed orders here.</Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.cardBackground,
    ...SHADOW,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  avatarText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.h3,
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
    padding: SPACING.s,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.medium,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: SPACING.m,
    backgroundColor: COLORS.cardBackground,
    ...SHADOW,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.s,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    margin: SPACING.m,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.large,
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
  sectionCount: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.medium,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.medium,
    marginHorizontal: SPACING.xs,
  },
  quickActionText: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.medium,
  },
  deliveryCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    ...SHADOW,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  orderId: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.medium,
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
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  address: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  slot: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
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
    padding: SPACING.s,
    borderRadius: BORDER_RADIUS.medium,
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
  loadingIndicator: {
    padding: SPACING.xl,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.m,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default DriverDashboardScreen;