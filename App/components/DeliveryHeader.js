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
                    <MaterialIcons name="local-shipping" size={24} color="#10B981" />
                    <Text style={styles.title}>Deliveries</Text>
                </View>
                <View style={styles.notificationContainer}>
                    <TouchableOpacity 
                        style={styles.notificationButton}
                        onPress={handleNotificationPress}
                        activeOpacity={0.7}
                    >
                        <Animated.View style={{ transform: [{ scale: notificationScale }] }}>
                            <MaterialIcons name="notifications" size={20} color="#000000" />
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
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
    },
    notificationContainer: {
        position: 'relative',
    },
    notificationButton: {
        padding: 6,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
    },
    notificationBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 6,
        height: 6,
        backgroundColor: '#EF4444',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    tabContainer: {
        paddingHorizontal: 12,
        paddingBottom: 8,
    },
    tabBar: {
        backgroundColor: 'rgba(229, 231, 235, 0.6)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 1,
    },
    activeTabButton: {
        backgroundColor: '#FFFFFF',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8',
    },
    activeTabText: {
        color: '#10B981',
    },
});

export default DeliveryHeader;