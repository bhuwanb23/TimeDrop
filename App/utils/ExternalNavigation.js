/**
 * External Navigation Utility
 * Opens external navigation apps (Google Maps, Apple Maps, Waze)
 * with route from start to end location
 */

import { Linking, Platform } from 'react-native';

/**
 * Open Google Maps with route
 * @param {Object} start - Start coordinates { latitude, longitude, address? }
 * @param {Object} end - End coordinates { latitude, longitude, address? }
 */
export const openInGoogleMaps = async (start, end) => {
  try {
    const startLat = start.latitude;
    const startLng = start.longitude;
    const endLat = end.latitude;
    const endLng = end.longitude;
    
    // Google Maps URL scheme
    const url = Platform.select({
      ios: `comgooglemaps://?daddr=${endLat},${endLng}&directionsmode=driving`,
      android: `https://www.google.com/maps/dir/?api=1&destination=${endLat},${endLng}&travelmode=driving`
    });
    
    // Check if Google Maps is installed (iOS only)
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Fallback to web version or Apple Maps
      openInAppleMaps(start, end);
    }
  } catch (error) {
    console.error('Error opening Google Maps:', error);
    // Fallback to Apple Maps
    openInAppleMaps(start, end);
  }
};

/**
 * Open Apple Maps with route
 * @param {Object} start - Start coordinates { latitude, longitude, address? }
 * @param {Object} end - End coordinates { latitude, longitude, address? }
 */
export const openInAppleMaps = async (start, end) => {
  try {
    const endLat = end.latitude;
    const endLng = end.longitude;
    
    // Apple Maps URL scheme (works on iOS and macOS)
    const url = `http://maps.apple.com/?daddr=${endLat},${endLng}&dirflg=d`;
    
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Last resort fallback
      throw new Error('Apple Maps not available');
    }
  } catch (error) {
    console.error('Error opening Apple Maps:', error);
    // Fallback to web-based Google Maps
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${end.latitude},${end.longitude}&travelmode=driving`;
    await Linking.openURL(webUrl);
  }
};

/**
 * Open Waze with route
 * @param {Object} start - Start coordinates { latitude, longitude }
 * @param {Object} end - End coordinates { latitude, longitude }
 */
export const openInWaze = async (start, end) => {
  try {
    const endLat = end.latitude;
    const endLng = end.longitude;
    
    // Waze URL scheme
    const url = Platform.select({
      ios: `waze://?ll=${endLat},${endLng}&navigate=yes`,
      android: `waze://?ll=${endLat},${endLng}&navigate=yes`
    });
    
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Fallback to Google Maps
      openInGoogleMaps(start, end);
    }
  } catch (error) {
    console.error('Error opening Waze:', error);
    // Fallback to Google Maps
    openInGoogleMaps(start, end);
  }
};

/**
 * Smart navigation opener - tries preferred apps in order
 * @param {Object} start - Start coordinates
 * @param {Object} end - End coordinates
 * @param {string} preferredApp - 'google', 'apple', 'waze', or 'auto'
 */
export const openNavigation = async (start, end, preferredApp = 'auto') => {
  if (preferredApp === 'google') {
    await openInGoogleMaps(start, end);
  } else if (preferredApp === 'apple') {
    await openInAppleMaps(start, end);
  } else if (preferredApp === 'waze') {
    await openInWaze(start, end);
  } else {
    // Auto-detect based on platform
    if (Platform.OS === 'ios') {
      // Try Google Maps first, then Apple Maps
      const hasGoogleMaps = await Linking.canOpenURL('comgooglemaps://');
      if (hasGoogleMaps) {
        await openInGoogleMaps(start, end);
      } else {
        await openInAppleMaps(start, end);
      }
    } else {
      // Android - use Google Maps web
      await openInGoogleMaps(start, end);
    }
  }
};

export default {
  openInGoogleMaps,
  openInAppleMaps,
  openInWaze,
  openNavigation
};
