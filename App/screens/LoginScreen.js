import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authAPI, setAuthToken } from '../services/api';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Validation
    if (!phone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      // Make API call to login
      const response = await authAPI.customerLogin(phone, password);
      
      if (response.data.success) {
        // Save the auth token
        await setAuthToken(response.data.token);
        
        Alert.alert('Success', 'Login successful!');
        // Navigate to customer app with user data
        navigation.navigate('CustomerApp', { 
          userData: {
            id: response.data.customer?.id,
            name: response.data.customer?.name,
            phone: response.data.customer?.phone
          }
        });
      } else {
        Alert.alert('Error', response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Login failed');
      } else {
        Alert.alert('Error', 'Network request failed. Please make sure the backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleDriverLogin = () => {
    navigation.navigate('DriverLogin');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleDriverLogin}>
        <Text style={styles.linkText}>Driver Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;