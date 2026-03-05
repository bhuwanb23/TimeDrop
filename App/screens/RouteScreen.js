import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RouteHeader from '../components/RouteHeader';
import RouteMap from '../components/RouteMap';
import RouteBottomSheet from '../components/RouteBottomSheet';
import apiService from '../services/api';

const RouteScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [deliveries, setDeliveries] = useState([]);
    const [error, setError] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);

    // Load active deliveries for route planning
    const loadRouteData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch active deliveries assigned to driver (driver ID 1 for local dev)
            const response = await apiService.deliveries.getDeliveries({
                driverId: 1,
                status: 'in_transit'
            });
            
            if (response.data && response.data.data) {
                const formattedDeliveries = response.data.data.deliveries.map(delivery => ({
                    id: delivery.id,
                    orderNumber: delivery.order?.order_number || 'N/A',
                    customerName: delivery.order?.customer?.name || 'Customer',
                    address: formatAddress(delivery.dropoff_location),
                    coordinates: extractCoordinates(delivery.dropoff_location),
                    status: delivery.status,
                    priority: delivery.priority || 'normal',
                    _raw: delivery
                })).filter(d => d.coordinates); // Filter out deliveries without valid coordinates
                
                setDeliveries(formattedDeliveries);
            }
            
        } catch (err) {
            console.error('Error loading route data:', err);
            setError(err.message || 'Failed to load route data');
            // Use mock data as fallback
            setMockData();
        } finally {
            setLoading(false);
        }
    };
    
    // Format address from JSON or string
    const formatAddress = (address) => {
        if (!address) return 'Address not available';
        
        try {
            const addr = typeof address === 'string' ? JSON.parse(address) : address;
            
            if (addr.street && addr.city) {
                return `${addr.street}, ${addr.city}`;
            } else if (typeof address === 'string') {
                return address;
            }
            return 'Address not available';
        } catch (e) {
            return typeof address === 'string' ? address : 'Address not available';
        }
    };
    
    // Extract coordinates from address or return null
    const extractCoordinates = (address) => {
        try {
            const addr = typeof address === 'string' ? JSON.parse(address) : address;
            
            if (addr.latitude && addr.longitude) {
                return {
                    latitude: addr.latitude,
                    longitude: addr.longitude
                };
            }
            // If no coordinates in address, generate mock coordinates based on hash
            // In production, you would use a geocoding service
            return generateMockCoordinates(address);
        } catch (e) {
            return generateMockCoordinates(address);
        }
    };
    
    // Generate deterministic mock coordinates based on address string
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
        
        // Convert hash to coordinate offsets (within ~10km range)
        const latOffset = (hash % 1000) / 10000;
        const lngOffset = ((hash >> 5) % 1000) / 10000;
        
        return {
            latitude: baseLat + latOffset,
            longitude: baseLng + lngOffset
        };
    };
    
    // Set mock data as fallback
    const setMockData = () => {
        setDeliveries([
            {
                id: 1,
                orderNumber: 'ORD-98210',
                customerName: 'Sarah Jenkins',
                address: '452 Oak Avenue, Downtown Core',
                coordinates: { latitude: 37.7890, longitude: -122.4314 },
                status: 'in-transit',
                priority: 'high',
                _raw: {}
            },
            {
                id: 2,
                orderNumber: 'ORD-98211',
                customerName: 'TechHub Office',
                address: '1200 Innovation Way, Suite 400',
                coordinates: { latitude: 37.7870, longitude: -122.4344 },
                status: 'in-transit',
                priority: 'normal',
                _raw: {}
            },
            {
                id: 3,
                orderNumber: 'ORD-98215',
                customerName: 'Marco Rossi',
                address: '89 Sunset Blvd, Apt 4C',
                coordinates: { latitude: 37.7850, longitude: -122.4304 },
                status: 'in-transit',
                priority: 'normal',
                _raw: {}
            }
        ]);
    };
    
    useEffect(() => {
        loadRouteData();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <RouteHeader navigation={navigation} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1E3A8A" />
                    <Text style={styles.loadingText}>Loading route data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <RouteHeader navigation={navigation} />
            <RouteMap 
                deliveries={deliveries}
                onDeliverySelect={(delivery) => {
                    console.log('Delivery selected:', delivery);
                    // Navigate to delivery detail or show actions
                }}
            />
            <RouteBottomSheet 
                deliveries={deliveries}
                error={error}
                onRetry={loadRouteData}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748B',
    },
});

export default RouteScreen;