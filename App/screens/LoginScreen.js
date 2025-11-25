import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { authAPI, setAuthToken } from '../services/api';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
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

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Icon name="person-circle-outline" size={80} color={COLORS.primary} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              placeholderTextColor={COLORS.textLight}
            />
            <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
              <Icon name={secureTextEntry ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textInverted} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleRegister} style={styles.footerButton}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Text style={styles.footerLink}>Register</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleDriverLogin} style={styles.footerButton}>
            <Text style={styles.footerText}>Are you a driver? </Text>
            <Text style={styles.footerLink}>Driver Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.m,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.h1,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.m,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
  formContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.m,
    paddingHorizontal: SPACING.m,
  },
  inputIcon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.m,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.medium,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  buttonDisabled: {
    backgroundColor: COLORS.primaryLight,
  },
  buttonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  footer: {
    marginTop: SPACING.l,
    alignItems: 'center',
  },
  footerButton: {
    flexDirection: 'row',
    marginBottom: SPACING.s,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.bodySmall,
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});

export default LoginScreen;