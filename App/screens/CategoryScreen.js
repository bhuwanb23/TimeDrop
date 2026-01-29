import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import CategoryHeader from '../components/CategoryHeader';
import CategoryCard from '../components/CategoryCard';

const CategoryScreen = ({ navigation }) => {
    const [categories] = useState([
        {
            id: 1,
            name: 'Fashion',
            productCount: 1240,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBBqBSbJ6tsg-GPkChiFsBu4qV5kOhQe9zicIg2RFU9sohLTWC0nslkxbLPOJ0vAl3OxrvxkpqEKufQcu14lPsMGU_l0zyFTh50UP0GHRqmxwVcPFEZIM-Cra4uQBML6c6Mbq7RjN2yKW63liuwhZt8FQF6L1RdluIbJTYonkZucdwexp2f6vDNB6L8vcnypK_LKcwnxfaut6uOjeMKL9dr3cikoIDPp7_QbwSemyE6U6tXEC1BI9J1KcKnS0vz6uczJX8V_nbeHY'
        },
        {
            id: 2,
            name: 'Tech',
            productCount: 850,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEdclVWy3M8BxMzFeb1J8f-hS8djSpmXa6b9iE8h9X0A8zLlFO0WmE7ZRrSxnR9-_RWY_1PMTL4TOfjJHRSHdDJn1rdYoASaK6VNdURRjwlX8q5eqYehv8VH3a5CRK9MEDCT4APc6sV1p55Dq4Wecd4F8m8ik8Hu6RTrUZx4pr0tY44g57TsGfQx_Ijy9PGKM4Av2BEK-nsWHj2gVGmBRK67hOY1nqg_tSaKzx960_DQQpAn07KDKG5qhO9UfXeV8BVvLayHEnPgE'
        },
        {
            id: 3,
            name: 'Beauty',
            productCount: 520,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQO437bK_hgQmHBH9VoZkMmbRpEslnGjb9OmHyaCKtH6qe6i0p3Z7EXKX5kMG8Zf5ZGHPHcwIhKYl9g7u-uPA1ui4BoLYK5FDtLaRsCy5lQMSJmucwZ2OqlWzrQXGVtGF39nvi_vlfJ-iTvHpL90HXtzK6OBj-l3Fl3GelEeZItTGgwWBCatUx2yRxYaMYBeM533BOKAf4iFRX_uuMj3JbTaea4Vre3rEApKuXSRO1mAMSisEQP15ykRRaE1sUuqEGc_Ysniz_MIg'
        },
        {
            id: 4,
            name: 'Home',
            productCount: 310,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKS0Pgzg5smSaKAiicZemb5MlJn114352m03oR2dmX9Uaiv7VIrAKughWPR8uz77s0QCTcAdt1GugcbACR2JOXd7GdhFTORwRZkbkLdWDm-ufDhZhkioucO-rlgIu3gGouseZl00OlkGV70_iuxXBwIdQvItQKkpMQmfg_kTmbo3IkO-iOfZ8iqmJjoeD2JSPagh2Jc7ewKn1zZD9hdfDS0-N-xYhtOp--7mh1qlmJKcoo5TNsTg6iG7j-nAGmYE72e6leicMG4AU'
        }
    ]);

    const handleCategoryPress = (category) => {
        console.log('Category pressed:', category.name);
        Alert.alert(
            'Category Selected',
            `You selected ${category.name} category with ${category.productCount} products.`,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ]
        );
        // Here you would navigate to the category products screen
        // navigation.navigate('CategoryProducts', { category });
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <CategoryHeader />
                
                <View style={styles.categoriesContainer}>
                    {categories.map(category => (
                        <View key={category.id} style={styles.categoryItem}>
                            <CategoryCard 
                                category={category} 
                                onPress={handleCategoryPress}
                            />
                        </View>
                    ))}
                </View>
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
    categoriesContainer: {
        paddingHorizontal: 16,
        gap: 16,
    },
    categoryItem: {
        // Each category card will have its own styling
    },
});

export default CategoryScreen;