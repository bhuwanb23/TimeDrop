import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';
import { driverAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RouteOptimizationScreen = () => {
  const { session } = useAuth();
  const driverProfile = session?.type === 'driver' ? session.profile : null;
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alternativeRoutes, setAlternativeRoutes] = useState([
    { id: 1, name: 'Fastest Route', time: '40 mins', distance: '7.2 km' },
    { id: 2, name: 'Shortest Route', time: '45 mins', distance: '6.8 km' },
    { id: 3, name: 'Eco-Friendly Route', time: '50 mins', distance: '7.0 km' }
  ]);
  
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

  const remainingStops = deliveries.filter(d => d.status !== 'Delivered').length;
  const completedStops = deliveries.filter(d => d.status === 'Delivered').length;
  const totalStops = deliveries.length || 1;
  const routeProgress = {
    totalStops,
    completedStops,
    currentStop: completedStops + 1,
    estimatedTime: `${Math.max(remainingStops, 1) * 15} mins`,
    distanceRemaining: `${Math.max(remainingStops, 1) * 2.5} km`
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
  
  const handleSelectAlternativeRoute = (route) => {
    Alert.alert(
      'Change Route', 
      `Switch to ${route.name}? This will update your navigation.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', onPress: () => {
            // In a real app, this would update the navigation route
            Alert.alert('Route Updated', `Navigation updated to ${route.name}.`);
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
        <Text style={styles.orderId}>Stop {index + 1}: Order {delivery.order_id}</Text>
        {delivery.status === 'Delivered' ? (
          <Text style={styles.completedBadge}>Completed</Text>
        ) : (
          <Text style={styles.pendingBadge}>Pending</Text>
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
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.completeButton]} 
            onPress={() => handleMarkCompleted(delivery.id)}
          >
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
      
      {/* Optimized Delivery Route */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Optimized Delivery Route</Text>
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>Optimized route based on traffic and distance</Text>
          <Text style={styles.routeTime}>Estimated completion: {routeProgress.estimatedTime}</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginVertical: SPACING.m }} />
        ) : deliveries.length > 0 ? (
          deliveries.map((delivery, index) => renderDelivery(delivery, index))
        ) : (
          <Text style={styles.routeText}>No deliveries available for routing.</Text>
        )}
      </View>
      
      {/* Alternative Routes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alternative Routes</Text>
        {alternativeRoutes.map(route => (
          <TouchableOpacity 
            key={route.id} 
            style={styles.routeOption} 
            onPress={() => handleSelectAlternativeRoute(route)}
          >
            <View style={styles.routeDetails}>
              <Text style={styles.routeName}>{route.name}</Text>
              <Text style={styles.routeStats}>{route.time} • {route.distance}</Text>
            </View>
            <Text style={styles.selectText}>Select</Text>
          </TouchableOpacity>
        ))}
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
  headerTitle: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.m,
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
  progressContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.m,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.gray,
    borderRadius: 5,
    marginBottom: SPACING.s,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  routeInfo: {
    backgroundColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  routeText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  routeTime: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.secondary,
    fontWeight: TYPOGRAPHY.bold,
  },
  deliveryCard: {
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  completedCard: {
    borderLeftColor: COLORS.secondary,
    opacity: 0.7,
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
  completedBadge: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    backgroundColor: COLORS.secondary,
    color: COLORS.textInverted,
    overflow: 'hidden',
  },
  pendingBadge: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
    overflow: 'hidden',
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
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
  },
  completeButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.bold,
  },
  routeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.small,
    marginBottom: SPACING.s,
  },
  routeDetails: {
    flex: 1,
  },
  routeName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  routeStats: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  selectText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.bold,
  },
});

export default RouteOptimizationScreen;