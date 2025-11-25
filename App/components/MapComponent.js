import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapComponent = ({ delivery }) => {
  // In a real implementation, this would integrate with a maps library like react-native-maps
  // For now, we'll create a placeholder component
  
  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.locationText}>Navigating to: {delivery?.customerName}</Text>
        <Text style={styles.addressText}>{delivery?.address}</Text>
        <View style={styles.routeLine} />
        <Text style={styles.distanceText}>{delivery?.distance} • ETA: 15 mins</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
    marginBottom: 20,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  routeLine: {
    height: 2,
    backgroundColor: '#007AFF',
    width: '80%',
    marginBottom: 10,
  },
  distanceText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default MapComponent;