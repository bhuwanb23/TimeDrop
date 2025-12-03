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
        {/* Enhanced Dashboard Header */}
        <View style={styles.dashboardHeader}>
          <View style={styles.driverProfileContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{driverInfo.name.charAt(0)}</Text>
              </View>
              <View style={styles.driverStatusIndicator} />
            </View>
            <View style={styles.driverInfoContainer}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>{driverInfo.name}</Text>
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineIndicator} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              </View>
              <Text style={styles.driverVehicle}>{driverInfo.vehicle}</Text>
              <Text style={styles.driverId}>ID: DRV-{driverProfile?.id || '001'}</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Icon name="notifications-outline" size={24} color={COLORS.textPrimary} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.profileActionButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Icon name="person-outline" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Dashboard Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Icon name="cash-outline" size={24} color={COLORS.primary} />
              <Text style={styles.statTitle}>Earnings</Text>
            </View>
            <Text style={styles.statValueLarge}>₹{earnings.today}</Text>
            <Text style={styles.statSubtitle}>Today</Text>
            <View style={styles.statTrend}>
              <Icon name="trending-up-outline" size={16} color={COLORS.success} />
              <Text style={styles.statTrendText}>+12%</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Icon name="cube-outline" size={24} color={COLORS.success} />
              <Text style={styles.statTitle}>Deliveries</Text>
            </View>
            <Text style={styles.statValueLarge}>{performanceMetrics.completedToday}</Text>
            <Text style={styles.statSubtitle}>Completed Today</Text>
            <View style={styles.statTrend}>
              <Icon name="checkmark-circle-outline" size={16} color={COLORS.success} />
              <Text style={styles.statTrendText}>{performanceMetrics.onTimeDeliveries}/{performanceMetrics.totalDeliveries} On-Time</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Icon name="star-outline" size={24} color={COLORS.warning} />
              <Text style={styles.statTitle}>Rating</Text>
            </View>
            <Text style={styles.statValueLarge}>{performanceMetrics.rating}</Text>
            <Text style={styles.statSubtitle}>Average Rating</Text>
            <View style={styles.statTrend}>
              <Icon name="trophy-outline" size={16} color={COLORS.warning} />
              <Text style={styles.statTrendText}>Top 15%</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Icon name="time-outline" size={24} color={COLORS.info} />
              <Text style={styles.statTitle}>Efficiency</Text>
            </View>
            <Text style={styles.statValueLarge}>92%</Text>
            <Text style={styles.statSubtitle}>On-Time Rate</Text>
            <View style={styles.statTrend}>
              <Icon name="speedometer-outline" size={16} color={COLORS.info} />
              <Text style={styles.statTrendText}>Excellent</Text>
            </View>
          </View>
        </View>
        
        {/* Quick Action Dashboard */}
        <View style={styles.dashboardSection}>
          <View style={styles.sectionHeaderWithAction}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity>
              <Text style={styles.sectionActionText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.actionTile}>
              <View style={styles.actionIconWrapper}>
                <Icon name="location-outline" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionTileText}>Update Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionTile}>
              <View style={styles.actionIconWrapper}>
                <Icon name="call-outline" size={28} color={COLORS.success} />
              </View>
              <Text style={styles.actionTileText}>Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionTile}
              onPress={() => navigation.navigate('Route')}
            >
              <View style={styles.actionIconWrapper}>
                <Icon name="navigate-outline" size={28} color={COLORS.accent} />
              </View>
              <Text style={styles.actionTileText}>Route</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionTile}>
              <View style={styles.actionIconWrapper}>
                <Icon name="calendar-outline" size={28} color={COLORS.info} />
              </View>
              <Text style={styles.actionTileText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Deliveries Dashboard */}
        <View style={styles.dashboardSection}>
          <View style={styles.sectionHeaderWithAction}>
            <Text style={styles.sectionTitle}>Today's Deliveries</Text>
            <TouchableOpacity>
              <Text style={styles.sectionActionText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.deliveriesOverview}>
            <View style={styles.deliveryMetric}>
              <Text style={styles.deliveryMetricValue}>{pendingDeliveries.length}</Text>
              <Text style={styles.deliveryMetricLabel}>Pending</Text>
            </View>
            <View style={styles.deliveryMetricDivider} />
            <View style={styles.deliveryMetric}>
              <Text style={styles.deliveryMetricValue}>{completedDeliveries.length}</Text>
              <Text style={styles.deliveryMetricLabel}>Completed</Text>
            </View>
            <View style={styles.deliveryMetricDivider} />
            <View style={styles.deliveryMetric}>
              <Text style={styles.deliveryMetricValue}>{pendingDeliveries.length + completedDeliveries.length}</Text>
              <Text style={styles.deliveryMetricLabel}>Total</Text>
            </View>
          </View>
          
          <View style={styles.deliveryListsContainer}>
            {/* Pending Deliveries */}
            <View style={styles.deliveryListSection}>
              <View style={styles.subSectionHeader}>
                <Text style={styles.subSectionTitle}>Pending ({pendingDeliveries.length})</Text>
              </View>
              
              {pendingDeliveries.length > 0 ? (
                pendingDeliveries.map(renderDelivery)
              ) : (
                <View style={styles.emptyListState}>
                  <Icon name="checkmark-circle-outline" size={32} color={COLORS.success} />
                  <Text style={styles.emptyListStateText}>All caught up!</Text>
                </View>
              )}
            </View>
            
            {/* Recently Completed */}
            <View style={styles.deliveryListSection}>
              <View style={styles.subSectionHeader}>
                <Text style={styles.subSectionTitle}>Recently Completed</Text>
              </View>
              
              {completedDeliveries.length > 0 ? (
                completedDeliveries.slice(0, 2).map(renderDelivery)
              ) : (
                <View style={styles.emptyListState}>
                  <Icon name="time-outline" size={32} color={COLORS.textLight} />
                  <Text style={styles.emptyListStateText}>No completions yet</Text>
                </View>
              )}
            </View>
          </View>
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
  
  // Enhanced Dashboard Header
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.cardBackground,
    ...SHADOW,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  driverProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
  },
  driverStatusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.cardBackground,
  },
  driverInfoContainer: {
    marginLeft: SPACING.m,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  driverName: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.s,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.small,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: SPACING.xs,
  },
  onlineText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  driverVehicle: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  driverId: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: SPACING.m,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationBadgeText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
  },
  profileActionButton: {
    padding: SPACING.s,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.circle,
  },
  
  // Dashboard Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.s,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    margin: SPACING.s,
    ...SHADOW,
    minHeight: 120,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  statTitle: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginLeft: SPACING.s,
    fontWeight: TYPOGRAPHY.medium,
  },
  statValueLarge: {
    fontSize: TYPOGRAPHY.h1,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
  },
  statSubtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.s,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTrendText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  
  // Dashboard Section
  dashboardSection: {
    margin: SPACING.m,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    ...SHADOW,
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionActionText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  
  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionTile: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    alignItems: 'center',
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  actionIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  actionTileText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.medium,
    textAlign: 'center',
  },
  
  // Deliveries Overview
  deliveriesOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  deliveryMetric: {
    alignItems: 'center',
  },
  deliveryMetricValue: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  deliveryMetricLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  deliveryMetricDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray,
  },
  deliveryListsContainer: {
    // Container for both lists
  },
  deliveryListSection: {
    marginBottom: SPACING.m,
  },
  subSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  subSectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  
  // Delivery Card (keeping existing styles)
  deliveryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    ...SHADOW,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  orderId: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
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
    fontSize: TYPOGRAPHY.body,
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
  
  // Empty States
  emptyListState: {
    alignItems: 'center',
    padding: SPACING.l,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.small,
  },
  emptyListStateText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
});

export default DriverDashboardScreen;