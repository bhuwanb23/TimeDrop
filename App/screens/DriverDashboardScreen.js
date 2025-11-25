import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapComponent from '../components/MapComponent';
import { useDelivery } from '../context/DeliveryContext';

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
        <MapComponent delivery={deliveriesState.find(d => d.status === 'Out for Delivery')} />
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
  },
  driverName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  vehicleInfo: {
    color: '#e0e0e0',
    fontSize: 16,
    marginTop: 5,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningsBox: {
    backgroundColor: '#f0fff0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00B894',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  deliveryCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pendingStatus: {
    backgroundColor: '#FFEAA7',
    color: '#D35400',
  },
  outForDeliveryStatus: {
    backgroundColor: '#74B9FF',
    color: '#0984E3',
  },
  deliveredStatus: {
    backgroundColor: '#00B894',
    color: '#00A085',
  },
  defaultStatus: {
    backgroundColor: '#DDDDDD',
    color: '#666666',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  slot: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  distance: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    margin: 2,
  },
  updateButton: {
    backgroundColor: '#74B9FF',
  },
  deliverButton: {
    backgroundColor: '#00B894',
  },
  proofButton: {
    backgroundColor: '#FDCB6E',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noDeliveriesText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#E74C3C',
    padding: 20,
  },
});

export default DriverDashboardScreen;