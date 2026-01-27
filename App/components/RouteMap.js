import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LocationPermissionManager from '../utils/LocationPermissionManager';

// Dynamically import MapView to handle compatibility issues
let MapView;
let Marker;
let Polyline;
let Circle;
let PROVIDER_DEFAULT;

try {
  const MapComponents = require('react-native-maps');
  MapView = MapComponents.default;
  Marker = MapComponents.Marker;
  Polyline = MapComponents.Polyline;
  Circle = MapComponents.Circle;
  PROVIDER_DEFAULT = MapComponents.PROVIDER_DEFAULT;
} catch (error) {
  console.warn('MapView not available:', error.message);
  // Fallback to Image if MapView is not available
  MapView = ({ children, style, ...props }) => (
    <Image
      source={{ uri: 'https://maps.wikimedia.org/osm-intl/13/37.78825/-122.4324.png' }}
      style={style}
      {...props}
    />
  );
  Marker = ({ children }) => <View>{children}</View>; // No-op for fallback
  Polyline = ({ children }) => <View>{children}</View>; // No-op for fallback
}

const RouteMap = () => {
    const [region, setRegion] = useState({
        latitude: 37.78825, // Default to somewhere central
        longitude: -122.4324, // San Francisco as default
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    
    const [currentLocation, setCurrentLocation] = useState(null);
    const [destinations, setDestinations] = useState([
        // Sample destinations - in a real app, these would come from delivery data
        { latitude: 37.7890, longitude: -122.4314, id: 1, name: 'Delivery 1' },
        { latitude: 37.7870, longitude: -122.4344, id: 2, name: 'Delivery 2' },
        { latitude: 37.7850, longitude: -122.4304, id: 3, name: 'Delivery 3' },
    ]);
    
    const mapRef = useRef(null);
    
    const [locationSubscription, setLocationSubscription] = useState(null);
    
    useEffect(() => {
        checkLocationPermission();
        
        return () => {
            // Cleanup subscription on unmount
            if (locationSubscription && typeof locationSubscription.remove === 'function') {
                locationSubscription.remove();
            }
        };
    }, []);
    
    const checkLocationPermission = async () => {
        const hasPermission = await LocationPermissionManager.checkLocationPermissions();
        setHasLocationPermission(hasPermission);
        
        if (hasPermission) {
            getCurrentLocation();
            
            // Set up location watching
            const subscription = LocationPermissionManager.startWatchingLocation(handleLocationUpdate);
            setLocationSubscription(subscription);
        }
    };
    
    const getCurrentLocation = async () => {
        const location = await LocationPermissionManager.getCurrentLocation();
        if (location) {
            setCurrentLocation(location);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    };
    
    const requestLocationPermission = async () => {
        const granted = await LocationPermissionManager.requestLocationPermissions();
        setHasLocationPermission(granted);
        if (granted) {
            getCurrentLocation();
            
            // Set up location watching
            const subscription = LocationPermissionManager.startWatchingLocation(handleLocationUpdate);
            setLocationSubscription(subscription);
        }
    };
    
    // Fallback region if no location permission
    const fallbackRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };
    
    const handleLocationUpdate = (location) => {
        setCurrentLocation(location);
    };
    
    const centerOnCurrentLocation = () => {
        if (currentLocation) {
            const newRegion = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            setRegion(newRegion);
            
            if (mapRef.current) {
                mapRef.current.animateToRegion(newRegion, 1000);
            }
        }
    };
    
    const zoomIn = () => {
        if (mapRef.current) {
            mapRef.current.animateCamera({
                pitch: 45,
                altitude: 1000,
            });
        }
    };
    
    const zoomOut = () => {
        if (mapRef.current) {
            mapRef.current.animateCamera({
                pitch: 0,
                altitude: 10000,
            });
        }
    };
    
    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={styles.mapContainer}
                initialRegion={hasLocationPermission ? region : fallbackRegion}
                region={hasLocationPermission ? region : fallbackRegion}
                showsUserLocation={hasLocationPermission}
                showsMyLocationButton={false}
                followsUserLocation={false}
                showsCompass={true}
                rotateEnabled={true}
                pitchEnabled={true}
                toolbarEnabled={true}
            >
                {/* User's current location marker with accuracy circle */}
                {currentLocation && (
                    <>
                        {/* Accuracy circle */}
                        <Circle
                            center={{
                                latitude: currentLocation.coords.latitude,
                                longitude: currentLocation.coords.longitude,
                            }}
                            radius={currentLocation.coords.accuracy || 50}
                            fillColor="rgba(17, 82, 212, 0.2)"
                            strokeColor="rgba(17, 82, 212, 0.5)"
                            strokeWidth={1}
                        />
                        {/* Main location marker */}
                        <Marker
                            coordinate={{
                                latitude: currentLocation.coords.latitude,
                                longitude: currentLocation.coords.longitude,
                            }}
                            title="Your Location"
                            identifier="user-location"
                        >
                            <View style={styles.userLocationMarkerContainer}>
                                <View style={styles.userLocationMarker}>
                                    <MaterialIcons name="person-pin-circle" size={24} color="#1152d4" />
                                    {currentLocation.coords.accuracy && (
                                        <Text style={styles.accuracyText}>{Math.round(currentLocation.coords.accuracy)}m</Text>
                                    )}
                                </View>
                            </View>
                        </Marker>
                    </>
                )}
                
                {/* Delivery destinations */}
                {destinations.map((dest, index) => (
                    <Marker
                        key={dest.id}
                        coordinate={{
                            latitude: dest.latitude,
                            longitude: dest.longitude,
                        }}
                        title={`Delivery ${index + 1}`}
                        pinColor="#f59e0b" // Amber color for destinations
                    />
                ))}
                
                {/* Route polyline between current location and destinations */}
                {currentLocation && destinations.length > 0 && (
                    <Polyline
                        coordinates={[{
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude,
                        }, ...destinations.map(dest => ({
                            latitude: dest.latitude,
                            longitude: dest.longitude,
                        }))]
                        }
                        strokeColor="#1152d4"
                        strokeWidth={6}
                        lineDashPhase={1}
                    />
                )}
            </MapView>

            {!hasLocationPermission && (
                <View style={styles.permissionOverlay}>
                    <Text style={styles.permissionText}>Location permission required to show your position and calculate routes.</Text>
                    <TouchableOpacity 
                        style={styles.permissionButton}
                        onPress={requestLocationPermission}
                    >
                        <Text style={styles.permissionButtonText}>Enable Location</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Right Controls */}
            <View style={styles.rightControls}>
                <View style={styles.zoomControls}>
                    <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
                        <MaterialIcons name="add" size={20} color="#111318" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
                        <MaterialIcons name="remove" size={20} color="#111318" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.locationButton} 
                    onPress={hasLocationPermission ? centerOnCurrentLocation : requestLocationPermission}
                >
                    <MaterialIcons 
                        name={hasLocationPermission ? "my-location" : "location-off"} 
                        size={20} 
                        color={hasLocationPermission ? "#1152d4" : "#94a3b8"} 
                    />
                </TouchableOpacity>
            </View>

            {/* Top Route Modes */}
            <ScrollView 
                style={styles.modeSelector}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modeSelectorContent}
            >
                <TouchableOpacity style={styles.activeModeButton}>
                    <MaterialIcons name="route" size={20} color="#FFFFFF" />
                    <Text style={styles.activeModeText}>Fastest (18 min)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modeButton}>
                    <MaterialIcons name="eco" size={20} color="#111318" />
                    <Text style={styles.modeText}>Eco (22 min)</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e7eb',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    mapImage: {
        flex: 1,
        width: '100%',
    },
    routeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    routeLinePrimary: {
        width: '100%',
        height: 8,
        backgroundColor: '#1152d4',
        position: 'absolute',
        top: '65%',
        left: 0,
        borderRadius: 4,
        opacity: 0.8,
    },
    routeLineSecondary: {
        width: '80%',
        height: 4,
        backgroundColor: '#9ca3af',
        position: 'absolute',
        top: '68%',
        right: 0,
        borderRadius: 2,
        borderStyle: 'dashed',
        opacity: 0.6,
    },
    marker: {
        position: 'absolute',
        left: '45%',
        top: '65%',
        zIndex: 3,
    },
    markerInner: {
        width: 32,
        height: 32,
        backgroundColor: '#1152d4',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    markerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    rightControls: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -48 }],
        gap: 12,
        zIndex: 10,
    },
    zoomControls: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        backdropFilter: 'blur(10px)',
    },
    zoomButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    locationButton: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    modeSelector: {
        position: 'absolute',
        top: 24,
        left: 16,
        right: 16,
        zIndex: 5,
    },
    modeSelectorContent: {
        flexDirection: 'row',
        gap: 8,
    },
    activeModeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#1152d4',
        borderRadius: 24,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    activeModeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
        backdropFilter: 'blur(10px)',
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111318',
    },
    permissionOverlay: {
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        zIndex: 10,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    permissionText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 12,
    },
    permissionButton: {
        backgroundColor: '#1152d4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    userLocationMarkerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    userLocationMarker: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#1152d4',
    },
    accuracyText: {
        position: 'absolute',
        bottom: -12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        fontSize: 10,
        color: '#1152d4',
        fontWeight: 'bold',
    },
});

export default RouteMap;