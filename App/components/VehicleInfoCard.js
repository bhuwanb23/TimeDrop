import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const VehicleInfoCard = ({ vehicleData, onEditPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="local-shipping" size={24} color="#10B981" />
                <Text style={styles.title}>Vehicle Info</Text>
                <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
                    <MaterialIcons name="edit" size={20} color="#10B981" />
                </TouchableOpacity>
            </View>
            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <Text style={styles.label}>MODEL</Text>
                    <Text style={styles.value}>{vehicleData?.model || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.label}>PLATE</Text>
                    <Text style={styles.value}>{vehicleData?.plate || 'N/A'}</Text>
                </View>
            </View>
            <View style={[styles.infoGrid, { marginTop: 12 }]}>
                <View style={styles.infoItem}>
                    <Text style={styles.label}>YEAR</Text>
                    <Text style={styles.value}>{vehicleData?.year || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.label}>COLOR</Text>
                    <Text style={styles.value}>{vehicleData?.color || 'N/A'}</Text>
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
    editButton: {
        marginLeft: 'auto',
        padding: 4,
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