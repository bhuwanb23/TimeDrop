import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

// Request location permissions
export const requestLocationPermission = async () => {
  try {
    // For iOS 13+, we need to request foreground and background permissions separately
    if (Platform.OS === 'ios') {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        throw new Error('Foreground location permission denied');
      }
      
      // Request background permission if needed
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        console.warn('Background location permission denied');
      }
      
      return foregroundStatus === 'granted';
    } else {
      // For Android, foreground permission is sufficient for most use cases
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
};

// Watch position updates
export const watchPosition = async (callback, options = {}) => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }
    
    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: options.accuracy || Location.Accuracy.Balanced,
        timeInterval: options.timeInterval || 5000, // 5 seconds
        distanceInterval: options.distanceInterval || 10, // 10 meters
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
          speed: location.coords.speed,
          heading: location.coords.heading,
        });
      }
    );
    
    return locationSubscription;
  } catch (error) {
    console.error('Error watching position:', error);
    throw error;
  }
};

// Stop watching position
export const stopWatchingPosition = (subscription) => {
  if (subscription) {
    subscription.remove();
  }
};

// Calculate distance between two points (in kilometers)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Check if location services are enabled
export const isLocationServicesEnabled = async () => {
  try {
    const enabled = await Location.hasServicesEnabledAsync();
    return enabled;
  } catch (error) {
    console.error('Error checking location services:', error);
    return false;
  }
};

// Get location permissions status
export const getLocationPermissionStatus = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error getting location permission status:', error);
    return 'denied';
  }
};

// Mock location data for testing
export const getMockLocation = () => {
  // Return a mock location in Bangalore
  return {
    latitude: 12.9716,
    longitude: 77.5946,
    accuracy: 5,
    timestamp: Date.now(),
  };
};

// Location tracking service
class LocationTrackingService {
  constructor() {
    this.watchSubscription = null;
    this.currentLocation = null;
    this.listeners = [];
  }
  
  // Add a listener for location updates
  addListener(callback) {
    this.listeners.push(callback);
    // Return a function to remove the listener
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  // Notify all listeners of a location update
  notifyListeners(location) {
    this.listeners.forEach(callback => {
      try {
        callback(location);
      } catch (error) {
        console.error('Error in location listener:', error);
      }
    });
  }
  
  // Start tracking location
  async startTracking(options = {}) {
    try {
      // Stop any existing tracking
      this.stopTracking();
      
      // Start watching position
      this.watchSubscription = await watchPosition((location) => {
        this.currentLocation = location;
        this.notifyListeners(location);
      }, options);
      
      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }
  
  // Stop tracking location
  stopTracking() {
    if (this.watchSubscription) {
      stopWatchingPosition(this.watchSubscription);
      this.watchSubscription = null;
    }
  }
  
  // Get the current location
  async getCurrentLocation() {
    if (this.currentLocation) {
      return this.currentLocation;
    }
    
    try {
      const location = await getCurrentLocation();
      this.currentLocation = location;
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      // Return mock location for testing
      return getMockLocation();
    }
  }
}

// Export a singleton instance
export default new LocationTrackingService();