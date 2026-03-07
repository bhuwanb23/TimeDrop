import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Linking,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeliveryCard = ({ 
    orderNumber, 
    customerName, 
    address, 
    status, 
    isNext = false,
    isReady = false,
    onPressDetails,
    pickupLocation,
    deliveryCoordinates
}) => {
    const buttonScale = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;

    const getStatusStyle = () => {
        if (isNext) return styles.inTransitBadge;
        if (isReady) return styles.readyBadge;
        return styles.defaultBadge;
    };

    const getStatusText = () => {
        if (isNext) return 'IN TRANSIT';
        if (isReady) return 'READY';
        return 'PENDING';
    };

    const handleButtonPress = (isDetails = false) => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
        
        if (isDetails && onPressDetails) {
            onPressDetails();
        }
    };

    // Handle navigation to Google Maps
    const handleNavigate = async () => {
        try {
            // Destination address from the delivery
            const destination = encodeURIComponent(address);
            
            // Create Google Maps URL with origin and destination
            // Using current location as origin, destination as the delivery address
            const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=&travelmode=driving`;
            
            console.log('Opening Google Maps with URL:', url);
            
            // Check if we can open the URL
            const supported = await Linking.canOpenURL(url);
            
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert(
                    'Navigation Error',
                    'Unable to open Google Maps. Please make sure Google Maps is installed on your device.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Navigation error:', error);
            Alert.alert(
                'Error',
                'Failed to open navigation. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <Animated.View 
            style={[
                styles.container,
                isNext && styles.nextDeliveryBorder,
                { transform: [{ scale: cardScale }] }
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    {isNext && (
                        <Text style={styles.nextDeliveryTag}>NEXT</Text>
                    )}
                    <Text style={styles.orderNumber}>#{orderNumber}</Text>
                    <View style={styles.customerRow}>
                        <Text style={styles.customerName} numberOfLines={1}>{customerName}</Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => handleButtonPress()}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons name="call" size={12} color="#059669" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => handleButtonPress()}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons name="chat-bubble" size={12} color="#059669" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={getStatusStyle()}>
                    <Text style={styles.badgeText}>{getStatusText()}</Text>
                </View>
            </View>

            {/* Address */}
            <View style={styles.addressRow}>
                <MaterialIcons name="location-on" size={14} color="#94A3B8" />
                <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                    style={styles.detailsButton}
                    onPress={() => handleButtonPress(true)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                {isNext && (
                    <TouchableOpacity 
                        style={styles.navigateButton}
                        onPress={handleNavigate}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="navigation" size={16} color="#FFFFFF" />
                        <Text style={styles.navigateButtonText}>Navigate</Text>
                    </TouchableOpacity>
                )}
                {!isNext && (
                    <TouchableOpacity 
                        style={[
                            styles.updateButton,
                            isNext && styles.updateButtonActive
                        ]}
                        onPress={() => handleButtonPress()}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.updateButtonText,
                            isNext && styles.updateButtonTextActive
                        ]}>
                            Update
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 8,
        marginHorizontal: 2,
    },
    nextDeliveryBorder: {
        borderColor: 'rgba(16, 185, 129, 0.4)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    headerLeft: {
        flex: 1,
        gap: 4,
    },
    nextDeliveryTag: {
        fontSize: 8,
        fontWeight: '700',
        color: '#FFFFFF',
        backgroundColor: '#10B981',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    orderNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    customerName: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 4,
        marginLeft: 4,
    },
    actionButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inTransitBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    readyBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    defaultBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    badgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#92400E',
        letterSpacing: 0.2,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    addressText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    detailsButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    detailsButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
    },
    navigateButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    navigateButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    updateButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    updateButtonActive: {
        backgroundColor: '#10B981',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.6)',
    },
    updateButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
    },
    updateButtonTextActive: {
        color: '#FFFFFF',
    },
});

export default DeliveryCard;