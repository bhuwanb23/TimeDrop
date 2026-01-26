import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNavbar = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const navItems = [
        {
            name: 'Home',
            icon: 'home',
            screen: 'Dashboard',
        },
        {
            name: 'Delivery',
            icon: 'local-shipping',
            screen: 'Delivery',
        },
        {
            name: 'Profile',
            icon: 'account-circle',
            screen: 'Profile',
        },
    ];

    const handlePress = (screen) => {
        if (route.name !== screen) {
            navigation.navigate(screen);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                {navItems.map((item) => {
                    const isActive = route.name === item.screen;
                    return (
                        <TouchableOpacity
                            key={item.screen}
                            style={styles.navItem}
                            onPress={() => handlePress(item.screen)}
                            accessibilityLabel={`${item.name} tab`}
                            accessibilityState={{ selected: isActive }}
                        >
                            <MaterialIcons
                                name={item.icon}
                                size={28}
                                color={isActive ? '#1E3A8A' : '#94A3B8'}
                                style={styles.icon}
                            />
                            <Text style={[
                                styles.label,
                                isActive && styles.activeLabel
                            ]}>
                                {item.name}
                            </Text>
                            {isActive && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        zIndex: 100,
    },
    navbar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        paddingBottom: 20, // Space for device navbar
        paddingTop: 12,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        position: 'relative',
    },
    icon: {
        marginBottom: 4,
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        color: '#94A3B8',
        marginTop: 2,
    },
    activeLabel: {
        color: '#1E3A8A',
        fontWeight: '700',
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        width: 4,
        height: 4,
        backgroundColor: '#1E3A8A',
        borderRadius: 2,
    },
});

export default BottomNavbar;