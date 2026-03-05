import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RouteHeader from '../components/RouteHeader';
import RouteMap from '../components/RouteMap';
import RouteBottomSheet from '../components/RouteBottomSheet';

const RouteScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [deliveries, setDeliveries] = useState([
        {
            id: 1,
            orderNumber: 'ORD-98210',
            customerName: 'John Doe',
            address: '123 Main St, San Francisco, CA',
            coordinates: { latitude: 37.7749, longitude: -122.4194 },
            status: 'in_transit',
            priority: 'high',
            _raw: { id: 1, order_number: 'ORD-98210' }
        },
        {
            id: 2,
            orderNumber: 'ORD-98215',
            customerName: 'Jane Smith',
            address: '789 Oak Rd, San Francisco, CA',
            coordinates: { latitude: 37.7849, longitude: -122.4094 },
            status: 'in_transit',
            priority: 'normal',
            _raw: { id: 2, order_number: 'ORD-98215' }
        },
        {
            id: 3,
            orderNumber: 'ORD-98220',
            customerName: 'Bob Wilson',
            address: '555 Pine St, San Francisco, CA',
            coordinates: { latitude: 37.7649, longitude: -122.4294 },
            status: 'assigned',
            priority: 'low',
            _raw: { id: 3, order_number: 'ORD-98220' }
        }
    ]);
    const [error, setError] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({ latitude: 37.7749, longitude: -122.4194 });

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