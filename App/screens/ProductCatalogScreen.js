import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { navigate } from '../utils/RootNavigation';
import { useCart } from '../context/CartContext';

const ProductCatalogScreen = () => {
    const [products, setProducts] = useState([
        { 
            id: 1, 
            name: 'Wireless Bluetooth Headphones', 
            price: 79.99, 
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 
            description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
            category: 'Electronics',
            stock: 45,
            rating: 4.8
        },
        { 
            id: 2, 
            name: 'Smart Watch Series 7', 
            price: 399.99, 
            image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400', 
            description: 'Advanced fitness tracking, ECG, and always-on Retina display',
            category: 'Electronics',
            stock: 23,
            rating: 4.9
        },
        { 
            id: 3, 
            name: 'Organic Cotton T-Shirt', 
            price: 29.99, 
            image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 
            description: 'Comfortable and sustainable 100% organic cotton t-shirt',
            category: 'Fashion',
            stock: 120,
            rating: 4.5
        },
        { 
            id: 4, 
            name: 'Professional Camera Lens', 
            price: 899.99, 
            image_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400', 
            description: '50mm f/1.8 prime lens for stunning portraits',
            category: 'Electronics',
            stock: 12,
            rating: 4.9
        },
        { 
            id: 5, 
            name: 'Running Shoes Pro', 
            price: 129.99, 
            image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 
            description: 'Lightweight performance running shoes with responsive cushioning',
            category: 'Sports',
            stock: 67,
            rating: 4.7
        },
        { 
            id: 6, 
            name: 'Minimalist Desk Lamp', 
            price: 49.99, 
            image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', 
            description: 'LED desk lamp with adjustable brightness and color temperature',
            category: 'Home & Garden',
            stock: 89,
            rating: 4.6
        },
        { 
            id: 7, 
            name: 'Yoga Mat Premium', 
            price: 39.99, 
            image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 
            description: 'Extra thick eco-friendly yoga mat with carrying strap',
            category: 'Sports',
            stock: 156,
            rating: 4.8
        },
        { 
            id: 8, 
            name: 'Stainless Steel Water Bottle', 
            price: 24.99, 
            image_url: 'https://images.unsplash.com/photo-1602143407151-011141951e7a?w=400', 
            description: 'Insulated water bottle keeps drinks cold for 24 hours',
            category: 'Sports',
            stock: 234,
            rating: 4.7
        },
        { 
            id: 9, 
            name: 'Leather Wallet', 
            price: 59.99, 
            image_url: 'https://images.unsplash.com/photo-1627123424574-18bd08331092?w=400', 
            description: 'Genuine leather bifold wallet with RFID protection',
            category: 'Fashion',
            stock: 78,
            rating: 4.6
        },
        { 
            id: 10, 
            name: 'Portable Bluetooth Speaker', 
            price: 89.99, 
            image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 
            description: 'Waterproof speaker with 360° sound and 12-hour playtime',
            category: 'Electronics',
            stock: 92,
            rating: 4.8
        },
        { 
            id: 11, 
            name: 'Bestseller Novel Collection', 
            price: 34.99, 
            image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 
            description: 'Box set of 5 award-winning novels',
            category: 'Books',
            stock: 43,
            rating: 4.9
        },
        { 
            id: 12, 
            name: 'Gaming Mouse RGB', 
            price: 69.99, 
            image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 
            description: 'High-precision gaming mouse with customizable RGB lighting',
            category: 'Electronics',
            stock: 56,
            rating: 4.7
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('DESC');
    const [favorites, setFavorites] = useState(new Set());
    const navigation = useNavigation();
    const { addItem, items: cartItems } = useCart();

    // Simple refresh handler - no API calls
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleAddToCart = async (product) => {
        try {
            await addItem(product, 1); // Add 1 quantity of the product
            Alert.alert('Success', `${product.name} added to cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            Alert.alert('Error', error.message || 'Failed to add item to cart');
        }
    };

    const loadMoreProducts = () => {
        if (!isLoadingMore && hasMore) {
            loadProducts(page + 1);
            setPage(prev => prev + 1);
        }
    };

    const handleToggleFavorite = (productId, isFavorite) => {
        console.log('Toggling favorite for product:', productId, 'to:', isFavorite);
        // Implement favorite toggle logic here
    };

    // Debounced search function
    const debouncedSearch = debounce((query) => {
        setSearchQuery(query);
        setPage(1); // Reset to page 1 when searching
        loadProducts(1, false, true);
    }, 500); // 500ms delay

    const handleSearchChange = (query) => {
        debouncedSearch(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setPage(1);
        loadProducts(1, false, true);
    };

    const applyFilters = (category, sortByParam = null, sortOrderParam = null) => {
        setSelectedCategory(category);
        if (sortByParam) setSortBy(sortByParam);
        if (sortOrderParam) setSortOrder(sortOrderParam);
        setPage(1);
        loadProducts(1, false, true);
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSortBy('createdAt');
        setSortOrder('DESC');
        setSearchQuery('');
        setPage(1);
        loadProducts(1, false, true);
    };

    const handleProductPress = (product) => {
        // Get parent navigation to access the ProductDetail screen
        const parent = navigation.getParent();
        if (parent) {
            parent.navigate('ProductDetail', { product });
        } else {
            navigation.navigate('ProductDetail', { product });
        }
    };

    const ProductCard = ({ product }) => {
        const isFavorite = favorites.has(product.id);

        const handleFavoritePress = () => {
            const newFavorites = new Set(favorites);
            if (isFavorite) {
                newFavorites.delete(product.id);
            } else {
                newFavorites.add(product.id);
            }
            setFavorites(newFavorites);
            handleToggleFavorite(product.id, !isFavorite);
        };

        const handleCardPress = () => {
            console.log('Card pressed for product:', product.name);
            handleProductPress(product);
        };

        return (
            <View style={styles.productCard}>
                <TouchableOpacity
                    style={styles.productImageContainer}
                    onPress={handleCardPress}
                >
                    <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleFavoritePress();
                        }}
                    >
                        <MaterialIcons
                            name={isFavorite ? "favorite" : "favorite-border"}
                            size={20}
                            color={isFavorite ? "#1152d4" : "#94a3b8"}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
                <View style={styles.productContent}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                        {product.name}
                    </Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>${parseFloat(product.price).toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={() => handleAddToCart(product)}
                    >
                        <MaterialIcons name="shopping-bag" size={16} color="#ffffff" />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading && products.length === 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1152d4" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with search */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                    />
                    {searchQuery ? (
                        <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                            <MaterialIcons name="close" size={20} color="#64748b" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.filterButton}>
                            <MaterialIcons name="tune" size={24} color="#111318" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Product Grid */}
            <ScrollView
                style={styles.productGrid}
                contentContainerStyle={styles.productGridContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#1152d4']}
                        tintColor="#1152d4"
                    />
                }
                onScroll={({ nativeEvent }) => {
                    if (
                        nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
                        nativeEvent.contentSize.height - 20 &&
                        !isLoadingMore &&
                        hasMore
                    ) {
                        loadMoreProducts();
                    }
                }}
                scrollEventThrottle={400}
            >
                <View style={styles.grid}>
                    {products.map((product) => (
                        <View key={product.id || product._id} style={styles.gridItem}>
                            <ProductCard product={product} />
                        </View>
                    ))}
                </View>

                {/* Loading more indicator */}
                {isLoadingMore && (
                    <View style={styles.loadingMore}>
                        <ActivityIndicator size="small" color="#1152d4" />
                        <Text style={styles.loadingMoreText}>Loading more products...</Text>
                    </View>
                )}

                {!hasMore && products.length > 0 && (
                    <View style={styles.endOfList}>
                        <Text style={styles.endOfListText}>You've reached the end</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
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
        backgroundColor: '#f6f6f8',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(246, 246, 248, 0.8)',
        backdropFilter: 'blur(12px)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111318',
        letterSpacing: 0.4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 12,
        backgroundColor: 'white',
        borderRadius: 24,
        paddingHorizontal: 12,
        height: 40,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 14,
        color: '#111318',
    },
    clearSearchButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    filterButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    errorContainer: {
        marginHorizontal: 16,
        padding: 12,
        backgroundColor: '#fee2e2',
        borderRadius: 8,
        marginBottom: 12,
    },
    errorText: {
        color: '#dc2626',
        textAlign: 'center',
        fontSize: 14,
    },
    productGrid: {
        flex: 1,
    },
    productGridContent: {
        paddingHorizontal: 16,
        paddingBottom: 120, // Extra space for bottom navbar
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%', // Two items per row with spacing
        marginBottom: 16,
    },
    productCard: {
        flexDirection: 'column',
        gap: 12,
    },
    productImageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 4 / 5,
        backgroundColor: '#e2e8f0',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    productImage: {
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
    productContent: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        paddingHorizontal: 4,
    },
    productTitle: {
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
    addToCartButton: {
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
    addToCartText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    loadingMore: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        gap: 8,
    },
    loadingMoreText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    endOfList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        gap: 8,
    },
    endOfListText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
});

export default ProductCatalogScreen;