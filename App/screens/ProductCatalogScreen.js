import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import CustomerBottomNavbar from '../components/CustomerBottomNavbar';

const ProductCatalogScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const [selectedCategory, setSelectedCategory] = useState('All');

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

    const handleSearch = (query) => {
        console.log('Searching for:', query);
        // Implement search logic here
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        console.log('Category changed to:', category);
        // Implement category filtering logic here
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
        console.log('Product pressed:', product.name);
        // Implement product detail navigation here
    };

    const handleTabPress = (tab) => {
        setActiveTab(tab);
        console.log('Tab pressed:', tab);
        // Implement tab navigation logic here
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
                <Text style={styles.title}>Explore</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <MaterialIcons name="tune" size={24} color="#111318" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Category Tabs */}
            <CategoryTabs onCategoryChange={handleCategoryChange} />

            {/* Pull to refresh indicator */}
            <View style={styles.refreshIndicator}>
                <ActivityIndicator size="small" color="#cbd5e1" />
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
                            <ProductCard
                                product={product}
                                onAddToCart={handleAddToCart}
                                onToggleFavorite={handleToggleFavorite}
                                onPress={handleProductPress}
                            />
                        </View>
                    ))}
                </View>

                {/* Loading more indicator */}
                <View style={styles.loadingMore}>
                    <ActivityIndicator size="small" color="#1152d4" />
                    <Text style={styles.loadingMoreText}>Loading more...</Text>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <CustomerBottomNavbar 
                activeTab={activeTab}
                onTabPress={handleTabPress}
            />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(246, 246, 248, 0.8)',
        backdropFilter: 'blur(12px)',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111318',
        letterSpacing: -0.3,
    },
    filterButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    refreshIndicator: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    productGrid: {
        flex: 1,
    },
    productGridContent: {
        paddingHorizontal: 16,
        paddingBottom: 120, // Increased space for bottom navbar
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 20,
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