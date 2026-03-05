import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import LocationPermissionManager from '../utils/LocationPermissionManager';
import RouteOptimizer from '../utils/RouteOptimizer';

// Use safe MapComponents wrapper to handle compatibility issues
const { MapView, Marker, Circle, PROVIDER_DEFAULT } = require('./MapComponentsWrapper');

// Import all components with dynamic import to handle compatibility issues
let DeliveryMarker;
let RoutePolyline;
let RouteInfoOverlay;
let ETAOverlay;
let DistanceOverlay;
let TrafficOverlay;
let MapLegend;

try {
    const DeliveryMarkerModule = require('./DeliveryMarker');
    DeliveryMarker = DeliveryMarkerModule.default;
} catch (error) {
    console.warn('DeliveryMarker not available:', error.message);
    DeliveryMarker = ({ children }) => <View>{children}</View>;
}

try {
    const RoutePolylineModule = require('./RoutePolyline');
    RoutePolyline = RoutePolylineModule.default;
} catch (error) {
    console.warn('RoutePolyline not available:', error.message);
    RoutePolyline = ({ children }) => <View>{children}</View>;
}

try {
    const RouteInfoOverlayModule = require('./RouteInfoOverlay');
    RouteInfoOverlay = RouteInfoOverlayModule.default;
} catch (error) {
    console.warn('RouteInfoOverlay not available:', error.message);
    RouteInfoOverlay = ({ children }) => <View>{children}</View>;
}

try {
    const ETAOverlayModule = require('./ETAOverlay');
    ETAOverlay = ETAOverlayModule.default;
} catch (error) {
    console.warn('ETAOverlay not available:', error.message);
    ETAOverlay = ({ children }) => <View>{children}</View>;
}

try {
    const DistanceOverlayModule = require('./DistanceOverlay');
    DistanceOverlay = DistanceOverlayModule.default;
} catch (error) {
    console.warn('DistanceOverlay not available:', error.message);
    DistanceOverlay = ({ children }) => <View>{children}</View>;
}

try {
    const TrafficOverlayModule = require('./TrafficOverlay');
    TrafficOverlay = TrafficOverlayModule.default;
} catch (error) {
    console.warn('TrafficOverlay not available:', error.message);
    TrafficOverlay = ({ children }) => <View>{children}</View>;
}

try {
    const MapLegendModule = require('./MapLegend');
    MapLegend = MapLegendModule.default;
} catch (error) {
    console.warn('MapLegend not available:', error.message);
    MapLegend = ({ children }) => <View>{children}</View>;
}

const RouteMap = ({ deliveries = [], onDeliverySelect }) => {
    const [region, setRegion] = useState({
        latitude: 37.78825, // Default to somewhere central
        longitude: -122.4324, // San Francisco as default
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    const [currentLocation, setCurrentLocation] = useState(null);
    
    // Use deliveries from props if available, otherwise use empty array
    const [destinations, setDestinations] = useState([]);

    // Overlay visibility states
    const [showRouteInfo, setShowRouteInfo] = useState(true);
    const [showETA, setShowETA] = useState(true);
    const [showDistance, setShowDistance] = useState(true);
    const [showTraffic, setShowTraffic] = useState(true);
    const [showLegend, setShowLegend] = useState(true);
    
    // Route statistics
    const [routeStats, setRouteStats] = useState({
        totalDistance: 0,
        totalTime: 0,
        stopsCount: 0,
        optimizedRoute: []
    });

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
    
    // Update destinations when deliveries prop changes
    useEffect(() => {
        if (deliveries && deliveries.length > 0) {
            const formattedDestinations = deliveries.map(delivery => ({
                latitude: delivery.coordinates.latitude,
                longitude: delivery.coordinates.longitude,
                id: delivery.id,
                name: delivery.orderNumber || `Delivery ${delivery.id}`,
                customerName: delivery.customerName,
                address: delivery.address,
                status: delivery.status,
                priority: delivery.priority,
                _raw: delivery._raw
            }));
            setDestinations(formattedDestinations);
        }
    }, [deliveries]);
    
    // Calculate route statistics when location or destinations change
    useEffect(() => {
        if (currentLocation && destinations.length > 0) {
            const stats = RouteOptimizer.calculateRouteStats(
                currentLocation.coords, 
                destinations
            );
            setRouteStats(stats);
        }
    }, [currentLocation, destinations]);

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
                zoom: 1,
            }, { duration: 200 });
        }
    };

    const zoomOut = () => {
        if (mapRef.current) {
            mapRef.current.animateCamera({
                zoom: -1,
            }, { duration: 200 });
        }
    };

    const rotateMap = () => {
        if (mapRef.current) {
            mapRef.current.animateCamera({
                heading: 90, // Rotate 90 degrees
            }, { duration: 300 });
        }
    };

    const resetNorth = () => {
        if (mapRef.current) {
            mapRef.current.animateCamera({
                heading: 0, // Reset to North
            }, { duration: 300 });
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
                showsUserLocation={!!hasLocationPermission}
                showsMyLocationButton={false}
                followsUserLocation={false}
                showsCompass={true}
                rotateEnabled={true}
                pitchEnabled={true}
                toolbarEnabled={true}
                scrollEnabled={true}
                zoomEnabled={true}
                loadingEnabled={false}
            >
                {/* User's current location marker */}
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
                    <DeliveryMarker
                        key={dest.id}
                        coordinate={{
                            latitude: dest.latitude,
                            longitude: dest.longitude,
                        }}
                        title={`${dest.name} - ${dest.customerName || ''}`}
                        description={dest.address}
                        type={index === 0 ? 'next' : index === 1 ? 'pending' : 'completed'}
                        onPress={() => {
                            console.log(`Delivery ${index + 1} pressed:`, dest);
                            if (onDeliverySelect) {
                                onDeliverySelect(dest._raw || dest);
                            }
                        }}
                        isActive={index === 0} // Highlight the next delivery
                    />
                ))}

                {/* Route polyline between current location and destinations */}
                {currentLocation && destinations.length > 0 && RoutePolyline && (
                    <RoutePolyline
                        origin={{
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude,
                        }}
                        destination={destinations[0] ? {
                            latitude: destinations[0].latitude,
                            longitude: destinations[0].longitude,
                        } : null}
                        waypoints={destinations.slice(1).map(dest => ({
                            latitude: dest.latitude,
                            longitude: dest.longitude,
                        }))}
                        color="#1152d4"
                        width={6}
                        linePattern="dashed"
                        onRouteCalculated={(routeInfo) => {
                            console.log('Route calculated:', routeInfo);
                            // Update state with route information
                        }}
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
                <View style={styles.controlsColumn}>
                    {/* Zoom Controls */}
                    <View style={styles.controlGroup}>
                        <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
                            <MaterialIcons name="add" size={24} color="#111318" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
                            <MaterialIcons name="remove" size={24} color="#111318" />
                        </TouchableOpacity>
                    </View>

                    {/* Rotation Controls */}
                    <TouchableOpacity style={styles.controlButton} onPress={rotateMap}>
                        <MaterialIcons name="screen-rotation" size={24} color="#111318" />
                    </TouchableOpacity>

                    {/* Compass */}
                    <TouchableOpacity style={styles.controlButton} onPress={resetNorth}>
                        <MaterialIcons name="explore" size={24} color="#111318" />
                    </TouchableOpacity>

                    {/* Location Button */}
                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={hasLocationPermission ? centerOnCurrentLocation : requestLocationPermission}
                    >
                        <MaterialIcons
                            name={hasLocationPermission ? "my-location" : "location-off"}
                            size={24}
                            color={hasLocationPermission ? "#1152d4" : "#94a3b8"}
                        />
                    </TouchableOpacity>
                </View>
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
            {/* </View> */}

            {/* Map Overlays */}
            {RouteInfoOverlay && (
                <RouteInfoOverlay
                    totalStops={routeStats.stopsCount}
                    remainingStops={destinations.length}
                    totalTime={`${Math.floor(routeStats.totalTime)}h ${Math.round(routeStats.totalTime % 60)}m`}
                    totalDistance={`${(routeStats.totalDistance / 1000).toFixed(1)} km`}
                    isOptimized={true}
                    isVisible={showRouteInfo}
                />
            )}

            {ETAOverlay && (
                <ETAOverlay
                    currentStop={1}
                    nextStopETA="2:15 PM"
                    nextStopAddress="284 Market St"
                    orderNumber="#8821"
                    deliveryType="standard"
                    isVisible={showETA}
                />
            )}

            {DistanceOverlay && (
                <DistanceOverlay
                    fromLocation="Current Location"
                    toLocation="284 Market St"
                    distance="2.3 km"
                    estimatedTime="8 min"
                    viaRoute="Main St"
                    isVisible={showDistance}
                />
            )}

            {TrafficOverlay && (
                <TrafficOverlay
                    trafficCondition="light"
                    trafficDelay="0 min"
                    alternativeRouteAvailable={false}
                    isVisible={showTraffic}
                />
            )}

            {MapLegend && (
                <MapLegend
                    isVisible={showLegend}
                    onToggle={() => setShowLegend(!showLegend)}
                    showUserLocation={true}
                    showDestinations={true}
                    showRoute={true}
                    showTraffic={true}
                />
            )}
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
        transform: [{ translateY: -60 }],
        zIndex: 10,
    },
    controlsColumn: {
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
    controlGroup: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    controlButton: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationButton: {
        width: 56,
        height: 56,
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