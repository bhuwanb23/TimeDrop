import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    const handleVoiceSearch = () => {
        // Voice search functionality would go here
        console.log('Voice search initiated');
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchIcon}>
                    <MaterialIcons name="search" size={20} color="#94a3b8" />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <TouchableOpacity 
                    style={styles.voiceButton}
                    onPress={handleVoiceSearch}
                >
                    <MaterialIcons name="mic" size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        height: 48,
    },
    searchIcon: {
        paddingLeft: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111318',
        paddingHorizontal: 12,
        paddingVertical: 0,
    },
    voiceButton: {
        paddingRight: 16,
        paddingVertical: 12,
    },
});

export default SearchBar;