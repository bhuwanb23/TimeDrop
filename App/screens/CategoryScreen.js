import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator, RefreshControl, Text } from 'react-native';
import CategoryHeader from '../components/CategoryHeader';
import CategoryCard from '../components/CategoryCard';
import apiService from '../services/api';

const CategoryScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Load categories from backend
    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiService.categories.getCategories({
                page: 1,
                limit: 20,
                status: 'active'
            });
            
            if (response.data && response.data.data && response.data.data.categories) {
                setCategories(response.data.data.categories);
            }
            
            setError(null);
        } catch (err) {
            console.error('Error loading categories:', err);
            setError(err.message || 'Failed to load categories');
            
            // Show error alert only if not refreshing
            if (!refreshing) {
                Alert.alert('Error', 'Could not load categories. Please check your connection.');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadCategories();
    };

    const handleCategoryPress = (category) => {
        console.log('Category pressed:', category.name);
        // Navigate to products filtered by this category
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