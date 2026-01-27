import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RouteHeader from '../components/RouteHeader';
import RouteMap from '../components/RouteMap';
import RouteBottomSheet from '../components/RouteBottomSheet';

const RouteScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <RouteHeader navigation={navigation} />
            <RouteMap />
            <RouteBottomSheet />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
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
        marginBottom: 16,
    },
    info: {
        fontSize: 14,
        color: '#1E3A8A',
        textAlign: 'center',
    },
});

export default RouteScreen;