import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleSharePress = () => {
        console.log('Share product');
    };

    const handleFavoritePress = () => {
        setIsFavorite(!isFavorite);
    };

    const handleAddToCart = () => {
        console.log('Add to cart:', product.id);
    };

    const handleBuyNow = () => {
        console.log('Buy now:', product.id);
    };

    const ExpandableSection = ({ title, children, defaultOpen = false }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);

        return (
            <View style={styles.section}>
                <TouchableOpacity 
                    style={styles.sectionHeader}
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <MaterialIcons 
                        name={isOpen ? "expand-less" : "expand-more"} 
                        size={24} 
                        color="#1152d4" 
                    />
                </TouchableOpacity>
                {isOpen && (
                    <View style={styles.sectionContent}>
                        {children}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header with Image */}
            <View style={styles.header}>
                <Image 
                    source={{ uri: product.image }}
                    style={styles.headerImage}
                    resizeMode="cover"
                />
                <View style={styles.headerOverlay}>
                    <View style={styles.topButtons}>
                        <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
                            <MaterialIcons name="chevron-left" size={24} color="#ffffff" />
                        </TouchableOpacity>
                        <View style={styles.rightButtons}>
                            <TouchableOpacity style={styles.navButton} onPress={handleSharePress}>
                                <MaterialIcons name="share" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navButton} onPress={handleFavoritePress}>
                                <MaterialIcons 
                                    name={isFavorite ? "favorite" : "favorite-border"} 
                                    size={24} 
                                    color={isFavorite ? "#ff4757" : "#ffffff"} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Product Info */}
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <View style={styles.productInfo}>
                    <View style={styles.titleSection}>
                        <Text style={styles.brand}>Pro-Elite Series</Text>
                        <Text style={styles.productName}>{product.name}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <View style={styles.ratingBadge}>
                            <MaterialIcons name="star" size={16} color="#fbbf24" style={styles.starIcon} />
                            <Text style={styles.ratingText}>4.8</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.priceSection}>
                    <Text style={styles.currentPrice}>${product.price}</Text>
                    <Text style={styles.originalPrice}>$240.00</Text>
                </View>

                {/* Description Section */}
                <ExpandableSection title="Description" defaultOpen={true}>
                    <Text style={styles.descriptionText}>
                        Designed for peak delivery performance, the {product.name} features lightweight 
                        carbon-fiber mesh and reactive foam cushioning for all-day comfort on the move.
                    </Text>
                </ExpandableSection>

                {/* Specifications Section */}
                <ExpandableSection title="Specifications">
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Weight</Text>
                        <Text style={styles.specValue}>240g</Text>
                    </View>
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Material</Text>
                        <Text style={styles.specValue}>Breathable PrimeKnit</Text>
                    </View>
                    <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Sole</Text>
                        <Text style={styles.specValue}>High-Grip Rubber</Text>
                    </View>
                </ExpandableSection>

                {/* Reviews Section */}
                <ExpandableSection title="Reviews (128)">
                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewerName}>Michael R.</Text>
                            <Text style={styles.reviewDate}>2 days ago</Text>
                        </View>
                        <Text style={styles.reviewText}>
                            Incredible grip even in rainy weather. Perfect for my delivery shifts.
                        </Text>
                    </View>
                </ExpandableSection>

                {/* Related Products Section */}
                <View style={styles.relatedSection}>
                    <View style={styles.relatedHeader}>
                        <Text style={styles.relatedTitle}>Related Products</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.relatedGrid}>
                        <View style={styles.relatedItem}>
                            <Image 
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq9ZpOZvF18XtDc50Dh13DKCxdoKVpzalMpymyCysshyWsMXCH1mtpPppLtldXtY6mBk8BykW8-07rnSxnFEn3DMjML0rqOoHjc63S44Bg6ITs4ebSTPdrUVAZUChd8c4DNY-U4fxzUP6jHZjnMb2Obwz-iWBAl3AVaKrq8eQSsvzIVLC7jlXeYJVgx5OQxmbAi_jZCDWuFHczK30SkLVEfcOzHKoNpoRUK3ajAmG5kZOxKSSaWTUIkMF5Xdwu_T4RSSXTXzBpvp4' }}
                                style={styles.relatedImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.relatedName} numberOfLines={1}>Cloud Foam Pro</Text>
                            <Text style={styles.relatedPrice}>$145.00</Text>
                        </View>
                        <View style={styles.relatedItem}>
                            <Image 
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6p6PUcQc4xMyWy5ciIEx43zJ8c40PJtYtLMDclqgir1jlynZ5P4_4ews6JSoaHH8puA1_GHeBdgyjqNiTcIz0HAvdp37yxsGkBhBDOu0UsH8L-V3Z2DDyeN372F7vGdvA1PcwhC4qNPLYjjn0zWQeVa3KDe1bIMudRtP2a9jcEXwNc7B3HTTulO47usR7S9BuQXFOF72DZc0-LBcURDr2cAn0brhchI81HYD5UlpqWUAzctY0arScbTi--AAJQfm8KkIpUNmyUKg' }}
                                style={styles.relatedImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.relatedName} numberOfLines={1}>Steady Glide X</Text>
                            <Text style={styles.relatedPrice}>$162.00</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Footer with Action Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
                    <Text style={styles.cartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 24,
    },
    topButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 48,
    },
    rightButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(12px)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        marginTop: -40,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 100,
    },
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    titleSection: {
        flex: 1,
    },
    brand: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    productName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 4,
    },
    ratingContainer: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    starIcon: {
        fontWeight: 'bold',
    },
    ratingText: {
        color: '#1e3a8a',
        fontSize: 14,
        fontWeight: '700',
    },
    priceSection: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 32,
    },
    currentPrice: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1e3a8a',
    },
    originalPrice: {
        fontSize: 18,
        color: '#6b7280',
        textDecorationLine: 'line-through',
    },
    section: {
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    sectionContent: {
        paddingBottom: 16,
    },
    descriptionText: {
        fontSize: 16,
        color: '#6b7280',
        lineHeight: 24,
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    specLabel: {
        fontSize: 16,
        color: '#6b7280',
    },
    specValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1f2937',
    },
    reviewCard: {
        backgroundColor: '#eff6ff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    reviewDate: {
        fontSize: 12,
        color: '#6b7280',
    },
    reviewText: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    relatedSection: {
        marginTop: 40,
        marginBottom: 20,
    },
    relatedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    relatedTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
    },
    seeAllText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '600',
    },
    relatedGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    relatedItem: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f9fafb',
    },
    relatedImage: {
        width: '100%',
        height: 128,
        borderRadius: 16,
        marginBottom: 12,
    },
    relatedName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    relatedPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3b82f6',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        padding: 24,
        flexDirection: 'row',
        gap: 16,
        zIndex: 50,
    },
    cartButton: {
        flex: 1,
        backgroundColor: '#eff6ff',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartButtonText: {
        color: '#1e3a8a',
        fontSize: 16,
        fontWeight: '700',
    },
    buyButton: {
        flex: 1.5,
        backgroundColor: '#1e3a8a',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buyButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ProductDetailScreen;