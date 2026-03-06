import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
// Removed: import apiService from '../services/api';

const WishlistScreen = () => {
    const navigation = useNavigation();
    
    // Mock wishlist data
    const [wishlistItems, setWishlistItems] = useState([
        { 
            id: 1, 
            name: 'Wireless Bluetooth Headphones', 
            price: 79.99, 
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            inStock: true
        },
        { 
            id: 2, 
            name: 'Smart Watch Series 7', 
            price: 399.99, 
            image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
            inStock: true
        },
        { 
            id: 3, 
            name: 'Professional Camera Lens', 
            price: 899.99, 
            image_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400',
            inStock: false
        },
        { 
            id: 4, 
            name: 'Running Shoes Pro', 
            price: 129.99, 
            image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
            inStock: true
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Simple refresh handler - no API calls
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleRemoveItem = (itemId) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Remove', 
                    style: 'destructive',
                    onPress: () => {
                        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
                    }
                }
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear Wishlist',
            'Remove all items from your wishlist?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Clear All', 
                    style: 'destructive',
                    onPress: () => {
                        setWishlistItems([]);
                    }
                }
            ]
        );
    };

    const handleAddToCart = (item) => {
        Alert.alert('Added to Cart', `${item.name} has been added to your cart.`);
    };

    const renderWishlistItem = ({ item }) => (
        <View style={styles.itemCard}>
            <View style={styles.itemImageContainer}>
                <View style={styles.itemImagePlaceholder}>
                    <MaterialIcons name="image" size={32} color="#9CA3AF" />
                </View>
                {!item.inStock && (
                    <View style={styles.outOfStockBadge}>
                        <Text style={styles.outOfStockText}>Out of Stock</Text>
                    </View>
                )}
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <View style={styles.itemActions}>
                    <TouchableOpacity 
                        style={[styles.addToCartButton, !item.inStock && styles.addToCartButtonDisabled]}
                        onPress={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                    >
                        <MaterialIcons name="shopping-cart" size={20} color="#fff" />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => handleRemoveItem(item.id)}
                    >
                        <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wishlist</Text>
                {wishlistItems.length > 0 && (
                    <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
                        <MaterialIcons name="delete-sweep" size={20} color="#EF4444" />
                    </TouchableOpacity>
                )}
            </View>

            {wishlistItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="favorite-border" size={64} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                    <Text style={styles.emptyText}>Start adding items you love!</Text>
                    <TouchableOpacity 
                        style={styles.browseButton}
                        onPress={() => navigation.navigate('ProductCatalog')}
                    >
                        <Text style={styles.browseButtonText}>Browse Products</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={wishlistItems}
                    renderItem={renderWishlistItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#1e3b8a']}
                            tintColor="#1e3b8a"
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};