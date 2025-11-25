import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

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
        <Text>Loading order details...</Text>
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
          ]} />
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
          <Text style={styles.timelineLocation}>{event.location}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Tracking</Text>
        <Text style={styles.orderIdText}>Order ID: {order.id}</Text>
      </View>
      
      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status:</Text>
          <Text style={[styles.statusBadge, getStatusStyle(order.status)]}>
            {order.status}
          </Text>
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
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Driver: {order.assignedDriver}</Text>
            <Text style={styles.driverDetail}>Vehicle: {order.driverVehicle}</Text>
            <Text style={styles.driverDetail}>Slot: {order.selectedSlot}</Text>
          </View>
          
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleContactDriver}>
              <Text style={styles.actionButtonText}>📞 Contact Driver</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.rescheduleButton]} onPress={handleReschedule}>
              <Text style={styles.actionButtonText}>🕒 Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Delivery Timeline */}
      <View style={styles.timelineSection}>
        <Text style={styles.sectionTitle}>Delivery Timeline</Text>
        <View style={styles.timeline}>
          {timelineEvents.map((event, index) => renderTimelineEvent(event, index))}
        </View>
      </View>
      
      {/* Order Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Order Details</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderIdText: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
  },
  orderSummary: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  slotSelectedStatus: {
    backgroundColor: '#FFEAA7',
    color: '#D35400',
  },
  processingStatus: {
    backgroundColor: '#74B9FF',
    color: '#0984E3',
  },
  outForDeliveryStatus: {
    backgroundColor: '#00B894',
    color: '#00A085',
  },
  deliveredStatus: {
    backgroundColor: '#00B894',
    color: '#00A085',
  },
  defaultStatus: {
    backgroundColor: '#DDDDDD',
    color: '#666666',
  },
  estimatedDelivery: {
    fontSize: 16,
    color: '#00B894',
    fontWeight: 'bold',
  },
  driverSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  driverInfo: {
    marginBottom: 20,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  driverDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  rescheduleButton: {
    backgroundColor: '#FF9500',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timelineSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeline: {
    marginTop: 10,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 15,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  completedDot: {
    backgroundColor: '#00B894',
  },
  pendingDot: {
    backgroundColor: '#ddd',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 5,
  },
  completedLine: {
    backgroundColor: '#00B894',
  },
  pendingLine: {
    backgroundColor: '#ddd',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedText: {
    color: '#00B894',
  },
  pendingText: {
    color: '#999',
  },
  timelineTime: {
    fontSize: 14,
    color: '#666',
  },
  timelineLocation: {
    fontSize: 14,
    color: '#999',
  },
  detailsSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
});

export default OrderTrackingScreen;