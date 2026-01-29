import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CategoryHeader = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shop by Category</Text>
            <Text style={styles.subtitle}>Discover our curated collections</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 32,
        paddingHorizontal: 24,
        paddingBottom: 16,
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
        fontWeight: '400',
    },
});

export default CategoryHeader;