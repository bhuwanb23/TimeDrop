import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomerProfileScreen = ({ navigation }) => {
    // Sample user data
    const [userData] = useState({
        name: 'Alexandra Simmons',
        email: 'alexandra.s@email.com',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrksukvMVYO5Q6a9zTk1EntLphWzglV8iXR22uEsH1E93hcgkePQKs2z_vcSlY_NX_LGw5DHt2F9LDXesxA6QDJfrTNpr427WlycSN_lFPS5oT8v1V4pEVdNl_ffNbgegz7CipSTzevitU5IqK5u6wOOlrhwZt5eeC3hNonmG6v3qVV7lckG4yE2W6USiLGt3tJ6f6MaWCO6GtdXLQ5p9O9id3FxJ9Jo5dB73CPWDlhCuvhRCuzd7smGNwX03DMdsNN0IpRuVjJA4',
        isVerified: true,
        memberSince: 'Jan 2023'
    });

    // Sample recent orders
    const [recentOrders] = useState([
        {
            id: 'ORD-9921',
            date: 'Oct 24, 2023',
            amount: 129.00,
            status: 'delivered',
            statusText: 'Delivered',
            statusColor: '#16a34a',
            statusBg: '#dcfce7',
            productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoe8o8ZMTNCUvZN8T4eorsLBuHFYplPICjBmK4BfMtveiQ3je3i4aCLoYsn6QErP7kwtBNIEYYWHQxaBxTEW1Y3-TUeYFf2uBisFDXRGke5dImK9tgwtaHtaVkgq-S5W8_xNM-JgE21yC6j40nSjkiBiJEUDm0MEDHOVhxg9V4ibets5seiiwpaQvOdzp4mzQsBfLl-a0uvNmma5OuDzskZF6feTmYgF0VJ47kpyfZMvkeVLppYfgf7dmOy3UpDxCAnX94lQRJJNc'
        },
        {
            id: 'ORD-8842',
            date: 'Oct 21, 2023',
            amount: 45.50,
            status: 'transit',
            statusText: 'In Transit',
            statusColor: '#2563eb',
            statusBg: '#dbeafe',
            productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8EVn8wt7wHKAAKSMjxwqtqD88jVu6Sdg1bggcsIIp8LeT3QxBl0SOpYbEB2wSPnC_XaFROl_C-4P8vGiqetyrnl33g6ogKVDd74z-H9sG6PtRIpe7t2ML-yvwSpARpD6NYjjLGdJHDiJ_tqM6oihnIYKeObxtgxfafL5w2jBknoTaOMdEq0UpOAUxmAB0qBYCSYxwCPPSywukYH3p_RdbOSt3FNurLTfFHX4fKc6pxlCEMXVsJ6NeT-RZB-bBPrhhBVo1kShlDGU'
        }
    ]);

    // Quick actions
    const quickActions = [
        { id: 'orders', title: 'Orders', icon: 'package-2', screen: 'OrderHistory' },
        { id: 'wishlist', title: 'Wishlist', icon: 'favorite', screen: 'Wishlist' }
    ];

    // Account settings
    const accountSettings = [
        { id: 'personal', title: 'Personal Information', icon: 'person', screen: 'EditProfile' },
        { id: 'addresses', title: 'Shipping Addresses', icon: 'location-on', screen: 'Addresses' },
        { id: 'payments', title: 'Payment Methods', icon: 'payments', screen: 'PaymentMethods' },
        { id: 'notifications', title: 'Notifications', icon: 'notifications', screen: 'Notifications' },
        { id: 'security', title: 'Security & Password', icon: 'security', screen: 'Security' }
    ];

    // Handler functions
    const handleQuickActionPress = (screen) => {
        Alert.alert('Feature Coming Soon', `${screen} feature will be available in the next update.`);
    };

    const handleOrderPress = (order) => {
        Alert.alert('Order Details', `Viewing details for order ${order.id}`);
    };

    const handleSettingPress = (setting) => {
        Alert.alert('Feature Coming Soon', `${setting.title} feature will be available in the next update.`);
    };

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: () => navigation.navigate('Login') }
            ]
        );
    };

    const handleEditProfile = () => {
        Alert.alert('Edit Profile', 'Profile editing feature coming soon.');
    };

    // Component: Profile Header
    const ProfileHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleEditProfile} style={styles.avatarContainer}>
                <View style={styles.avatarWrapper}>
                    <Image 
                        source={{ uri: userData.avatar }}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                    {userData.isVerified && (
                        <View style={styles.verificationBadge}>
                            <MaterialIcons name="verified" size={16} color="#ffffff" />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
            <Text style={styles.memberSince}>Member since {userData.memberSince}</Text>
        </View>
    );

    // Component: Quick Action Button
    const QuickActionButton = ({ action }) => (
        <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickActionPress(action.screen)}
        >
            <View style={styles.actionIconContainer}>
                <MaterialIcons name={action.icon} size={24} color="#1e3a8a" />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
        </TouchableOpacity>
    );

    // Component: Order Item
    const OrderItem = ({ order }) => (
        <TouchableOpacity 
            style={styles.orderItem}
            onPress={() => handleOrderPress(order)}
        >
            <View style={styles.orderImageContainer}>
                <Image 
                    source={{ uri: order.productImage }}
                    style={styles.orderImage}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.orderDetails}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId} numberOfLines={1}>{order.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: order.statusBg }]}>
                        <Text style={[styles.statusText, { color: order.statusColor }]}>
                            {order.statusText}
                        </Text>
                    </View>
                </View>
                <Text style={styles.orderMeta}>{order.date} • ${order.amount.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    // Component: Setting Item
    const SettingItem = ({ setting }) => (
        <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => handleSettingPress(setting)}
        >
            <MaterialIcons name={setting.icon} size={24} color="#94a3b8" style={styles.settingIcon} />
            <Text style={styles.settingText}>{setting.title}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <ProfileHeader />
                
                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    {quickActions.map(action => (
                        <QuickActionButton key={action.id} action={action} />
                    ))}
                </View>

                {/* Recent Orders */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Orders</Text>
                        <TouchableOpacity onPress={() => handleQuickActionPress('OrderHistory')}>
                            <Text style={styles.viewAllText}>View all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ordersContainer}>
                        {recentOrders.map(order => (
                            <OrderItem key={order.id} order={order} />
                        ))}
                    </View>
                </View>

                {/* Account Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.settingsCard}>
                        {accountSettings.map(setting => (
                            <SettingItem key={setting.id} setting={setting} />
                        ))}
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f7',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: '#ffffff',
        paddingTop: 60,
        paddingBottom: 32,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 4,
        borderColor: '#ffffff',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    verificationBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#1e3a8a',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1c1c1e',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    memberSince: {
        fontSize: 12,
        color: '#9ca3af',
    },
    quickActionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: 32,
        gap: 16,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1c1c1e',
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1c1c1e',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1e3a8a',
    },
    ordersContainer: {
        gap: 12,
    },
    orderItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    orderImageContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    orderImage: {
        width: 40,
        height: 40,
    },
    orderDetails: {
        flex: 1,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1c1c1e',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    orderMeta: {
        fontSize: 12,
        color: '#9ca3af',
    },
    settingsCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f9fafb',
    },
    settingIcon: {
        marginRight: 16,
    },
    settingText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#1c1c1e',
    },
    logoutButton: {
        backgroundColor: '#ffffff',
        marginHorizontal: 24,
        marginTop: 32,
        marginBottom: 40,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ef4444',
    },
});

export default CustomerProfileScreen;