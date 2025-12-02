import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Linking, Platform, Switch } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';
import { driverAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const RouteOptimizationScreen = () => {
  const { session } = useAuth();
  const driverProfile = session?.type === 'driver' ? session.profile : null;
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routeOptimization, setRouteOptimization] = useState({
    enabled: true,
    mode: 'fastest', // fastest, shortest, eco
  });
  
  const navigation = useNavigation();

  const fetchDeliveries = useCallback(async () => {
    if (!driverProfile?.id) {
      return;
    }
    try {
      setLoading(true);
      const response = await driverAPI.getDeliveries(driverProfile.id);
      const list = response.data?.data || [];
      setDeliveries(list);
    } catch (error) {
      console.error('Error loading deliveries:', error);
      const message = error.response?.data?.message || 'Unable to load deliveries for optimization.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }, [driverProfile?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchDeliveries();
    }, [fetchDeliveries])
  );

  const pendingDeliveries = deliveries.filter(d => d.status !== 'Delivered');
  const completedDeliveries = deliveries.filter(d => d.status === 'Delivered');
  const totalStops = pendingDeliveries.length || 1;
  
  const routeProgress = {
    totalStops,
    completedStops: completedDeliveries.length,
    currentStop: completedDeliveries.length + 1,
    estimatedTime: `${Math.max(pendingDeliveries.length, 1) * 15} mins`,
    distanceRemaining: `${Math.max(pendingDeliveries.length, 1) * 2.5} km`
  };

  const handleStartNavigation = (delivery) => {
    if (!delivery.lat || !delivery.lng) {
      Alert.alert('Location unavailable', 'Coordinates missing for this delivery.');
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

  const handleMarkCompleted = async (deliveryId) => {
    if (!driverProfile?.id) {
      Alert.alert('Not Authorized', 'Sign in as a driver to update order status.');
      return;
    }
    try {
      await driverAPI.updateOrderStatus(driverProfile.id, deliveryId, 'Delivered');
      Alert.alert('Success', 'Delivery marked as completed!');
      fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery:', error);
      const message = error.response?.data?.message || 'Failed to mark delivery as completed.';
      Alert.alert('Error', message);
    }
  };
  
  const handleReorderDeliveries = (fromIndex, toIndex) => {
    const updatedDeliveries = [...pendingDeliveries];
    const [movedItem] = updatedDeliveries.splice(fromIndex, 1);
    updatedDeliveries.splice(toIndex, 0, movedItem);
    // In a real app, this would update the backend
    Alert.alert('Route Updated', 'Delivery order has been updated.');
  };

  const handleOptimizeRoute = () => {
    Alert.alert(
      'Optimize Route', 
      'Would you like to automatically optimize your delivery route?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Optimize', onPress: () => {
            // In a real app, this would call a routing algorithm
            Alert.alert('Route Optimized', 'Your delivery route has been optimized for efficiency.');
          }
        }
      ]
    );
  };

  const formatSlotWindow = (delivery) => {
    if (delivery.slot_date && delivery.slot_time) {
      return `${delivery.slot_date} • ${delivery.slot_time}`;
    }
    return 'Slot not scheduled';
  };

  const renderDelivery = (delivery, index) => (
    <View key={delivery.id} style={[styles.deliveryCard, delivery.status === 'Delivered' && styles.completedCard]}>
      <View style={styles.deliveryHeader}>
        <View style={styles.deliveryInfo}>
          <Text style={styles.stopNumber}>Stop {index + 1}</Text>
          <Text style={styles.orderId}>Order {delivery.order_id}</Text>
        </View>
        {delivery.status === 'Delivered' ? (
          <View style={styles.statusContainer}>
            <Icon name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.completedBadge}>Completed</Text>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <Icon name="time-outline" size={20} color={COLORS.warning} />
            <Text style={styles.pendingBadge}>Pending</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.customerName}>{delivery.customer_name}</Text>
      <Text style={styles.address}>{delivery.address}</Text>
      <Text style={styles.slot}>Slot: {formatSlotWindow(delivery)}</Text>
      
      {delivery.status !== 'Delivered' && (
        <View style={styles.deliveryActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleStartNavigation(delivery)}
          >
            <Icon name="navigate-outline" size={16} color={COLORS.textInverted} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]} 
            onPress={() => handleMarkCompleted(delivery.id)}
          >
            <Icon name="checkmark-circle-outline" size={16} color={COLORS.textInverted} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Mark Completed</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (!driverProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Route Optimization</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.routeText}>
            Sign in as a driver to view optimized routes.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Route Optimization</Text>
        <TouchableOpacity 
          style={styles.optimizeButton}
          onPress={handleOptimizeRoute}
        >
          <Icon name="sparkles-outline" size={20} color={COLORS.textInverted} />
          <Text style={styles.optimizeButtonText}>Optimize</Text>
        </TouchableOpacity>
      </View>
      
      {/* Route Settings */}
      <View style={styles.section}>
        <View style={styles.settingsHeader}>
          <Text style={styles.sectionTitle}>Route Settings</Text>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Auto-Optimize</Text>
            <Switch
              trackColor={{ false: COLORS.grayLight, true: COLORS.primaryLight }}
              thumbColor={routeOptimization.enabled ? COLORS.primary : COLORS.textLight}
              onValueChange={(value) => setRouteOptimization({...routeOptimization, enabled: value})}
              value={routeOptimization.enabled}
            />
          </View>
        </View>
        
        <View style={styles.modeSelector}>
          <TouchableOpacity 
            style={[styles.modeButton, routeOptimization.mode === 'fastest' && styles.activeModeButton]}
            onPress={() => setRouteOptimization({...routeOptimization, mode: 'fastest'})}
          >
            <Icon name="speedometer-outline" size={24} color={routeOptimization.mode === 'fastest' ? COLORS.textInverted : COLORS.textSecondary} />
            <Text style={[styles.modeText, routeOptimization.mode === 'fastest' && styles.activeModeText]}>Fastest</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeButton, routeOptimization.mode === 'shortest' && styles.activeModeButton]}
            onPress={() => setRouteOptimization({...routeOptimization, mode: 'shortest'})}
          >
            <Icon name="trail-sign-outline" size={24} color={routeOptimization.mode === 'shortest' ? COLORS.textInverted : COLORS.textSecondary} />
            <Text style={[styles.modeText, routeOptimization.mode === 'shortest' && styles.activeModeText]}>Shortest</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeButton, routeOptimization.mode === 'eco' && styles.activeModeButton]}
            onPress={() => setRouteOptimization({...routeOptimization, mode: 'eco'})}
          >
            <Icon name="leaf-outline" size={24} color={routeOptimization.mode === 'eco' ? COLORS.textInverted : COLORS.textSecondary} />
            <Text style={[styles.modeText, routeOptimization.mode === 'eco' && styles.activeModeText]}>Eco</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Route Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Route Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(routeProgress.completedStops / routeProgress.totalStops) * 100}%` }]} />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {routeProgress.completedStops} of {routeProgress.totalStops} stops completed
            </Text>
            <Text style={styles.progressText}>
              {routeProgress.distanceRemaining} remaining • {routeProgress.estimatedTime}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Pending Deliveries */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Deliveries</Text>
          <Text style={styles.sectionCount}>{pendingDeliveries.length}</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginVertical: SPACING.m }} />
        ) : pendingDeliveries.length > 0 ? (
          pendingDeliveries.map((delivery, index) => renderDelivery(delivery, index))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="checkmark-circle-outline" size={48} color={COLORS.success} />
            <Text style={styles.emptyStateText}>All deliveries completed!</Text>
            <Text style={styles.emptyStateSubtext}>Great job! No more deliveries for today.</Text>
          </View>
        )}
      </View>
      
      {/* Completed Today */}
      {completedDeliveries.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Completed Today</Text>
            <Text style={styles.sectionCount}>{completedDeliveries.length}</Text>
          </View>
          
          {completedDeliveries.slice(0, 3).map((delivery, index) => renderDelivery(delivery, index))}
        </View>
      )}
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
  headerTitle: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.medium,
  },
  optimizeButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.xs,
  },
  section: {
    margin: SPACING.m,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginRight: SPACING.s,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.medium,
    marginHorizontal: SPACING.xs,
  },
  activeModeButton: {
    backgroundColor: COLORS.primary,
  },
  modeText: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium,
  },
  activeModeText: {
    color: COLORS.textInverted,
  },
  progressContainer: {
    marginBottom: SPACING.m,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.grayLight,
    borderRadius: 5,
    marginBottom: SPACING.m,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  deliveryCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    ...SHADOW,
  },
  completedCard: {
    opacity: 0.7,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopNumber: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginRight: SPACING.s,
  },
  orderId: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.success,
    marginLeft: SPACING.xs,
  },
  pendingBadge: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.warning,
    marginLeft: SPACING.xs,
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
  completeButton: {
    backgroundColor: COLORS.success,
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

export default RouteOptimizationScreen;