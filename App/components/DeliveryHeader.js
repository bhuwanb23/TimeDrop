import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeliveryHeader = ({ activeTab, setActiveTab }) => {
    const [notificationScale] = useState(new Animated.Value(1));

    const handleNotificationPress = () => {
        Animated.sequence([
            Animated.timing(notificationScale, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(notificationScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <View style={styles.titleContainer}>
                    <MaterialIcons name="local-shipping" size={28} color="#135bec" />
                    <Text style={styles.title}>Deliveries</Text>
                </View>
                <View style={styles.notificationContainer}>
                    <TouchableOpacity 
                        style={styles.notificationButton}
                        onPress={handleNotificationPress}
                        activeOpacity={0.7}
                    >
                        <Animated.View style={{ transform: [{ scale: notificationScale }] }}>
                            <MaterialIcons name="notifications" size={24} color="#000000" />
                        </Animated.View>
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <View style={styles.tabBar}>
                    <TouchableOpacity 
                        style={[
                            styles.tabButton, 
                            activeTab === 'Active' && styles.activeTabButton
                        ]}
                        onPress={() => setActiveTab('Active')}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === 'Active' && styles.activeTabText
                        ]}>
                            Active
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.tabButton,
                            activeTab === 'Delivered' && styles.activeTabButton
                        ]}
                        onPress={() => setActiveTab('Delivered')}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === 'Delivered' && styles.activeTabText
                        ]}>
                            Delivered
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f6f6f8',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#000000',
        letterSpacing: -0.5,
    },
    notificationContainer: {
        position: 'relative',
    },
    notificationButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    notificationBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        backgroundColor: '#EF4444',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    tabContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    tabBar: {
        backgroundColor: 'rgba(229, 231, 235, 0.6)',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    activeTabButton: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 0.2,
    },
    activeTabText: {
        color: '#135bec',
    },
});

export default DeliveryHeader;