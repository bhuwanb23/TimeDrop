import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const VehicleInfoCard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="local-shipping" size={24} color="#10B981" />
                <Text style={styles.title}>Vehicle Info</Text>
            </View>
            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <Text style={styles.label}>MODEL</Text>
                    <Text style={styles.value}>Toyota Prius</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.label}>PLATE</Text>
                    <Text style={styles.value}>ABC-1234</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#064E3B',
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    infoItem: {
        flex: 1,
        backgroundColor: '#ECFDF5',
        borderRadius: 10,
        padding: 12,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#059669',
        letterSpacing: 0.5,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#064E3B',
    },
});

export default VehicleInfoCard;