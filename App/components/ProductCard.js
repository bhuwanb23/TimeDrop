import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProductCard = ({ 
    product, 
    onAddToCart, 
    onToggleFavorite,
    onPress 
}) => {
    const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);

    const handleFavoritePress = () => {
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);
        if (onToggleFavorite) {
            onToggleFavorite(product.id, newFavoriteState);
        }
    };

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(product.id);
        }
    };

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={() => onPress && onPress(product)}
        >
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={handleFavoritePress}
                >
                    <MaterialIcons 
                        name={isFavorite ? "favorite" : "favorite-border"}
                        size={20}
                        color={isFavorite ? "#1152d4" : "#94a3b8"}
                        style={isFavorite && styles.activeFavorite}
                    />
                </TouchableOpacity>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {product.name}
                </Text>
                
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${product.price}</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddToCart}
                >
                    <MaterialIcons name="shopping-bag" size={16} color="#ffffff" />
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 12,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 4/5,
        backgroundColor: '#e2e8f0',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    activeFavorite: {
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111318',
        lineHeight: 20,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        backgroundColor: 'rgba(17, 82, 212, 0.1)',
        color: '#1152d4',
        fontSize: 14,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    addButton: {
        marginTop: 8,
        width: '100%',
        height: 40,
        backgroundColor: '#1152d4',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default ProductCard;