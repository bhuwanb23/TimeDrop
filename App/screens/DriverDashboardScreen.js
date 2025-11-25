import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapComponent from '../components/MapComponent';
import { useDelivery } from '../context/DeliveryContext';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

const DriverDashboardScreen = () => {
  const { deliveries, loading, error } = useDelivery();
  const [driverInfo, setDriverInfo] = useState({
    name: 'Raj Kumar',
    vehicle: 'KA-01-AB-1234',
    phone: '9876543211',
  });
  
  const [deliveriesState, setDeliveriesState] = useState([
    { 
      id: 'DEL-001', 
      orderId: 'ORD-001', 
      customerName: 'John Doe', 
      address: '123 Main Street, Bangalore', 
      slot: 'Today, 2:00 PM - 4:00 PM',
      status: 'Out for Delivery',
      distance: '2.5 km',
      lat: 12.9716,
      lng: 77.5946
    },
    { 
      id: 'DEL-002', 
      orderId: 'ORD-002', 
      customerName: 'Jane Smith', 
      address: '456 Park Avenue, Bangalore', 
      slot: 'Today, 2:00 PM - 4:00 PM',
      status: 'Pending',
      distance: '1.8 km',
      lat: 12.9716,
      lng: 77.5946
    },
    { 
      id: 'DEL-003', 
      orderId: 'ORD-003', 
      customerName: 'Robert Johnson', 
      address: '789 Elm Street, Bangalore', 
      slot: 'Today, 4:00 PM - 6:00 PM',
      status: 'Pending',
      distance: '3.2 km',
      lat: 12.9716,
      lng: 77.5946
    },
  ]);
  
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

  // Example of how to use the delivery context
  useEffect(() => {
    // In a real app, this would fetch deliveries from an API
    // For now, we'll just log the deliveries from context
    console.log('Deliveries from context:', deliveries);
  }, [deliveries]);

  const handleUpdateStatus = (deliveryId, newStatus) => {
    // In a real app, this would make an API call to update the status
    setDeliveriesState(prevDeliveries => 
      prevDeliveries.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: newStatus } 
          : delivery
      )
    );
    
    Alert.alert('Status Updated', `Delivery status updated to ${newStatus}`);
  };

  const handleNavigate = (delivery) => {
    // In a real app, this would open the map with directions
    Alert.alert(
      'Navigation', 
      `Opening navigation to ${delivery.customerName}'s address: ${delivery.address}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Maps', onPress: () => {/* Open maps app */} }
      ]
    );
  };

  const handleContactCustomer = (delivery) => {
    Alert.alert(
      'Contact Customer', 
      `Call ${delivery.customerName} at their registered number?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {/* Initiate call */} }
      ]
    );
  };
  
  const handleProofOfDelivery = (delivery) => {
    Alert.alert(
      'Proof of Delivery', 
      `Collect proof of delivery for order ${delivery.orderId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Collect Signature', onPress: () => {/* Collect signature */} },
        { text: 'Take Photo', onPress: () => {/* Take photo */} }
      ]
    );
  };

  const handleLocationUpdate = (location) => {
    // In a real app, this would send the location to the backend
    console.log('Driver location updated:', location);
    // You could call an API here to update the driver's location
    // driverAPI.updateLocation(driverId, location);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return styles.pendingStatus;
      case 'Out for Delivery':
        return styles.outForDeliveryStatus;
      case 'Delivered':
        return styles.deliveredStatus;
      default:
        return styles.defaultStatus;
    }
  };

  const renderDelivery = (delivery) => (
    <View key={delivery.id} style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <Text style={styles.orderId}>Order: {delivery.orderId}</Text>
        <Text style={[styles.statusBadge, getStatusStyle(delivery.status)]}>
          {delivery.status}
        </Text>
      </View>
      
      <Text style={styles.customerName}>{delivery.customerName}</Text>
      <Text style={styles.address}>{delivery.address}</Text>
      <Text style={styles.slot}>Slot: {delivery.slot}</Text>
      <Text style={styles.distance}>{delivery.distance}</Text>
      
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
        
        {delivery.status === 'Pending' && (
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
      </View>
    </View>
  );

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
          delivery={deliveriesState.find(d => d.status === 'Out for Delivery')} 
          onLocationUpdate={handleLocationUpdate}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Deliveries</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading deliveries...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error loading deliveries: {error}</Text>
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