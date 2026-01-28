import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const CategoryTabs = ({ onCategoryChange }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    
    const categories = ['All', 'Electronics', 'Home', 'Fashion', 'Beauty'];

    const handleCategoryPress = (category) => {
        setActiveCategory(category);
        if (onCategoryChange) {
            onCategoryChange(category);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryTab,
                            activeCategory === category && styles.activeTab
                        ]}
                        onPress={() => handleCategoryPress(category)}
                    >
                        <Text style={[
                            styles.categoryText,
                            activeCategory === category ? styles.activeText : styles.inactiveText
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    scrollViewContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        gap: 24,
    },
    categoryTab: {
        paddingBottom: 12,
        paddingTop: 12,
        minWidth: 60,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#1152d4',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    activeText: {
        color: '#1152d4',
    },
    inactiveText: {
        color: '#94a3b8',
    },
});

export default CategoryTabs;