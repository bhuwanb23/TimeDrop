import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const CustomerProfileScreen = ({ navigation }) => {
    const [user] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        memberSince: 'January 2024',
        avatar: null
    });

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    onPress: () => {
                        navigation.navigate('Login');
                    }
                }
            ]
        );
    };

    const menuItems = [
        { id: 1, icon: 'person-outline', label: 'Edit Profile', action: () => Alert.alert('Edit Profile', 'Profile editing would go here') },
        { id: 2, icon: 'location-on', label: 'Saved Addresses', action: () => Alert.alert('Addresses', 'Address management would go here') },
        { id: 3, icon: 'payment', label: 'Payment Methods', action: () => Alert.alert('Payment', 'Payment management would go here') },
        { id: 4, icon: 'notifications', label: 'Notifications', action: () => Alert.alert('Notifications', 'Notification settings would go here') },
        { id: 5, icon: 'help-outline', label: 'Help & Support', action: () => Alert.alert('Support', 'Support would go here') },
        { id: 6, icon: 'privacy-tip', label: 'Privacy Policy', action: () => Alert.alert('Privacy', 'Privacy policy would go here') },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Profile</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Profile Info Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <MaterialIcons name="person" size={48} color="#1e3b8a" />
                        </View>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.memberSince}>
                        <MaterialIcons name="event" size={14} color="#6B7280" />
                        <Text style={styles.memberSinceText}>Member since {user.memberSince}</Text>
                    </View>
                </View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>Wishlist</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>$1,234</Text>
                        <Text style={styles.statLabel}>Saved</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.menuItem}
                            onPress={item.action}
                        >
                            <View style={styles.menuLeft}>
                                <MaterialIcons name={item.icon} size={24} color="#6B7280" />
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={24} color="#EF4444" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={styles.versionText}>TimeDrop v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
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