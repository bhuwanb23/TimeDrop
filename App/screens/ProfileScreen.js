import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, Modal, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileHeader from '../components/ProfileHeader';
import StatusToggleCard from '../components/StatusToggleCard';
import EarningsCard from '../components/EarningsCard';
import VehicleInfoCard from '../components/VehicleInfoCard';
import SettingsCard from '../components/SettingsCard';
import LogoutButton from '../components/LogoutButton';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [showPersonalModal, setShowPersonalModal] = useState(false);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Driver profile data
    const [driverData, setDriverData] = useState({
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 123-4567',
        vehicleModel: 'Toyota Prius',
        vehiclePlate: 'ABC-1234',
        vehicleYear: '2020',
        vehicleColor: 'Silver',
        rating: 4.9,
        totalDeliveries: 1247,
        memberSince: '2021'
    });

    // Temporary state for editing
    const [editData, setEditData] = useState({ ...driverData });

    // Load driver data on mount
    useEffect(() => {
        loadDriverData();
    }, []);

    const loadDriverData = async () => {
        try {
            const savedData = await AsyncStorage.getItem('driverProfile');
            if (savedData) {
                setDriverData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error('Error loading driver data:', error);
        }
    };

    // Handle personal info edit
    const handleEditPersonal = () => {
        setEditData({ ...driverData });
        setShowPersonalModal(true);
    };

    // Save personal info
    const handleSavePersonal = async () => {
        setIsLoading(true);
        try {
            const updatedData = { ...driverData, ...editData };
            setDriverData(updatedData);
            await AsyncStorage.setItem('driverProfile', JSON.stringify(updatedData));
            Alert.alert('Success', 'Profile updated successfully!');
            setShowPersonalModal(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile.');
            console.error('Update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle vehicle edit
    const handleEditVehicle = () => {
        setEditData({ ...driverData });
        setShowVehicleModal(true);
    };

    // Save vehicle info
    const handleSaveVehicle = async () => {
        setIsLoading(true);
        try {
            const updatedData = { ...driverData, ...editData };
            setDriverData(updatedData);
            await AsyncStorage.setItem('driverProfile', JSON.stringify(updatedData));
            Alert.alert('Success', 'Vehicle info updated!');
            setShowVehicleModal(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to update vehicle info.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle settings press
    const handleSettingsPress = (setting) => {
        switch (setting.label) {
            case 'Personal Information':
                handleEditPersonal();
                break;
            case 'Payment Methods':
                Alert.alert('Payment Methods', 'Payment methods screen coming soon');
                break;
            case 'App Preferences':
                Alert.alert('Preferences', 'Preferences screen coming soon');
                break;
            default:
                break;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ProfileHeader 
                driverData={driverData}
                onEditPress={handleEditPersonal}
            />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                <StatusToggleCard />
                <EarningsCard />
                <VehicleInfoCard 
                    vehicleData={{
                        model: driverData.vehicleModel,
                        plate: driverData.vehiclePlate,
                        year: driverData.vehicleYear,
                        color: driverData.vehicleColor
                    }}
                    onEditPress={handleEditVehicle}
                />
                <SettingsCard onSettingsPress={handleSettingsPress} />
                <LogoutButton />
            </ScrollView>

            {/* Personal Info Modal */}
            <Modal visible={showPersonalModal} animationType="slide" transparent={true}>
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.container}>
                        <View style={modalStyles.header}>
                            <Text style={modalStyles.title}>Edit Personal Info</Text>
                            <TouchableOpacity onPress={() => setShowPersonalModal(false)}>
                                <MaterialIcons name="close" size={24} color="#059669" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={modalStyles.content}>
                            <View style={modalStyles.inputGroup}>
                                <Text style={modalStyles.label}>Full Name</Text>
                                <TextInput
                                    style={modalStyles.input}
                                    value={editData.name}
                                    onChangeText={(text) => setEditData({ ...editData, name: text })}
                                    placeholder="Enter your name"
                                />
                            </View>

                            <View style={modalStyles.inputGroup}>
                                <Text style={modalStyles.label}>Email</Text>
                                <TextInput
                                    style={modalStyles.input}
                                    value={editData.email}
                                    onChangeText={(text) => setEditData({ ...editData, email: text })}
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={modalStyles.inputGroup}>
                                <Text style={modalStyles.label}>Phone Number</Text>
                                <TextInput
                                    style={modalStyles.input}
                                    value={editData.phone}
                                    onChangeText={(text) => setEditData({ ...editData, phone: text })}
                                    placeholder="Enter your phone"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </ScrollView>

                        <View style={modalStyles.footer}>
                            <TouchableOpacity 
                                style={[modalStyles.button, modalStyles.cancelButton]}
                                onPress={() => setShowPersonalModal(false)}
                            >
                                <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[modalStyles.button, modalStyles.saveButton]}
                                onPress={handleSavePersonal}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={modalStyles.saveButtonText}>Save Changes</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Vehicle Info Modal */}
            <Modal visible={showVehicleModal} animationType="slide" transparent={true}>
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.container}>
                        <View style={modalStyles.header}>
                            <Text style={modalStyles.title}>Edit Vehicle Info</Text>
                            <TouchableOpacity onPress={() => setShowVehicleModal(false)}>
                                <MaterialIcons name="close" size={24} color="#059669" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={modalStyles.content}>
                            <View style={modalStyles.inputGroup}>
                                <Text style={modalStyles.label}>Vehicle Model</Text>
                                <TextInput
                                    style={modalStyles.input}
                                    value={editData.vehicleModel}
                                    onChangeText={(text) => setEditData({ ...editData, vehicleModel: text })}
                                    placeholder="e.g., Toyota Prius"
                                />
                            </View>

                            <View style={modalStyles.inputGroup}>
                                <Text style={modalStyles.label}>License Plate</Text>
                                <TextInput
                                    style={modalStyles.input}
                                    value={editData.vehiclePlate}
                                    onChangeText={(text) => setEditData({ ...editData, vehiclePlate: text })}
                                    placeholder="e.g., ABC-1234"
                                />
                            </View>

                            <View style={modalStyles.inputGroup}>
                                <Text style={modalStyles.label}>Year</Text>
                                <TextInput
                                    style={modalStyles.input}
                                    value={editData.vehicleYear}
                                    onChangeText={(text) => setEditData({ ...editData, vehicleYear: text })}
                                    placeholder="e.g., 2020"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={modalStyles.inputGroup}>
                                <Text style={modalStyles.label}>Color</Text>
                                <TextInput
                                    style={modalStyles.input}
                                    value={editData.vehicleColor}
                                    onChangeText={(text) => setEditData({ ...editData, vehicleColor: text })}
                                    placeholder="e.g., Silver"
                                />
                            </View>
                        </ScrollView>

                        <View style={modalStyles.footer}>
                            <TouchableOpacity 
                                style={[modalStyles.button, modalStyles.cancelButton]}
                                onPress={() => setShowVehicleModal(false)}
                            >
                                <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[modalStyles.button, modalStyles.saveButton]}
                                onPress={handleSaveVehicle}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={modalStyles.saveButtonText}>Save Changes</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECFDF5',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: -40,
    },
});

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#064E3B',
    },
    content: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#A7F3D0',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#064E3B',
        backgroundColor: '#ECFDF5',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
    },
    saveButton: {
        backgroundColor: '#10B981',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

export default ProfileScreen;