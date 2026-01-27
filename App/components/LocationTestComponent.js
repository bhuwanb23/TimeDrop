import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import LocationPermissionManager from '../utils/LocationPermissionManager';

const LocationTestComponent = () => {
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const hasPermission = await LocationPermissionManager.checkLocationPermissions();
    setPermissionGranted(hasPermission);
  };

  const requestLocationPermission = async () => {
    const granted = await LocationPermissionManager.requestLocationPermissions();
    setPermissionGranted(granted);
    if (granted) {
      Alert.alert('Success', 'Location permission granted!');
    } else {
      Alert.alert('Failed', 'Location permission was not granted.');
    }
  };

  const getCurrentLocation = async () => {
    const currentLocation = await LocationPermissionManager.getCurrentLocation();
    if (currentLocation) {
      setLocation(currentLocation);
      console.log('Current location:', currentLocation);
    } else {
      Alert.alert('Error', 'Could not get current location');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Permission Test</Text>
      
      <Text style={styles.status}>
        Permission Status: {permissionGranted ? 'GRANTED' : 'NOT GRANTED'}
      </Text>
      
      <Button 
        title="Request Location Permission" 
        onPress={requestLocationPermission} 
      />
      
      <View style={styles.spacer} />
      
      <Button 
        title="Get Current Location" 
        onPress={getCurrentLocation} 
        disabled={!permissionGranted}
      />
      
      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Current Location:</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Text>Accuracy: {location.coords.accuracy} meters</Text>
          <Text>Timestamp: {new Date(location.timestamp).toLocaleString()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  spacer: {
    height: 10,
  },
  locationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  locationTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default LocationTestComponent;