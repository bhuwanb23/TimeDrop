import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DriverLoginScreen = () => {
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Validation
    if (!driverId || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here we would normally make an API call to login
    // For now, we'll just navigate to the driver dashboard
    Alert.alert('Success', 'Driver login successful!');
    navigation.navigate('DriverApp');
  };

  const handleCustomerLogin = () => {
    navigation.navigate('Login');
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    Alert.alert('Info', 'Forgot password functionality to be implemented');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Slot App</Text>
      <Text style={styles.subtitle}>Driver Login</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Driver ID"
          value={driverId}
          onChangeText={setDriverId}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleCustomerLogin}>
            <Text style={styles.linkText}>Are you a customer? Customer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
  form: {
    width: '100%',
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
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    marginBottom: 15,
  },
});

export default DriverLoginScreen;