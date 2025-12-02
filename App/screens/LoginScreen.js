import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/DesignSystem';
import { customerAPI } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Validation Error', 'Please enter both phone number and password.');
      return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const response = await customerAPI.login({ phone, password });
      const { token, customer } = response.data;
      
      // Store token and navigate to customer app
      // In a real app, you would store the token securely
      console.log('Login successful', { token, customer });
      navigation.reset({
        index: 0,
        routes: [{ name: 'CustomerApp' }],
      });
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        if (error.response.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Icon name="cube-outline" size={60} color={COLORS.primary} />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="call-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={10}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="lock-closed-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon 
                      name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={COLORS.textLight} 
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>
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
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}> Sign Up</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('DriverLogin')}
            >
              <Text style={styles.secondaryButtonText}>Driver Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
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
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: SPACING.l,
  },
  label: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.small,
    paddingHorizontal: SPACING.m,
  },
  inputIcon: {
    marginRight: SPACING.s,
  },
  eyeIcon: {
    marginLeft: SPACING.s,
  },
  input: {
    height: 50,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.l,
  },
  forgotPasswordText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
  },
  buttonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  footerText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  linkText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.bold,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.grayLight,
  },
  dividerText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.m,
  },
  secondaryButton: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
  },
});

export default LoginScreen;