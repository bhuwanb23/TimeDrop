import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomerBottomNavbar = ({ activeTab = 'Home', onTabPress }) => {
    const tabs = [
        { id: 'Home', icon: 'home', label: 'Home' },
        { id: 'Orders', icon: 'receipt', label: 'My Orders' },
        { id: 'Wishlist', icon: 'favorite', label: 'Wishlist' },
        { id: 'Cart', icon: 'shopping-cart', label: 'Cart', badge: 2 },
        { id: 'Profile', icon: 'person', label: 'Profile' }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tab}
                        onPress={() => onTabPress && onTabPress(tab.id)}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialIcons
                                name={tab.icon}
                                size={26}
                                color={activeTab === tab.id ? '#1152d4' : '#94a3b8'}
                            />
                            {tab.badge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{tab.badge}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[
                            styles.tabLabel,
                            activeTab === tab.id ? styles.activeLabel : styles.inactiveLabel
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingBottom: 20, // Safe area inset
        elevation: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        zIndex: 100,
    },
    navbar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        height: 64,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    iconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -8,
        backgroundColor: '#1152d4',
        borderRadius: 8,
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    activeLabel: {
        color: '#1152d4',
    },
    inactiveLabel: {
        color: '#94a3b8',
    },
});

export default CustomerBottomNavbar;