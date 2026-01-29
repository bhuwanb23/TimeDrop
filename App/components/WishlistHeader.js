import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const WishlistHeader = ({ itemCount, onClearAll }) => {
    const handleClearAll = () => {
        if (itemCount === 0) {
            Alert.alert('Empty Wishlist', 'Your wishlist is already empty.');
            return;
        }
        
        Alert.alert(
            'Clear Wishlist',
            `Are you sure you want to remove all ${itemCount} items from your wishlist?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Clear All', 
                    style: 'destructive', 
                    onPress: onClearAll 
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>My Wishlist</Text>
                <Text style={styles.subtitle}>{itemCount} Items</Text>
            </View>
            <TouchableOpacity 
                style={styles.clearButton}
                onPress={handleClearAll}
                disabled={itemCount === 0}
            >
                <Text style={[
                    styles.clearButtonText,
                    itemCount === 0 && styles.clearButtonDisabled
                ]}>
                    Clear All
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 24,
        paddingBottom: 24,
        backgroundColor: 'rgba(246, 246, 248, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(226, 232, 240, 0.5)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#0f172a',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    clearButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1152d4',
    },
    clearButtonDisabled: {
        color: '#cbd5e1',
    },
});

export default WishlistHeader;