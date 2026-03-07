import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileHeader from '../components/ProfileHeader';
import StatusToggleCard from '../components/StatusToggleCard';
import EarningsCard from '../components/EarningsCard';
import VehicleInfoCard from '../components/VehicleInfoCard';
import SettingsCard from '../components/SettingsCard';
import LogoutButton from '../components/LogoutButton';

const ProfileScreen = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ProfileHeader />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                <StatusToggleCard />
                <EarningsCard />
                <VehicleInfoCard />
                <SettingsCard />
                <LogoutButton />
            </ScrollView>
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
        paddingTop: -40, // Pull content up under the header
    },
});

export default ProfileScreen;