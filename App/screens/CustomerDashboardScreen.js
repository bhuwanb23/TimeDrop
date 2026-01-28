import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const CustomerDashboardScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Hello there!</Text>
                    <Text style={styles.title}>Welcome to TimeDrop</Text>
                    <Text style={styles.subtitle}>Your favorite delivery service</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.featureCard}>
                        <MaterialIcons name="shopping-cart" size={40} color="#1152d4" />
                        <Text style={styles.featureTitle}>Browse Products</Text>
                        <Text style={styles.featureDescription}>Discover amazing items near you</Text>
                    </View>

                    <View style={styles.featureCard}>
                        <MaterialIcons name="local-shipping" size={40} color="#1152d4" />
                        <Text style={styles.featureTitle}>Track Orders</Text>
                        <Text style={styles.featureDescription}>Real-time updates on your deliveries</Text>
                    </View>

                    <View style={styles.featureCard}>
                        <MaterialIcons name="support-agent" size={40} color="#1152d4" />
                        <Text style={styles.featureTitle}>24/7 Support</Text>
                        <Text style={styles.featureDescription}>We're here to help you anytime</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with love for you</Text>
                    <Text style={styles.footerSubtext}>Crafted with care just for you</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 20,
    },
    welcomeText: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111318',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
    },
    content: {
        gap: 20,
        marginBottom: 30,
    },
    featureCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111318',
        marginTop: 16,
        marginBottom: 8,
    },
    featureDescription: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
    footer: {
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    footerText: {
        fontSize: 14,
        color: '#1152d4',
        fontWeight: '600',
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 12,
        color: '#94a3b8',
    },
});

export default CustomerDashboardScreen;