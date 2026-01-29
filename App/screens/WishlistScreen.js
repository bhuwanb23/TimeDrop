import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import WishlistHeader from '../components/WishlistHeader';
import WishlistItem from '../components/WishlistItem';

const WishlistScreen = ({ navigation }) => {
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: 'Classic Minimalist Watch',
            price: 129.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBBqBSbJ6tsg-GPkChiFsBu4qV5kOhQe9zicIg2RFU9sohLTWC0nslkxbLPOJ0vAl3OxrvxkpqEKufQcu14lPsMGU_l0zyFTh50UP0GHRqmxwVcPFEZIM-Cra4uQBML6c6Mbq7RjN2yKW63liuwhZt8FQF6L1RdluIbJTYonkZucdwexp2f6vDNB6L8vcnypK_LKcwnxfaut6uOjeMKL9dr3cikoIDPp7_QbwSemyE6U6tXEC1BI9J1KcKnS0vz6uczJX8V_nbeHY',
            category: 'Accessories',
            color: 'Silver',
            isFavorited: true,
            isOnSale: false
        },
        {
            id: 2,
            name: 'Wireless Noise Headphones',
            price: 249.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEdclVWy3M8BxMzFeb1J8f-hS8djSpmXa6b9iE8h9X0A8zLlFO0WmE7ZRrSxnR9-_RWY_1PMTL4TOfjJHRSHdDJn1rdYoASaK6VNdURRjwlX8q5eqYehv8VH3a5CRK9MEDCT4APc6sV1p55Dq4Wecd4F8m8ik8Hu6RTrUZx4pr0tY44g57TsGfQx_Ijy9PGKM4Av2BEK-nsWHj2gVGmBRK67hOY1nqg_tSaKzx960_DQQpAn07KDKG5qhO9UfXeV8BVvLayHEnPgE',
            category: 'Tech',
            color: 'Midnight Blue',
            isFavorited: false,
            isOnSale: false
        },
        {
            id: 3,
            name: 'Luxury Scented Candle',
            price: 34.00,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQO437bK_hgQmHBH9VoZkMmbRpEslnGjb9OmHyaCKtH6qe6i0p3Z7EXKX5kMG8Zf5ZGHPHcwIhKYl9g7u-uPA1ui4BoLYK5FDtLaRsCy5lQMSJmucwZ2OqlWzrQXGVtGF39nvi_vlfJ-iTvHpL90HXtzK6OBj-l3Fl3GelEeZItTGgwWBCatUx2yRxYaMYBeM533BOKAf4iFRX_uuMj3JbTaea4Vre3rEApKuXSRO1mAMSisEQP15ykRRaE1sUuqEGc_Ysniz_MIg',
            category: 'Home',
            color: 'Sandalwood',
            isFavorited: false,
            isOnSale: true
        },
        {
            id: 4,
            name: 'Smart Coffee Brewer',
            price: 189.99,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKS0Pgzg5smSaKAiicZemb5MlJn114352m03oR2dmX9Uaiv7VIrAKughWPR8uz77s0QCTcAdt1GugcbACR2JOXd7GdhFTORwRZkbkLdWDm-ufDhZhkioucO-rlgIu3gGouseZl00OlkGV70_iuxXBwIdQvItQKkpMQmfg_kTmbo3IkO-iOfZ8iqmJjoeD2JSPagh2Jc7ewKn1zZD9hdfDS0-N-xYhtOp--7mh1qlmJKcoo5TNsTg6iG7j-nAGmYE72e6leicMG4AU',
            category: 'Tech',
            color: 'Matte Black',
            isFavorited: true,
            isOnSale: false
        }
    ]);

    const handleRemoveItem = (itemId) => {
        setWishlistItems(prevItems => 
            prevItems.filter(item => item.id !== itemId)
        );
    };

    const handleMoveToCart = (item) => {
        // Here you would add the item to cart
        console.log('Moving to cart:', item.name);
        // Remove from wishlist after moving to cart
        handleRemoveItem(item.id);
    };

    const handleClearAll = () => {
        setWishlistItems([]);
        Alert.alert('Success', 'All items removed from wishlist');
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <WishlistHeader 
                    itemCount={wishlistItems.length}
                    onClearAll={handleClearAll}
                />
                
                <View style={styles.itemsContainer}>
                    {wishlistItems.map(item => (
                        <View key={item.id} style={styles.itemWrapper}>
                            <WishlistItem 
                                item={item}
                                onRemove={handleRemoveItem}
                                onMoveToCart={handleMoveToCart}
                            />
                        </View>
                    ))}
                </View>
                
                {wishlistItems.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Your wishlist is empty</Text>
                        <Text style={styles.emptySubtext}>Start adding items you love!</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
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