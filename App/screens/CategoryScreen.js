import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Text } from 'react-native';
import CategoryHeader from '../components/CategoryHeader';
import CategoryCard from '../components/CategoryCard';

const CategoryScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Electronics', image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', description: 'Phones, laptops, gadgets' },
        { id: 2, name: 'Fashion', image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400', description: 'Clothing, shoes, accessories' },
        { id: 3, name: 'Home & Garden', image_url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400', description: 'Furniture, decor, tools' },
        { id: 4, name: 'Sports', image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400', description: 'Equipment, apparel, gear' },
        { id: 5, name: 'Books', image_url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400', description: 'Fiction, non-fiction, textbooks' },
        { id: 6, name: 'Toys', image_url: 'https://images.unsplash.com/photo-1558877385-83a29c333f52?w=400', description: 'Games, puzzles, educational' }
    ]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Simple refresh handler - no API calls
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleCategoryPress = (category) => {
        console.log('Category pressed:', category.name);
        navigation.navigate('CustomerMainTabs', { 
            screen: 'Home',
            params: { categoryId: category.id, categoryName: category.name }
        });
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1152d4" />
                    <Text style={styles.loadingText}>Loading categories...</Text>
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
                    <CategoryHeader />
                    
                    <View style={styles.categoriesContainer}>
                        {categories.map(category => (
                            <View key={category.id.toString()} style={styles.categoryItem}>
                                <CategoryCard 
                                    category={category} 
                                    onPress={handleCategoryPress}
                                />
                            </View>
                        ))}
                    </View>
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
    categoriesContainer: {
        paddingHorizontal: 16,
        gap: 16,
    },
    categoryItem: {
        // Each category card will have its own styling
    },
});

export default CategoryScreen;