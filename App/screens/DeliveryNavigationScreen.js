import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import RouteCalculator, { getDistanceText, getDurationText } from '../utils/RouteCalculator';
import ExternalNavigation from '../utils/ExternalNavigation';

const DeliveryNavigationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { delivery } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [routeData, setRouteData] = useState(null);
    const [turnByTurnInstructions, setTurnByTurnInstructions] = useState([]);

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
            
            // Generate turn-by-turn instructions (mock data for now)
            const instructions = generateTurnByTurnInstructions(delivery, pickupCoords, dropoffCoords);
            setTurnByTurnInstructions(instructions);

            setRouteData({
                ...calculatedRoute,
                pickup: pickupCoords,
                dropoff: dropoffCoords
            });

            // Set map region to show both points
            const midLat = (pickupCoords.latitude + dropoffCoords.latitude) / 2;
            const midLng = (pickupCoords.longitude + dropoffCoords.longitude) / 2;
            
            setRegion({
                latitude: midLat,
                longitude: midLng,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08
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

    // Generate turn-by-turn navigation instructions
    const generateTurnByTurnInstructions = (delivery, pickup, dropoff) => {
        // Mock turn-by-turn instructions
        return [
            {
                id: 1,
                instruction: 'Head north on Main St',
                distance: '0.2 km',
                icon: 'arrow-upward',
                type: 'start'
            },
            {
                id: 2,
                instruction: 'Turn right onto Oak Ave',
                distance: '0.5 km',
                icon: 'turn-right',
                type: 'turn'
            },
            {
                id: 3,
                instruction: 'Continue straight for 1.2 km',
                distance: '1.2 km',
                icon: 'straight',
                type: 'straight'
            },
            {
                id: 4,
                instruction: 'Turn left onto Market St',
                distance: '0.8 km',
                icon: 'turn-left',
                type: 'turn'
            },
            {
                id: 5,
                instruction: 'Turn right onto Delivery Rd',
                distance: '0.3 km',
                icon: 'turn-right',
                type: 'turn'
            },
            {
                id: 6,
                instruction: `Arrive at ${delivery.orderNumber} - ${pickup.address || 'Pickup Location'}`,
                distance: '0 m',
                icon: 'store',
                type: 'pickup'
            },
            {
                id: 7,
                instruction: 'Head to customer location',
                distance: '0.1 km',
                icon: 'arrow-upward',
                type: 'start'
            },
            {
                id: 8,
                instruction: 'Turn left onto Customer Ave',
                distance: '0.4 km',
                icon: 'turn-left',
                type: 'turn'
            },
            {
                id: 9,
                instruction: `Arrive at destination - ${dropoff.address || 'Dropoff Location'}`,
                distance: '0 m',
                icon: 'flag',
                type: 'destination'
            }
        ];
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

    if (!routeData) {
        return null;
    }

    // Get icon for instruction type
    const getInstructionIcon = (type) => {
        const icons = {
            start: 'navigation',
            turn: 'turn-right',
            straight: 'straight',
            pickup: 'store',
            destination: 'flag'
        };
        return icons[type] || 'circle';
    };

    // Get color for instruction type
    const getInstructionColor = (type) => {
        const colors = {
            start: '#10B981',
            turn: '#1152d4',
            straight: '#64748B',
            pickup: '#F59E0B',
            destination: '#EF4444'
        };
        return colors[type] || '#64748B';
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Navigation Instructions</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            {/* Route Summary Card */}
            <View style={styles.routeSummary}>
                <View style={styles.summaryItem}>
                    <MaterialIcons name="route" size={24} color="#1152d4" />
                    <Text style={styles.summaryLabel}>Distance</Text>
                    <Text style={styles.summaryValue}>{getDistanceText(routeData.distance)}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <MaterialIcons name="access-time" size={24} color="#1152d4" />
                    <Text style={styles.summaryLabel}>Duration</Text>
                    <Text style={styles.summaryValue}>{getDurationText(routeData.duration)}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <MaterialIcons name="confirmation-number" size={24} color="#1152d4" />
                    <Text style={styles.summaryLabel}>Order</Text>
                    <Text style={styles.summaryValue}>#{delivery.orderNumber}</Text>
                </View>
            </View>

            {/* Turn-by-Turn Instructions */}
            <ScrollView style={styles.instructionsContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.instructionsTitle}>Turn-by-Turn Directions</Text>
                
                {turnByTurnInstructions.map((instruction, index) => (
                    <View key={instruction.id} style={styles.instructionCard}>
                        <View style={[
                            styles.instructionIconContainer,
                            { backgroundColor: `${getInstructionColor(instruction.type)}20` }
                        ]}>
                            <MaterialIcons 
                                name={getInstructionIcon(instruction.type)} 
                                size={28} 
                                color={getInstructionColor(instruction.type)} 
                            />
                        </View>
                        <View style={styles.instructionContent}>
                            <Text style={styles.instructionStep}>Step {index + 1}</Text>
                            <Text style={styles.instructionText}>{instruction.instruction}</Text>
                            <Text style={styles.instructionDistance}>{instruction.distance}</Text>
                        </View>
                        {instruction.type === 'pickup' && (
                            <View style={styles.pickupBadge}>
                                <MaterialIcons name="store" size={16} color="#F59E0B" />
                                <Text style={styles.pickupBadgeText}>Pickup Point</Text>
                            </View>
                        )}
                        {instruction.type === 'destination' && (
                            <View style={styles.destinationBadge}>
                                <MaterialIcons name="flag" size={16} color="#EF4444" />
                                <Text style={styles.destinationBadgeText}>Destination</Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    headerPlaceholder: {
        width: 40,
    },
    routeSummary: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 8,
    },
    instructionsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 16,
        marginTop: 8,
    },
    instructionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    instructionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        flexShrink: 0,
    },
    instructionContent: {
        flex: 1,
    },
    instructionStep: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
        marginBottom: 4,
    },
    instructionText: {
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '600',
        marginBottom: 4,
        lineHeight: 20,
    },
    instructionDistance: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    pickupBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    pickupBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#92400E',
    },
    destinationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    destinationBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#991B1B',
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
