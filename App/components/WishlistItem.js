import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const WishlistItem = ({ item, onRemove, onMoveToCart }) => {
    const handleRemove = () => {
        Alert.alert(
            'Remove from Wishlist',
            `Are you sure you want to remove ${item.name} from your wishlist?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => onRemove(item.id) }
            ]
        );
    };

    const handleMoveToCart = () => {
        onMoveToCart(item);
        Alert.alert('Success', `${item.name} moved to cart!`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {item.isFavorited && (
                    <View style={styles.heartBadge}>
                        <MaterialIcons 
                            name="favorite" 
                            size={16} 
                            color="#ef4444" 
                        />
                    </View>
                )}
            </View>
            
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text style={styles.category}>
                            {item.category} • {item.color}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={handleRemove}
                    >
                        <MaterialIcons 
                            name="delete" 
                            size={24} 
                            color="#94a3b8" 
                        />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.footer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                        {item.isOnSale && (
                            <Text style={styles.saleText}>Sale ends soon</Text>
                        )}
                    </View>
                    <TouchableOpacity 
                        style={styles.moveButton}
                        onPress={handleMoveToCart}
                    >
                        <Text style={styles.moveButtonText}>Move to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        gap: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    imageContainer: {
        width: 96,
        height: 96,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartBadge: {
        position: 'absolute',
        top: 4,
        left: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    category: {
        fontSize: 12,
        color: '#64748b',
    },
    deleteButton: {
        padding: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 8,
    },
    priceContainer: {
        flexDirection: 'column',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 2,
    },
    saleText: {
        fontSize: 10,
        color: '#ef4444',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    moveButton: {
        backgroundColor: '#1152d4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    moveButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default WishlistItem;