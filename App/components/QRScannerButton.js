import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const QRScannerButton = () => {
    return (
        <TouchableOpacity style={styles.button}>
            <MaterialIcons name="qr-code-scanner" size={24} color="#FFFFFF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 56,
        height: 56,
        backgroundColor: '#135bec',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
});

export default QRScannerButton;