import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeliveryHeader = () => {
    const [activeTab, setActiveTab] = useState('Active');

    return (
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <View style={styles.titleContainer}>
                    <MaterialIcons name="local-shipping" size={28} color="#135bec" />
                    <Text style={styles.title}>Deliveries</Text>
                </View>
                <View style={styles.notificationContainer}>
                    <TouchableOpacity style={styles.notificationButton}>
                        <MaterialIcons name="notifications" size={24} color="#000000" />
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
        fontWeight: 'bold',
        color: '#000000',
        letterSpacing: -0.5,
    },
    notificationContainer: {
        position: 'relative',
    },
    notificationButton: {
        padding: 8,
        borderRadius: 20,
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
        borderColor: '#f6f6f8',
    },
    tabContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    tabBar: {
        backgroundColor: 'rgba(229, 231, 235, 0.5)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeTabButton: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    activeTabText: {
        color: '#135bec',
    },
});

export default DeliveryHeader;