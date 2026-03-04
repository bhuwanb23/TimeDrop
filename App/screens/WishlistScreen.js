import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator, RefreshControl, Text } from 'react-native';
import WishlistHeader from '../components/WishlistHeader';
import WishlistItem from '../components/WishlistItem';
import apiService from '../services/api';

const WishlistScreen = ({ navigation }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const handleRemoveItem = async (itemId) => {
        try {
            await apiService.wishlist.removeFromWishlist(itemId);
            setWishlistItems(prevItems => 
                prevItems.filter(item => item.id !== itemId)
            );
            Alert.alert('Success', 'Item removed from wishlist');
        } catch (error) {
            console.error('Error removing item:', error);
            Alert.alert('Error', 'Failed to remove item from wishlist');
        }
    };

    const handleMoveToCart = (item) => {
        // Here you would add the item to cart using cart context
        console.log('Moving to cart:', item.product?.name || item.name);
        // Remove from wishlist after moving to cart
        handleRemoveItem(item.id);
    };

    const handleClearAll = async () => {
        Alert.alert(
            'Clear Wishlist',
            'Are you sure you want to remove all items from your wishlist?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Clear All', 
                    style: 'destructive', 
                    onPress: async () => {
                        try {
                            await apiService.wishlist.clearWishlist();
                            setWishlistItems([]);
                            Alert.alert('Success', 'Wishlist cleared');
                        } catch (error) {
                            console.error('Error clearing wishlist:', error);
                            Alert.alert('Error', 'Failed to clear wishlist');
                        }
                    }
                }
            ]
        );
    };

    // Load wishlist from backend
    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiService.wishlist.getWishlist({
                page: 1,
                limit: 20
            });
            
            if (response.data && response.data.data && response.data.data.wishlistItems) {
                setWishlistItems(response.data.data.wishlistItems);
            }
            
            setError(null);
        } catch (err) {
            console.error('Error loading wishlist:', err);
            setError(err.message || 'Failed to load wishlist');
            
            if (!refreshing) {
                Alert.alert('Error', 'Could not load wishlist. Please check your connection.');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadWishlist();
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1152d4" />
                    <Text style={styles.loadingText}>Loading your wishlist...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#1152d4']}
                            tintColor="#1152d4"
                        />
                    }
                >
                    <WishlistHeader 
                        itemCount={wishlistItems.length}
                        onClearAll={handleClearAll}
                    />
                    
                    <View style={styles.itemsContainer}>
                        {wishlistItems.map(item => (
                            <View key={item.id.toString()} style={styles.itemWrapper}>
                                <WishlistItem 
                                    item={item.product || item}
                                    wishlistItemId={item.id}
                                    onRemove={handleRemoveItem}
                                    onMoveToCart={handleMoveToCart}
                                />
                            </View>
                        ))}
                    </View>
                    
                    {wishlistItems.length === 0 && !loading && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Your wishlist is empty</Text>
                            <Text style={styles.emptySubtext}>Start adding items you love!</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 14,
        color: '#ef4444',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 112, // Space for bottom navbar
    },
    itemsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    itemWrapper: {
        // Each wishlist item will have its own styling
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#94a3b8',
    },
});

export default WishlistScreen;