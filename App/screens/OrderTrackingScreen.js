import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

const OrderTrackingScreen = () => {
  const [order, setOrder] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};

  // Mock order data - in a real app, this would come from an API
  useEffect(() => {
    if (orderId) {
      // Simulate API call
      const mockOrder = {
        id: orderId,
        customerName: 'John Doe',
        customerPhone: '9876543210',
        deliveryAddress: '123 Main Street, Bangalore, Karnataka 560001',
        orderValue: '₹2,499',
        orderDescription: 'Electronics package',
        status: 'Out for Delivery',
        selectedSlot: 'Today, 2:00 PM - 4:00 PM',
        assignedDriver: 'Raj Kumar',
        driverPhone: '9876543211',
        driverVehicle: 'KA-01-AB-1234',
        estimatedDelivery: '30 mins',
        statusHistory: [
          { 
            status: 'Order Placed', 
            timestamp: '2023-06-15 10:30 AM', 
            location: 'Warehouse',
            completed: true
          },
          { 
            status: 'Processing', 
            timestamp: '2023-06-15 11:15 AM', 
            location: 'Sorting Facility',
            completed: true
          },
          { 
            status: 'Slot Selected', 
            timestamp: '2023-06-15 12:00 PM', 
            location: 'Customer',
            completed: true
          },
          { 
            status: 'Out for Delivery', 
            timestamp: '2023-06-15 1:45 PM', 
            location: 'Delivery Hub',
            completed: true
          },
          { 
            status: 'Delivered', 
            timestamp: 'Expected by 2:30 PM', 
            location: 'Customer Address',
            completed: false
          },
        ]
      };
      setOrder(mockOrder);
      setTimelineEvents(mockOrder.statusHistory);
    }
  }, [orderId]);

  const handleSelectSlot = () => {
    navigation.navigate('SlotSelection', { orderId });
  };

  const handleContactDriver = () => {
    Alert.alert('Contact Driver', `Call ${order.assignedDriver} at ${order.driverPhone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => {/* In a real app, this would initiate a phone call */} }
    ]);
  };

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Delivery',
      'Are you sure you want to reschedule this delivery?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reschedule', onPress: () => navigation.navigate('SlotSelection', { orderId }) }
      ]
    );
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="hourglass-outline" size={40} color={COLORS.textSecondary} />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </View>
    );
  }

  const renderTimelineEvent = (event, index) => {
    const isLast = index === timelineEvents.length - 1;
    return (
      <View key={index} style={styles.timelineItem}>
        <View style={styles.timelineIndicator}>
          <View style={[
            styles.timelineDot,
            event.completed ? styles.completedDot : styles.pendingDot
          ]}>
            {event.completed && (
              <Icon name="checkmark" size={12} color={COLORS.textInverted} />
            )}
          </View>
          {!isLast && (
            <View style={[
              styles.timelineLine,
              event.completed ? styles.completedLine : styles.pendingLine
            ]} />
          )}
        </View>
        <View style={styles.timelineContent}>
          <View style={styles.timelineHeader}>
            <Text style={[
              styles.timelineStatus,
              event.completed ? styles.completedText : styles.pendingText
            ]}>
              {event.status}
            </Text>
            <Text style={styles.timelineTime}>{event.timestamp}</Text>
          </View>
          <View style={styles.timelineLocationContainer}>
            <Icon name="location-outline" size={14} color={COLORS.textLight} />
            <Text style={styles.timelineLocation}>{event.location}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={24} color={COLORS.textInverted} />
          </TouchableOpacity>
          <Text style={styles.title}>Order Tracking</Text>
          <View style={styles.placeholder} />
        </View>
        <Text style={styles.orderIdText}>Order ID: {order.id}</Text>
      </View>
      
      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status:</Text>
          <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
            <Icon name={getStatusIcon(order.status)} size={14} color={COLORS.textInverted} />
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Order Value:</Text>
          <Text style={styles.summaryValue}>{order.orderValue}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Slot:</Text>
          <Text style={styles.summaryValue}>{order.selectedSlot}</Text>
        </View>
        
        {order.estimatedDelivery && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Delivery:</Text>
            <Text style={styles.estimatedDelivery}>{order.estimatedDelivery}</Text>
          </View>
        )}
      </View>
      
      {/* Driver Information */}
      {order.assignedDriver && (
        <View style={styles.driverSection}>
          <View style={styles.sectionHeader}>
            <Icon name="car-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Delivery Information</Text>
          </View>
          <View style={styles.driverInfo}>
            <View style={styles.driverDetailRow}>
              <Icon name="person-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.driverName}>Driver: {order.assignedDriver}</Text>
            </View>
            <View style={styles.driverDetailRow}>
              <Icon name="car-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.driverDetail}>Vehicle: {order.driverVehicle}</Text>
            </View>
            <View style={styles.driverDetailRow}>
              <Icon name="time-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.driverDetail}>Slot: {order.selectedSlot}</Text>
            </View>
          </View>
          
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleContactDriver}>
              <Icon name="call-outline" size={20} color={COLORS.textInverted} />
              <Text style={styles.actionButtonText}>Contact Driver</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.rescheduleButton]} onPress={handleReschedule}>
              <Icon name="time-outline" size={20} color={COLORS.textInverted} />
              <Text style={styles.actionButtonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Delivery Timeline */}
      <View style={styles.timelineSection}>
        <View style={styles.sectionHeader}>
          <Icon name="list-outline" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Delivery Timeline</Text>
        </View>
        <View style={styles.timeline}>
          {timelineEvents.map((event, index) => renderTimelineEvent(event, index))}
        </View>
      </View>
      
      {/* Order Details */}
      <View style={styles.detailsSection}>
        <View style={styles.sectionHeader}>
          <Icon name="document-text-outline" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Order Details</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>{order.orderDescription}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Customer:</Text>
          <Text style={styles.detailValue}>{order.customerName}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Delivery Address:</Text>
          <Text style={styles.detailValue}>{order.deliveryAddress}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Slot Selected':
      return styles.slotSelectedStatus;
    case 'Processing':
      return styles.processingStatus;
    case 'Out for Delivery':
      return styles.outForDeliveryStatus;
    case 'Delivered':
      return styles.deliveredStatus;
    default:
      return styles.defaultStatus;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Slot Selected':
      return 'time-outline';
    case 'Processing':
      return 'construct-outline';
    case 'Out for Delivery':
      return 'car-outline';
    case 'Delivered':
      return 'checkmark-circle-outline';
    default:
      return 'clipboard-outline';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textInverted,
  },
  placeholder: {
    width: 24,
  },
  orderIdText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textInverted,
    opacity: 0.8,
    marginTop: 10,
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
  },
  statusText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textInverted,
    marginLeft: SPACING.xs,
  },
  slotSelectedStatus: {
    backgroundColor: COLORS.accentLight,
  },
  processingStatus: {
    backgroundColor: COLORS.primaryLight,
  },
  outForDeliveryStatus: {
    backgroundColor: COLORS.secondary,
  },
  deliveredStatus: {
    backgroundColor: COLORS.secondary,
  },
  defaultStatus: {
    backgroundColor: COLORS.gray,
  },
  estimatedDelivery: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondary,
    fontWeight: TYPOGRAPHY.bold,
  },
  driverSection: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.s,
  },
  driverInfo: {
    marginBottom: SPACING.m,
  },
  driverDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  driverName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.s,
  },
  driverDetail: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginLeft: SPACING.s,
  },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    flex: 0.48,
  },
  rescheduleButton: {
    backgroundColor: COLORS.accent,
  },
  actionButtonText: {
    color: COLORS.textInverted,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.s,
  },
  timelineSection: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  timeline: {
    marginTop: SPACING.s,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedDot: {
    backgroundColor: COLORS.secondary,
  },
  pendingDot: {
    backgroundColor: COLORS.gray,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: SPACING.s,
  },
  completedLine: {
    backgroundColor: COLORS.secondary,
  },
  pendingLine: {
    backgroundColor: COLORS.gray,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: SPACING.l,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  timelineStatus: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
  },
  completedText: {
    color: COLORS.secondary,
  },
  pendingText: {
    color: COLORS.textLight,
  },
  timelineTime: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  timelineLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  timelineLocation: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textLight,
    marginLeft: SPACING.s,
  },
  detailsSection: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
    marginBottom: SPACING.m,
  },
  detailItem: {
    marginBottom: SPACING.m,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.semiBold,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
  },
});

export default OrderTrackingScreen;