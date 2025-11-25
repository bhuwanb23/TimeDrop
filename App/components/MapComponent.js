import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import locationTrackingService from '../services/locationTracking';

const MapComponent = ({ delivery, onLocationUpdate }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [region, setRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Get current location
  useEffect(() => {
    getLocationAsync();
    
    // Set up location tracking listener
    const removeListener = locationTrackingService.addListener((location) => {
      handleLocationUpdate(location);
    });
    
    // Cleanup
    return () => {
      removeListener();
    };
  }, []);

  const getLocationAsync = async () => {
    try {
      // Get current location from the service
      const location = await locationTrackingService.getCurrentLocation();
      handleLocationUpdate(location);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your current location.');
    }
  };

  const handleLocationUpdate = (location) => {
    const { latitude, longitude } = location;
    
    setCurrentLocation({ latitude, longitude });
    
    // Update region to focus on current location
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    
    // If we have a delivery location, calculate route
    if (delivery && delivery.lat && delivery.lng) {
      calculateRoute(latitude, longitude, delivery.lat, delivery.lng);
    }
    
    // Call onLocationUpdate if provided
    if (onLocationUpdate) {
      onLocationUpdate({ latitude, longitude });
    }
  };

  const calculateRoute = (startLat, startLng, endLat, endLng) => {
    // In a real implementation, this would call a routing API
    // For now, we'll create a simple straight line
    const coords = [
      { latitude: startLat, longitude: startLng },
      { latitude: endLat, longitude: endLng },
    ];
    
    setRouteCoordinates(coords);
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={false}
      >
        {/* Current location marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            pinColor="#007AFF"
          />
        )}
        
        {/* Delivery location marker */}
        {delivery && delivery.lat && delivery.lng && (
          <Marker
            coordinate={{ latitude: delivery.lat, longitude: delivery.lng }}
            title={delivery.customerName}
            description={delivery.address}
            pinColor="#E74C3C"
          />
        )}
        
        {/* Route polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007AFF"
            strokeWidth={4}
            lineDashPattern={[10, 10]}
          />
        )}
      </MapView>
      
      <View style={styles.mapInfo}>
        <Text style={styles.mapText}>Navigation</Text>
        {delivery ? (
          <>
            <Text style={styles.locationText}>Navigating to: {delivery.customerName}</Text>
            <Text style={styles.addressText}>{delivery.address}</Text>
            <Text style={styles.distanceText}>{delivery.distance} • ETA: 15 mins</Text>
          </>
        ) : (
          <Text style={styles.locationText}>No delivery selected</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  map: {
    flex: 1,
  },
  mapInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  mapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 3,
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  distanceText: {
    fontSize: 12,
    color: '#00B894',
    fontWeight: 'bold',
  },
});

export default MapComponent;