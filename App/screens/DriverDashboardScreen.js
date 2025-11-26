import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MapComponent from '../components/MapComponent';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';
import { driverAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
    }
  }, [driverProfile?.id]);

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
          <Text style={styles.actionButtonText}>Navigate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleContactCustomer(delivery)}
        >
          <Text style={styles.actionButtonText}>Contact</Text>
        </TouchableOpacity>
        
        {delivery.status === 'Assigned to Driver' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.updateButton]} 
            onPress={() => handleUpdateStatus(delivery.id, 'Out for Delivery')}
          >
            <Text style={styles.actionButtonText}>Start Delivery</Text>
          </TouchableOpacity>
        )}
        
        {delivery.status === 'Out for Delivery' && (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.proofButton]} 
              onPress={() => handleProofOfDelivery(delivery)}
            >
              <Text style={styles.actionButtonText}>Proof</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deliverButton]} 
              onPress={() => handleUpdateStatus(delivery.id, 'Delivered')}
            >
              <Text style={styles.actionButtonText}>Delivered</Text>
            </TouchableOpacity>
          </>
        )}
        
        {delivery.status === 'Customer Not Available' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.updateButton]} 
            onPress={() => handleUpdateStatus(delivery.id, 'Rescheduled')}
          >
            <Text style={styles.actionButtonText}>Reschedule</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (!driverProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Driver session not found</Text>
          <Text style={styles.driverName}>Please sign in again</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.noDeliveriesText}>
            Log in as a driver from the main screen to view assignments.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.driverName}>{driverInfo.name}</Text>
        <Text style={styles.vehicleInfo}>{driverInfo.vehicle}</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{deliveriesState.length}</Text>
          <Text style={styles.statLabel}>Total Deliveries</Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {deliveriesState.filter(d => d.status === 'Delivered').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {deliveriesState.filter(d => d.status !== 'Delivered').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
      
      {/* Performance Metrics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.performanceGrid}>
          <View style={styles.performanceBox}>
            <Text style={styles.performanceValue}>{performanceMetrics.onTimeDeliveries}/{performanceMetrics.totalDeliveries}</Text>
            <Text style={styles.performanceLabel}>On-Time Deliveries</Text>
          </View>
          
          <View style={styles.performanceBox}>
            <Text style={styles.performanceValue}>{performanceMetrics.rating}</Text>
            <Text style={styles.performanceLabel}>Rating</Text>
          </View>
          
          <View style={styles.performanceBox}>
            <Text style={styles.performanceValue}>{performanceMetrics.completedToday}</Text>
            <Text style={styles.performanceLabel}>Completed Today</Text>
          </View>
        </View>
      </View>
      
      {/* Earnings Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings Summary</Text>
        <View style={styles.earningsGrid}>
          <View style={styles.earningsBox}>
            <Text style={styles.earningsAmount}>₹{earnings.today}</Text>
            <Text style={styles.earningsLabel}>Today</Text>
          </View>
          
          <View style={styles.earningsBox}>
            <Text style={styles.earningsAmount}>₹{earnings.week}</Text>
            <Text style={styles.earningsLabel}>This Week</Text>
          </View>
          
          <View style={styles.earningsBox}>
            <Text style={styles.earningsAmount}>₹{earnings.month}</Text>
            <Text style={styles.earningsLabel}>This Month</Text>
          </View>
        </View>
      </View>

      {/* Map Component for Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Route</Text>
        <MapComponent 
          delivery={deliveriesState.find(d => d.status === 'Out for Delivery') || deliveriesState[0] || null} 
          onLocationUpdate={handleLocationUpdate}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Deliveries</Text>
        {loadingDeliveries ? (
          <Text style={styles.loadingText}>Loading deliveries...</Text>
        ) : deliveriesError ? (
          <Text style={styles.errorText}>{deliveriesError}</Text>
        ) : deliveriesState.length > 0 ? (
          deliveriesState.map(renderDelivery)
        ) : (
          <Text style={styles.noDeliveriesText}>No deliveries assigned for today</Text>
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
    padding: SPACING.m,
    paddingTop: 50,
  },
  welcomeText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
  },
  driverName: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
  },
  vehicleInfo: {
    color: COLORS.textInverted,
    opacity: 0.8,
    fontSize: TYPOGRAPHY.body,
    marginTop: SPACING.s,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.m,
  },
  statBox: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.small,
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
  section: {
    padding: SPACING.m,
    backgroundColor: COLORS.cardBackground,
    marginBottom: SPACING.s,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOW,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: SPACING.m,
    color: COLORS.textPrimary,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.m,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  performanceValue: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
  },
  performanceLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
    textAlign: 'center',
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningsBox: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.m,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  earningsAmount: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.secondary,
  },
  earningsLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
    textAlign: 'center',
  },
  deliveryCard: {
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  orderId: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
  },
  pendingStatus: {
    backgroundColor: COLORS.accentLight,
    color: COLORS.accentDark,
  },
  outForDeliveryStatus: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
  },
  deliveredStatus: {
    backgroundColor: COLORS.secondary,
    color: COLORS.secondaryDark,
  },
  warningStatus: {
    backgroundColor: COLORS.accent,
    color: COLORS.textInverted,
  },
  defaultStatus: {
    backgroundColor: COLORS.gray,
    color: COLORS.textSecondary,
  },
  customerName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  address: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  slot: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  distance: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
    margin: SPACING.xs,
  },
  updateButton: {
    backgroundColor: COLORS.primaryLight,
  },
  deliverButton: {
    backgroundColor: COLORS.secondary,
  },
  proofButton: {
    backgroundColor: COLORS.accent,
  },
  actionButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
  },
  noDeliveriesText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
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
});

export default DriverDashboardScreen;