import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CategoryCard = ({ category, onPress }) => {
    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={() => onPress(category)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: category.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.overlay} />
            </View>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{category.name}</Text>
                    <Text style={styles.count}>{category.productCount} Products</Text>
                </View>
                <View style={styles.arrowContainer}>
                    <MaterialIcons 
                        name="chevron-right" 
                        size={24} 
                        color="#ffffff" 
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 192,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    imageContainer: {
        flex: 1,
        backgroundColor: '#e2e8f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    count: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
    arrowContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(12px)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
});

export default CategoryCard;