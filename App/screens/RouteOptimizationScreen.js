import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';
import Icon from 'react-native-vector-icons/Ionicons';

const RouteOptimizationScreen = () => {
  const navigation = useNavigation();
  
  // Sample delivery data
  const [deliveries] = useState([
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
  
  const [routeOptimization, setRouteOptimization] = useState({
    enabled: true,
    mode: 'fastest', // fastest, shortest, eco
  });

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
    Alert.alert('Navigation', `Starting navigation to ${delivery.customer_name}`);
  };

  const handleMarkCompleted = (deliveryId) => {
    Alert.alert('Success', 'Delivery marked as completed!');
  };
  
  const handleOptimizeRoute = () => {
    Alert.alert('Route Optimized', 'Your delivery route has been optimized for efficiency.');
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
            <Icon name="checkmark-circle" size={16} color={COLORS.success} />
            <Text style={styles.completedBadge}>Completed</Text>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <Icon name="time-outline" size={16} color={COLORS.warning} />
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
            <Icon name="navigate-outline" size={14} color={COLORS.textInverted} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]} 
            onPress={() => handleMarkCompleted(delivery.id)}
          >
            <Icon name="checkmark-circle-outline" size={14} color={COLORS.textInverted} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Route Optimization</Text>
          <TouchableOpacity 
            style={styles.optimizeButton}
            onPress={handleOptimizeRoute}
          >
            <Icon name="sparkles-outline" size={16} color={COLORS.textInverted} />
            <Text style={styles.optimizeButtonText}>Optimize</Text>
          </TouchableOpacity>
        </View>
        
        {/* Route Settings */}
        <View style={styles.section}>
          <View style={styles.settingsHeader}>
            <Text style={styles.sectionTitle}>Route Settings</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Auto</Text>
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
              <Icon name="speedometer-outline" size={20} color={routeOptimization.mode === 'fastest' ? COLORS.textInverted : COLORS.textSecondary} />
              <Text style={[styles.modeText, routeOptimization.mode === 'fastest' && styles.activeModeText]}>Fastest</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modeButton, routeOptimization.mode === 'shortest' && styles.activeModeButton]}
              onPress={() => setRouteOptimization({...routeOptimization, mode: 'shortest'})}
            >
              <Icon name="trail-sign-outline" size={20} color={routeOptimization.mode === 'shortest' ? COLORS.textInverted : COLORS.textSecondary} />
              <Text style={[styles.modeText, routeOptimization.mode === 'shortest' && styles.activeModeText]}>Shortest</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modeButton, routeOptimization.mode === 'eco' && styles.activeModeButton]}
              onPress={() => setRouteOptimization({...routeOptimization, mode: 'eco'})}
            >
              <Icon name="leaf-outline" size={20} color={routeOptimization.mode === 'eco' ? COLORS.textInverted : COLORS.textSecondary} />
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
                {routeProgress.completedStops} of {routeProgress.totalStops} stops
              </Text>
              <Text style={styles.progressText}>
                {routeProgress.distanceRemaining} • {routeProgress.estimatedTime}
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
          
          {pendingDeliveries.length > 0 ? (
            pendingDeliveries.map((delivery, index) => renderDelivery(delivery, index))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="checkmark-circle-outline" size={36} color={COLORS.success} />
              <Text style={styles.emptyStateText}>All deliveries completed!</Text>
              <Text style={styles.emptyStateSubtext}>Great job!</Text>
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
            
            {completedDeliveries.slice(0, 2).map((delivery, index) => renderDelivery(delivery, index))}
          </View>
        )}
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
  headerTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  optimizeButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.xs,
  },
  section: {
    margin: SPACING.s,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.s,
    ...SHADOW,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.bodySmall,
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.s,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.small,
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
    marginBottom: SPACING.s,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.grayLight,
    borderRadius: 4,
    marginBottom: SPACING.s,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  deliveryCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.s,
    marginBottom: SPACING.xs,
    ...SHADOW,
  },
  completedCard: {
    opacity: 0.7,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopNumber: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textLight,
    marginRight: SPACING.xs,
  },
  orderId: {
    fontSize: TYPOGRAPHY.bodySmall,
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

export default RouteOptimizationScreen;