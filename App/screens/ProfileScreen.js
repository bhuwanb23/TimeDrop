import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Profile Screen</Text>
                <Text style={styles.subtitle}>This screen will show driver profile information</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
});

export default ProfileScreen;