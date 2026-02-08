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
                        <Text style={styles.nextDeliveryTag}>NEXT</Text>
                    )}
                    <Text style={styles.orderNumber}>#{orderNumber}</Text>
                    <View style={styles.customerRow}>
                        <Text style={styles.customerName}>{customerName}</Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => handleButtonPress()}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons name="call" size={14} color="#135bec" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => handleButtonPress()}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons name="chat-bubble" size={14} color="#135bec" />
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
                <MaterialIcons name="location-on" size={16} color="#94A3B8" />
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
                        Update
                    </Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 12,
        marginHorizontal: 2,
    },
    nextDeliveryBorder: {
        borderColor: 'rgba(19, 91, 236, 0.4)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
        gap: 6,
    },
    nextDeliveryTag: {
        fontSize: 9,
        fontWeight: '700',
        color: '#FFFFFF',
        backgroundColor: '#135bec',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        alignSelf: 'flex-start',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    customerName: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 6,
        marginLeft: 6,
    },
    actionButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inTransitBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    readyBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    defaultBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#92400E',
        letterSpacing: 0.3,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    addressText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    detailsButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    updateButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    updateButtonActive: {
        backgroundColor: '#135bec',
        borderWidth: 1,
        borderColor: 'rgba(19, 91, 236, 0.6)',
    },
    updateButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
    updateButtonTextActive: {
        color: '#FFFFFF',
    },
});

export default DeliveryCard;