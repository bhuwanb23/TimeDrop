import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RouteOptimizationScreen = () => {
  const [deliveries, setDeliveries] = useState([
    { 
      id: 'DEL-001', 
      orderId: 'ORD-001', 
      customerName: 'John Doe', 
      address: '123 Main Street, Bangalore', 
      slot: 'Today, 2:00 PM - 4:00 PM',
      status: 'Out for Delivery',
      distance: '2.5 km',
      lat: 12.9716,
      lng: 77.5946,
      completed: false
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
      lng: 77.5946,
      completed: false
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
      lng: 77.5946,
      completed: false
    },
  ]);
  
  const [routeProgress, setRouteProgress] = useState({
    totalStops: 3,
    completedStops: 0,
    currentStop: 1,
    estimatedTime: '45 mins',
    distanceRemaining: '7.5 km'
  });
  
  const [alternativeRoutes, setAlternativeRoutes] = useState([
    { id: 1, name: 'Fastest Route', time: '40 mins', distance: '7.2 km' },
    { id: 2, name: 'Shortest Route', time: '45 mins', distance: '6.8 km' },
    { id: 3, name: 'Eco-Friendly Route', time: '50 mins', distance: '7.0 km' }
  ]);
  
  const navigation = useNavigation();

  const handleStartNavigation = (delivery) => {
    Alert.alert(
      'Start Navigation', 
      `Starting navigation to ${delivery.customerName}'s address: ${delivery.address}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => {
            // In a real app, this would open the map with directions
            Alert.alert('Navigation Started', 'Turn-by-turn navigation has begun.');
          }
        }
      ]
    );
  };

  const handleMarkCompleted = (deliveryId) => {
    setDeliveries(prevDeliveries => 
      prevDeliveries.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, completed: true, status: 'Delivered' } 
          : delivery
      )
    );
    
    setRouteProgress(prev => ({
      ...prev,
      completedStops: prev.completedStops + 1,
      currentStop: prev.currentStop + 1
    }));
    
    Alert.alert('Success', 'Delivery marked as completed!');
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

  const renderDelivery = (delivery, index) => (
    <View key={delivery.id} style={[styles.deliveryCard, delivery.completed && styles.completedCard]}>
      <View style={styles.deliveryHeader}>
        <Text style={styles.orderId}>Stop {index + 1}: Order {delivery.orderId}</Text>
        {delivery.completed ? (
          <Text style={styles.completedBadge}>Completed</Text>
        ) : (
          <Text style={styles.pendingBadge}>Pending</Text>
        )}
      </View>
      
      <Text style={styles.customerName}>{delivery.customerName}</Text>
      <Text style={styles.address}>{delivery.address}</Text>
      <Text style={styles.slot}>Slot: {delivery.slot}</Text>
      <Text style={styles.distance}>{delivery.distance}</Text>
      
      {!delivery.completed && (
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
        
        {deliveries.map((delivery, index) => renderDelivery(delivery, index))}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  progressContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  routeInfo: {
    backgroundColor: '#f0fff0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  routeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  routeTime: {
    fontSize: 14,
    color: '#00B894',
    fontWeight: 'bold',
  },
  deliveryCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  completedCard: {
    borderLeftColor: '#00B894',
    opacity: 0.7,
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
  completedBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#00B894',
    color: '#fff',
    overflow: 'hidden',
  },
  pendingBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#74B9FF',
    color: '#fff',
    overflow: 'hidden',
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
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  completeButton: {
    backgroundColor: '#00B894',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  routeDetails: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  routeStats: {
    fontSize: 14,
    color: '#666',
  },
  selectText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default RouteOptimizationScreen;