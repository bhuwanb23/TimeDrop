import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DeliveryDetail = ({ 
    visible, 
    onClose, 
    deliveryData,
    isDelivered = false
}) => {
    const slideAnim = useRef(new Animated.Value(800)).current;
    const navigation = useNavigation(); // Add navigation hook

    React.useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 800,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!deliveryData) return null;

    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity 
                    style={styles.backdrop} 
                    onPress={onClose}
                    activeOpacity={1}
                />
                <Animated.View 
                    style={[
                        styles.container,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <MaterialIcons 
                                name={isDelivered ? "check-circle" : "local-shipping"} 
                                size={24} 
                                color={isDelivered ? "#10B981" : "#135bec"} 
                            />
                            <View>
                                <Text style={styles.headerTitle}>
                                    {isDelivered ? 'Delivered Order' : 'Active Delivery'}
                                </Text>
                                <Text style={styles.orderNumber}>#{deliveryData.orderNumber}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <MaterialIcons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Customer Information */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Customer Information</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Name:</Text>
                                <Text style={styles.value}>{deliveryData.customerName}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Phone:</Text>
                                <Text style={styles.value}>+1 (555) 123-4567</Text>
                            </View>
                        </View>

                        {/* Delivery Address */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Delivery Address</Text>
                            <View style={styles.addressContainer}>
                                <MaterialIcons name="location-on" size={16} color="#94A3B8" />
                                <Text style={styles.addressText}>{deliveryData.address}</Text>
                            </View>
                        </View>

                        {/* Order Details */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Order Details</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Status:</Text>
                                <View style={[
                                    styles.statusBadge,
                                    isDelivered ? styles.deliveredBadge : styles.activeBadge
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        isDelivered ? styles.deliveredText : styles.activeText
                                    ]}>
                                        {isDelivered ? 'DELIVERED' : deliveryData.status?.toUpperCase() || 'ACTIVE'}
                                    </Text>
                                </View>
                            </View>
                            {!isDelivered && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Priority:</Text>
                                    <Text style={styles.value}>
                                        {deliveryData.isNext ? 'Next Delivery' : 'Standard'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Financial Information */}
                        {isDelivered ? (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Earnings</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Amount:</Text>
                                    <Text style={styles.earningsValue}>+{deliveryData.earnings}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Delivered:</Text>
                                    <Text style={styles.value}>{deliveryData.deliveryTime}</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Delivery Information</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Distance:</Text>
                                    <Text style={styles.value}>1.2 miles</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>ETA:</Text>
                                    <Text style={styles.value}>8 minutes</Text>
                                </View>
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View style={styles.buttonContainer}>
                            {!isDelivered && (
                                <TouchableOpacity 
                                    style={styles.startButton}
                                    onPress={() => {
                                        onClose();
                                        navigation.navigate('DeliveryNavigation', { 
                                            delivery: deliveryData._raw || deliveryData 
                                        });
                                    }}
                                >
                                    <MaterialIcons name="directions" size={20} color="#FFFFFF" />
                                    <Text style={styles.startButtonText}>Start Delivery</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.callButton}>
                                <MaterialIcons name="call" size={20} color="#FFFFFF" />
                                <Text style={styles.callButtonText}>Call Customer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.messageButton}>
                                <MaterialIcons name="chat" size={20} color="#135bec" />
                                <Text style={styles.messageButtonText}>Message</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backdrop: {
        flex: 1,
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '85%', // Increased to 85% height
        minHeight: 500, // Increased minimum height to 500px
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
    },
    orderNumber: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
        flex: 1,
    },
    value: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    earningsValue: {
        fontSize: 16,
        color: '#135bec',
        fontWeight: '700',
        flex: 1,
        textAlign: 'right',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    addressText: {
        fontSize: 14,
        color: '#000000',
        flex: 1,
        lineHeight: 20,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    deliveredBadge: {
        backgroundColor: '#DCFCE7',
    },
    activeBadge: {
        backgroundColor: '#DBEAFE',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    deliveredText: {
        color: '#166534',
    },
    activeText: {
        color: '#1E40AF',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        marginBottom: 30, // Increased bottom margin
        flexWrap: 'wrap', // Allow wrapping for the extra button
    },
    startButton: {
        flex: 1,
        minWidth: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#10B981',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#135bec',
        paddingVertical: 16,
        borderRadius: 12,
    },
    callButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    messageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#135bec',
    },
    messageButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#135bec',
    },
});

export default DeliveryDetail;