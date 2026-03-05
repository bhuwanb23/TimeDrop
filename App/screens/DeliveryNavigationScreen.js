import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import RouteCalculator, { getDistanceText, getDurationText, generateRoutePoints } from '../utils/RouteCalculator';
import ExternalNavigation from '../utils/ExternalNavigation';

const DeliveryNavigationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { delivery } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [routeData, setRouteData] = useState(null);
    const [region, setRegion] = useState(null);

    useEffect(() => {
        if (delivery) {
            loadRouteData();
        } else {
            Alert.alert(
                'Error',
                'No delivery information provided',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }
    }, []);

    const loadRouteData = async () => {
        try {
            setLoading(true);

            // Extract coordinates from delivery data
            const pickupCoords = extractCoordinates(delivery.pickup_location);
            const dropoffCoords = extractCoordinates(delivery.dropoff_location);

            if (!pickupCoords || !dropoffCoords) {
                throw new Error('Invalid coordinates');
            }

            // Calculate route
            const calculatedRoute = await RouteCalculator.calculateRoute(pickupCoords, dropoffCoords);
            
            // Generate route points for visualization
            const routePoints = generateRoutePoints(pickupCoords, dropoffCoords);

            setRouteData({
                ...calculatedRoute,
                routePoints,
                pickup: pickupCoords,
                dropoff: dropoffCoords
            });

            // Set map region to show both points
            const midLat = (pickupCoords.latitude + dropoffCoords.latitude) / 2;
            const midLng = (pickupCoords.longitude + dropoffCoords.longitude) / 2;
            
            setRegion({
                latitude: midLat,
                longitude: midLng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05
            });

            setLoading(false);
        } catch (error) {
            console.error('Error loading route data:', error);
            Alert.alert(
                'Error',
                'Failed to load route information',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }
    };

    const extractCoordinates = (location) => {
        if (!location) return null;
        
        try {
            // Handle both string and object formats
            const loc = typeof location === 'string' ? JSON.parse(location) : location;
            
            if (loc.latitude && loc.longitude) {
                return {
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    address: loc.address
                };
            }
            
            // If no coordinates, generate mock coordinates based on address hash
            return generateMockCoordinates(loc.address || 'Unknown');
        } catch (e) {
            return generateMockCoordinates(typeof location === 'string' ? location : 'Unknown');
        }
    };

    const generateMockCoordinates = (addressStr) => {
        // Base coordinates (San Francisco)
        const baseLat = 37.7749;
        const baseLng = -122.4194;
        
        // Create a simple hash from the address string
        let hash = 0;
        const str = String(addressStr);
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Convert hash to coordinate offsets
        const latOffset = (hash % 1000) / 10000;
        const lngOffset = ((hash >> 5) % 1000) / 10000;
        
        return {
            latitude: baseLat + latOffset,
            longitude: baseLng + lngOffset,
            address: addressStr
        };
    };

    const handleNavigate = () => {
        if (!routeData) return;

        Alert.alert(
            'Open Navigation',
            'Which app would you like to use?',
            [
                {
                    text: 'Google Maps',
                    onPress: () => ExternalNavigation.openInGoogleMaps(routeData.pickup, routeData.dropoff)
                },
                {
                    text: 'Apple Maps',
                    onPress: () => ExternalNavigation.openInAppleMaps(routeData.pickup, routeData.dropoff)
                },
                {
                    text: 'Waze',
                    onPress: () => ExternalNavigation.openInWaze(routeData.pickup, routeData.dropoff)
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1152d4" />
                <Text style={styles.loadingText}>Loading route...</Text>
            </SafeAreaView>
        );
    }

    if (!routeData || !region) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color="#0f172a" />
                </TouchableOpacity>
            </View>

            {/* Map View */}
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                rotateEnabled={true}
                pitchEnabled={true}
            >
                {/* Pickup Location Marker */}
                <Marker
                    coordinate={routeData.pickup}
                    title={`Pickup - Order #${delivery.orderNumber}`}
                    description={routeData.pickup.address || 'Pickup location'}
                    pinColor="#10B981"
                >
                    <View style={styles.markerContainer}>
                        <View style={styles.pickupMarker}>
                            <MaterialIcons name="store" size={20} color="#FFFFFF" />
                        </View>
                        <View style={styles.markerLabel}>
                            <Text style={styles.markerLabelText}>A</Text>
                        </View>
                    </View>
                </Marker>

                {/* Dropoff Location Marker */}
                <Marker
                    coordinate={routeData.dropoff}
                    title={`Dropoff - Order #${delivery.orderNumber}`}
                    description={routeData.dropoff.address || 'Delivery location'}
                    pinColor="#EF4444"
                >
                    <View style={styles.markerContainer}>
                        <View style={styles.dropoffMarker}>
                            <MaterialIcons name="flag" size={20} color="#FFFFFF" />
                        </View>
                        <View style={[styles.markerLabel, styles.dropoffLabel]}>
                            <Text style={styles.markerLabelText}>B</Text>
                        </View>
                    </View>
                </Marker>

                {/* Route Line */}
                <Polyline
                    coordinates={routeData.routePoints}
                    strokeColor="#1152d4"
                    strokeWidth={5}
                    lineDashPattern={[10, 5]}
                />
            </MapView>

            {/* Bottom Info Card */}
            <View style={styles.bottomCard}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderNumber}>Order #{delivery.orderNumber}</Text>
                    <View style={styles.routeDetails}>
                        <View style={styles.detailItem}>
                            <MaterialIcons name="route" size={20} color="#64748B" />
                            <Text style={styles.detailLabel}>Distance</Text>
                            <Text style={styles.detailValue}>
                                {getDistanceText(routeData.distance)}
                            </Text>
                        </View>
                        <View style={styles.detailDivider} />
                        <View style={styles.detailItem}>
                            <MaterialIcons name="access-time" size={20} color="#64748B" />
                            <Text style={styles.detailLabel}>Duration</Text>
                            <Text style={styles.detailValue}>
                                {getDurationText(routeData.duration)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.navigateButton}
                        onPress={handleNavigate}
                    >
                        <MaterialIcons name="navigation" size={20} color="#FFFFFF" />
                        <Text style={styles.navigateButtonText}>Navigate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={handleCancel}
                    >
                        <MaterialIcons name="close" size={20} color="#64748B" />
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748B',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: 16,
        paddingTop: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    map: {
        flex: 1,
    },
    markerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickupMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropoffMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    markerLabel: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropoffLabel: {
        backgroundColor: '#EF4444',
    },
    markerLabelText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    orderInfo: {
        marginBottom: 20,
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 16,
    },
    routeDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 16,
    },
    detailItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    detailDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    navigateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#1152d4',
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    navigateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    cancelButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#64748B',
    },
});

export default DeliveryNavigationScreen;
