import { Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';

/**
 * LocationPermissionManager - Utility class to handle location permissions
 */
class LocationPermissionManager {
    /**
     * Request location permissions from the user
     * @returns {Promise<boolean>} - True if permissions granted, false otherwise
     */
    async requestLocationPermissions() {
        try {
            // Check if permissions are already granted
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                // Also request background location permission on iOS
                if (Platform.OS === 'ios') {
                    await Location.requestBackgroundPermissionsAsync();
                }
                return true;
            } else if (status === 'denied') {
                // Show explanation and redirect to settings
                this.showPermissionDeniedAlert();
                return false;
            } else if (status === 'undetermined') {
                // Permission hasn't been asked yet, request it
                const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
                if (newStatus === 'granted') {
                    return true;
                } else {
                    this.showPermissionDeniedAlert();
                    return false;
                }
            }
        } catch (error) {
            console.error('Error requesting location permissions:', error);
            return false;
        }
    }

    /**
     * Check if location permissions are already granted
     * @returns {Promise<boolean>} - True if permissions are granted, false otherwise
     */
    async checkLocationPermissions() {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Error checking location permissions:', error);
            return false;
        }
    }

    /**
     * Show alert when location permissions are denied
     */
    showPermissionDeniedAlert() {
        Alert.alert(
            'Location Permission Required',
            'This app needs location access to show your current position on the map and calculate delivery routes. Please enable location permissions in your device settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: this.openAppSettings }
            ]
        );
    }

    /**
     * Open app settings to allow user to grant permissions
     */
    openAppSettings = async () => {
        try {
            await Linking.openURL('app-settings:');
        } catch (error) {
            console.error('Error opening app settings:', error);
        }
    };

    /**
     * Get the current location with error handling
     * @returns {Promise<LocationObject | null>} - Current location object or null if error
     */
    async getCurrentLocation() {
        try {
            // Check if location services are enabled
            const locationServicesEnabled = await Location.hasServicesEnabledAsync();
            if (!locationServicesEnabled) {
                this.showLocationServicesDisabledAlert();
                return null;
            }
            
            const hasPermission = await this.checkLocationPermissions();
            
            if (!hasPermission) {
                const granted = await this.requestLocationPermissions();
                if (!granted) {
                    return null;
                }
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 5000, // Update every 5 seconds
                distanceInterval: 5, // Update every 5 meters
            });

            return location;
        } catch (error) {
            console.error('Error getting current location:', error);
            if (error.code === 1) { // PERMISSION_DENIED
                this.showPermissionDeniedAlert();
            } else if (error.code === 2) { // POSITION_UNAVAILABLE
                this.showLocationServicesDisabledAlert();
            }
            return null;
        }
    }

    /**
     * Show alert when location services are disabled
     */
    showLocationServicesDisabledAlert() {
        Alert.alert(
            'Location Services Disabled',
            'Please enable location services in your device settings to use this feature.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: this.openAppSettings }
            ]
        );
    }

    /**
     * Start watching location with callback
     * @param {Function} callback - Function to call with new location data
     * @returns {Promise<LocationSubscription | null>} - Location subscription or null if error
     */
    async startWatchingLocation(callback) {
        try {
            const hasPermission = await this.checkLocationPermissions();

            if (!hasPermission) {
                const granted = await this.requestLocationPermissions();
                if (!granted) {
                    return null;
                }
            }

            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000, // Update every 5 seconds
                    distanceInterval: 5, // Update every 5 meters
                },
                callback
            );

            return subscription;
        } catch (error) {
            console.error('Error starting location watch:', error);
            return null;
        }
    }
}

// Create singleton instance
const locationPermissionManager = new LocationPermissionManager();

export default locationPermissionManager;