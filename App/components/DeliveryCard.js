import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeliveryCard = ({ 
    orderNumber, 
    customerName, 
    address, 
    status, 
    isNext = false,
    isReady = false 
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
                        <Text style={styles.nextDeliveryTag}>NEXT DELIVERY</Text>
                    )}
                    <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
                    <View style={styles.customerRow}>
                        <Text style={styles.customerName}>Customer: {customerName}</Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => handleButtonPress()}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons name="call" size={16} color="#135bec" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => handleButtonPress()}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons name="chat-bubble" size={16} color="#135bec" />
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
                <MaterialIcons name="location-on" size={18} color="#94A3B8" />
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
                        Update Status
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
        marginHorizontal: 2,
    },
    nextDeliveryBorder: {
        borderColor: 'rgba(19, 91, 236, 0.4)',
        shadowColor: '#135bec',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    headerLeft: {
        flex: 1,
        gap: 8,
    },
    nextDeliveryTag: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFFFFF',
        backgroundColor: '#135bec',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        textTransform: 'uppercase',
        letterSpacing: 1,
        shadowColor: '#135bec',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000000',
        letterSpacing: -0.2,
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    customerName: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: 8,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inTransitBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#FDE68A',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    readyBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    defaultBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#92400E',
        letterSpacing: 0.5,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    addressText: {
        fontSize: 16,
        color: '#475569',
        fontWeight: '500',
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    detailsButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    detailsButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        letterSpacing: 0.2,
    },
    updateButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    updateButtonActive: {
        backgroundColor: '#135bec',
        shadowColor: 'rgba(19, 91, 236, 0.5)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(19, 91, 236, 0.6)',
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#334155',
        letterSpacing: 0.2,
    },
    updateButtonTextActive: {
        color: '#FFFFFF',
    },
});

export default DeliveryCard;