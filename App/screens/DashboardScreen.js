import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const DashboardScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>AT</Text>
                    </View>
                    <View>
                        <Text style={styles.driverName}>Alex Thompson</Text>
                        <View style={styles.ratingContainer}>
                            <MaterialIcons name="star" size={14} color="#FFD700" />
                            <Text style={styles.ratingText}>4.95 Rating</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <MaterialIcons name="menu" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.statusCard}>
                <View>
                    <Text style={styles.statusText}>Current Status</Text>
                    <Text style={styles.statusValue}>Online & Active</Text>
                </View>
                <TouchableOpacity style={styles.offlineButton}>
                    <Text style={styles.offlineButtonText}>GO OFFLINE</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome to TimeDrop!</Text>
                <Text style={styles.messageText}>
                    You're successfully logged in. This is a placeholder dashboard screen.
                </Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    header: {
        backgroundColor: '#1e3b8a',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e3b8a',
    },
    driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 22,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        opacity: 0.8,
    },
    ratingText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
    },
    menuButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 24,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
    },
    statusText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 2,
    },
    offlineButton: {
        backgroundColor: '#10b981',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 999,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    offlineButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3b8a',
        marginBottom: 12,
        textAlign: 'center',
    },
    messageText: {
        fontSize: 16,
        color: '#556591',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DashboardScreen;