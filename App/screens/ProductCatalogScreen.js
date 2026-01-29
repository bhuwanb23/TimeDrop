import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { navigate } from '../utils/RootNavigation';


const ProductCatalogScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    // Sample product data
    const sampleProducts = [
        {
            id: 1,
            name: 'Wireless Headphones',
            price: '129.00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEdclVWy3M8BxMzFeb1J8f-hS8djSpmXa6b9iE8h9X0A8zLlFO0WmE7ZRrSxnR9-_RWY_1PMTL4TOfjJHRSHdDJn1rdYoASaK6VNdURRjwlX8q5eqYehv8VH3a5CRK9MEDCT4APc6sV1p55Dq4Wecd4F8m8ik8Hu6RTrUZx4pr0tY44g57TsGfQx_Ijy9PGKM4Av2BEK-nsWHj2gVGmBRK67hOY1nqg_tSaKzx960_DQQpAn07KDKG5qhO9UfXeV8BVvLayHEnPgE',
            category: 'Electronics',
            isFavorite: false
        },
        {
            id: 2,
            name: 'Smart Watch Series 7',
            price: '199.00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQO437bK_hgQmHBH9VoZkMmbRpEslnGjb9OmHyaCKtH6qe6i0p3Z7EXKX5kMG8Zf5ZGHPHcwIhKYl9g7u-uPA1ui4BoLYK5FDtLaRsCy5lQMSJmucwZ2OqlWzrQXGVtGF39nvi_vlfJ-iTvHpL90HXtzK6OBj-l3Fl3GelEeZItTGgwWBCatUx2yRxYaMYBeM533BOKAf4iFRX_uuMj3JbTaea4Vre3rEApKuXSRO1mAMSisEQP15ykRRaE1sUuqEGc_Ysniz_MIg',
            category: 'Electronics',
            isFavorite: true
        },
        {
            id: 3,
            name: 'Minimalist Lamp',
            price: '45.00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKS0Pgzg5smSaKAiicZemb5MlJn114352m03oR2dmX9Uaiv7VIrAKughWPR8uz77s0QCTcAdt1GugcbACR2JOXd7GdhFTORwRZkbkLdWDm-ufDhZhkioucO-rlgIu3gGouseZl00OlkGV70_iuxXBwIdQvItQKkpMQmfg_kTmbo3IkO-iOfZ8iqmJjoeD2JSPagh2Jc7ewKn1zZD9hdfDS0-N-xYhtOp--7mh1qlmJKcoo5TNsTg6iG7j-nAGmYE72e6leicMG4AU',
            category: 'Home',
            isFavorite: false
        },
        {
            id: 4,
            name: 'Leather Jacket',
            price: '120.00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBBqBSbJ6tsg-GPkChiFsBu4qV5kOhQe9zicIg2RFU9sohLTWC0nslkxbLPOJ0vAl3OxrvxkpqEKufQcu14lPsMGU_l0zyFTh50UP0GHRqmxwVcPFEZIM-Cra4uQBML6c6Mbq7RjN2yKW63liuwhZt8FQF6L1RdluIbJTYonkZucdwexp2f6vDNB6L8vcnypK_LKcwnxfaut6uOjeMKL9dr3cikoIDPp7_QbwSemyE6U6tXEC1BI9J1KcKnS0vz6uczJX8V_nbeHY',
            category: 'Fashion',
            isFavorite: false
        },
        {
            id: 5,
            name: 'Bluetooth Speaker',
            price: '79.99',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEdclVWy3M8BxMzFeb1J8f-hS8djSpmXa6b9iE8h9X0A8zLlFO0WmE7ZRrSxnR9-_RWY_1PMTL4TOfjJHRSHdDJn1rdYoASaK6VNdURRjwlX8q5eqYehv8VH3a5CRK9MEDCT4APc6sV1p55Dq4Wecd4F8m8ik8Hu6RTrUZx4pr0tY44g57TsGfQx_Ijy9PGKM4Av2BEK-nsWHj2gVGmBRK67hOY1nqg_tSaKzx960_DQQpAn07KDKG5qhO9UfXeV8BVvLayHEnPgE',
            category: 'Electronics',
            isFavorite: false
        },
        {
            id: 6,
            name: 'Running Shoes',
            price: '89.99',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQO437bK_hgQmHBH9VoZkMmbRpEslnGjb9OmHyaCKtH6qe6i0p3Z7EXKX5kMG8Zf5ZGHPHcwIhKYl9g7u-uPA1ui4BoLYK5FDtLaRsCy5lQMSJmucwZ2OqlWzrQXGVtGF39nvi_vlfJ-iTvHpL90HXtzK6OBj-l3Fl3GelEeZItTGgwWBCatUx2yRxYaMYBeM533BOKAf4iFRX_uuMj3JbTaea4Vre3rEApKuXSRO1mAMSisEQP15ykRRaE1sUuqEGc_Ysniz_MIg',
            category: 'Fashion',
            isFavorite: true
        },
        {
            id: 7,
            name: 'Coffee Maker',
            price: '59.99',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKS0Pgzg5smSaKAiicZemb5MlJn114352m03oR2dmX9Uaiv7VIrAKughWPR8uz77s0QCTcAdt1GugcbACR2JOXd7GdhFTORwRZkbkLdWDm-ufDhZhkioucO-rlgIu3gGouseZl00OlkGV70_iuxXBwIdQvItQKkpMQmfg_kTmbo3IkO-iOfZ8iqmJjoeD2JSPagh2Jc7ewKn1zZD9hdfDS0-N-xYhtOp--7mh1qlmJKcoo5TNsTg6iG7j-nAGmYE72e6leicMG4AU',
            category: 'Home',
            isFavorite: false
        },
        {
            id: 8,
            name: 'Backpack',
            price: '49.99',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBBqBSbJ6tsg-GPkChiFsBu4qV5kOhQe9zicIg2RFU9sohLTWC0nslkxbLPOJ0vAl3OxrvxkpqEKufQcu14lPsMGU_l0zyFTh50UP0GHRqmxwVcPFEZIM-Cra4uQBML6c6Mbq7RjN2yKW63liuwhZt8FQF6L1RdluIbJTYonkZucdwexp2f6vDNB6L8vcnypK_LKcwnxfaut6uOjeMKL9dr3cikoIDPp7_QbwSemyE6U6tXEC1BI9J1KcKnS0vz6uczJX8V_nbeHY',
            category: 'Accessories',
            isFavorite: false
        },
        {
            id: 9,
            name: 'Wireless Earbuds',
            price: '89.00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEdclVWy3M8BxMzFeb1J8f-hS8djSpmXa6b9iE8h9X0A8zLlFO0WmE7ZRrSxnR9-_RWY_1PMTL4TOfjJHRSHdDJn1rdYoASaK6VNdURRjwlX8q5eqYehv8VH3a5CRK9MEDCT4APc6sV1p55Dq4Wecd4F8m8ik8Hu6RTrUZx4pr0tY44g57TsGfQx_Ijy9PGKM4Av2BEK-nsWHj2gVGmBRK67hOY1nqg_tSaKzx960_DQQpAn07KDKG5qhO9UfXeV8BVvLayHEnPgE',
            category: 'Electronics',
            isFavorite: true
        },
        {
            id: 10,
            name: 'Desk Organizer',
            price: '34.99',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQO437bK_hgQmHBH9VoZkMmbRpEslnGjb9OmHyaCKtH6qe6i0p3Z7EXKX5kMG8Zf5ZGHPHcwIhKYl9g7u-uPA1ui4BoLYK5FDtLaRsCy5lQMSJmucwZ2OqlWzrQXGVtGF39nvi_vlfJ-iTvHpL90HXtzK6OBj-l3Fl3GelEeZItTGgwWBCatUx2yRxYaMYBeM533BOKAf4iFRX_uuMj3JbTaea4Vre3rEApKuXSRO1mAMSisEQP15ykRRaE1sUuqEGc_Ysniz_MIg',
            category: 'Home',
            isFavorite: false
        },
        {
            id: 11,
            name: 'Sunglasses',
            price: '75.00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKS0Pgzg5smSaKAiicZemb5MlJn114352m03oR2dmX9Uaiv7VIrAKughWPR8uz77s0QCTcAdt1GugcbACR2JOXd7GdhFTORwRZkbkLdWDm-ufDhZhkioucO-rlgIu3gGouseZl00OlkGV70_iuxXBwIdQvItQKkpMQmfg_kTmbo3IkO-iOfZ8iqmJjoeD2JSPagh2Jc7ewKn1zZD9hdfDS0-N-xYhtOp--7mh1qlmJKcoo5TNsTg6iG7j-nAGmYE72e6leicMG4AU',
            category: 'Fashion',
            isFavorite: false
        },
        {
            id: 12,
            name: 'Water Bottle',
            price: '24.99',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBBqBSbJ6tsg-GPkChiFsBu4qV5kOhQe9zicIg2RFU9sohLTWC0nslkxbLPOJ0vAl3OxrvxkpqEKufQcu14lPsMGU_l0zyFTh50UP0GHRqmxwVcPFEZIM-Cra4uQBML6c6Mbq7RjN2yKW63liuwhZt8FQF6L1RdluIbJTYonkZucdwexp2f6vDNB6L8vcnypK_LKcwnxfaut6uOjeMKL9dr3cikoIDPp7_QbwSemyE6U6tXEC1BI9J1KcKnS0vz6uczJX8V_nbeHY',
            category: 'Accessories',
            isFavorite: true
        }
    ];

    useEffect(() => {
        // Simulate loading products
        setTimeout(() => {
            setProducts(sampleProducts);
            setLoading(false);
        }, 1000);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const handleAddToCart = (productId) => {
        console.log('Adding product to cart:', productId);
        // Implement add to cart logic here
    };

    const handleToggleFavorite = (productId, isFavorite) => {
        console.log('Toggling favorite for product:', productId, 'to:', isFavorite);
        // Implement favorite toggle logic here
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
        const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);

        const handleFavoritePress = () => {
            const newFavoriteState = !isFavorite;
            setIsFavorite(newFavoriteState);
            handleToggleFavorite(product.id, newFavoriteState);
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
                        <Text style={styles.price}>${product.price}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.addToCartButton}
                        onPress={() => handleAddToCart(product.id)}
                    >
                        <MaterialIcons name="shopping-bag" size={16} color="#ffffff" />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1152d4" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <MaterialIcons name="tune" size={24} color="#111318" />
                </TouchableOpacity>
            </View>

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
            >
                <View style={styles.grid}>
                    {products.map((product) => (
                        <View key={product.id} style={styles.gridItem}>
                            <ProductCard product={product} />
                        </View>
                    ))}
                </View>

                {/* Loading more indicator */}
                <View style={styles.loadingMore}>
                    <ActivityIndicator size="small" color="#1152d4" />
                    <Text style={styles.loadingMoreText}>Loading more...</Text>
                </View>
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
        justifyContent: 'space-between',
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
    filterButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
});

export default ProductCatalogScreen;