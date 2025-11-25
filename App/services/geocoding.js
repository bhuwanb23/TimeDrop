import * as Location from 'expo-location';

// Function to get address from coordinates (reverse geocoding)
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const reverseGeocodeResult = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    if (reverseGeocodeResult.length > 0) {
      const address = reverseGeocodeResult[0];
      return {
        address: `${address.name || ''} ${address.street || ''}, ${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`,
        city: address.city,
        region: address.region,
        country: address.country,
        postalCode: address.postalCode,
        latitude,
        longitude,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
};

// Function to get coordinates from address (forward geocoding)
export const geocode = async (address) => {
  try {
    const geocodeResult = await Location.geocodeAsync(address);
    
    if (geocodeResult.length > 0) {
      const location = geocodeResult[0];
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        address,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in geocoding:', error);
    return null;
  }
};

// Function to calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Helper function to convert degrees to radians
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Function to get current location with permission handling
export const getCurrentLocation = async () => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }
    
    // Get current location
    const location = await Location.getCurrentPositionAsync({});
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

// Function to watch position updates
export const watchPosition = async (callback, options = {}) => {
  try {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }
    
    // Watch position updates
    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: options.timeInterval || 5000,
        distanceInterval: options.distanceInterval || 10,
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp,
        });
      }
    );
    
    return locationSubscription;
  } catch (error) {
    console.error('Error watching position:', error);
    throw error;
  }
};

export default {
  reverseGeocode,
  geocode,
  calculateDistance,
  getCurrentLocation,
  watchPosition,
};