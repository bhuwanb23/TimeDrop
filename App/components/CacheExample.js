import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCache } from '../context/CacheContext';

const CacheExample = () => {
  const { 
    cache, 
    addToCache, 
    getFromCache, 
    removeFromCache, 
    clearCache, 
    loading, 
    error 
  } = useCache();
  
  const [cachedData, setCachedData] = useState(null);
  const [cacheKey, setCacheKey] = useState('example_key');
  const [cacheValue, setCacheValue] = useState('Example data');

  const handleAddToCache = () => {
    addToCache(cacheKey, cacheValue, 60000); // 1 minute TTL
    Alert.alert('Success', `Added "${cacheValue}" with key "${cacheKey}" to cache`);
  };

  const handleGetFromCache = () => {
    const data = getFromCache(cacheKey);
    setCachedData(data);
    if (data) {
      Alert.alert('Success', `Retrieved from cache: ${data}`);
    } else {
      Alert.alert('Not Found', `No data found for key "${cacheKey}" or it has expired`);
    }
  };

  const handleRemoveFromCache = () => {
    removeFromCache(cacheKey);
    Alert.alert('Success', `Removed key "${cacheKey}" from cache`);
  };

  const handleClearCache = () => {
    clearCache();
    Alert.alert('Success', 'Cache cleared');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cache Context Example</Text>
      
      {loading && <Text style={styles.loading}>Loading...</Text>}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cache Key:</Text>
        <Text style={styles.value}>{cacheKey}</Text>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cache Value:</Text>
        <Text style={styles.value}>{cacheValue}</Text>
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={handleAddToCache}>
          <Text style={styles.buttonText}>Add to Cache</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleGetFromCache}>
          <Text style={styles.buttonText}>Get from Cache</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleRemoveFromCache}>
          <Text style={styles.buttonText}>Remove from Cache</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearCache}>
          <Text style={styles.buttonText}>Clear Cache</Text>
        </TouchableOpacity>
      </View>
      
      {cachedData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Retrieved Data:</Text>
          <Text style={styles.resultValue}>{cachedData}</Text>
        </View>
      )}
      
      <View style={styles.cacheInfo}>
        <Text style={styles.cacheInfoTitle}>Cache Info:</Text>
        <Text style={styles.cacheInfoText}>Total items: {Object.keys(cache).length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  loading: {
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  error: {
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#666',
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    flex: 1,
    minWidth: 120,
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#e8f4fc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  resultValue: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  cacheInfo: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  cacheInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cacheInfoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default CacheExample;