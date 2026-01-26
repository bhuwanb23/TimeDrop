import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SettingsCard = () => {
    const settingsItems = [
        { icon: 'person', label: 'Personal Information' },
        { icon: 'payments', label: 'Payment Methods' },
        { icon: 'notifications', label: 'App Preferences' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Account Settings</Text>
            </View>
            <View style={styles.itemsContainer}>
                {settingsItems.map((item, index) => (
                    <TouchableOpacity key={item.label} style={styles.item}>
                        <View style={styles.itemLeft}>
                            <MaterialIcons name={item.icon} size={24} color="#94A3B8" />
                            <Text style={styles.itemLabel}>{item.label}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginHorizontal: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    itemsContainer: {
        flexDirection: 'column',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#334155',
    },
});

export default SettingsCard;