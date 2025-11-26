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
  const [userType, setUserType] = useState('customer');
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
      const response = await authAPI.login(phone, password, userType);
      
      if (response.data.success) {
        if (response.data.token) {
          await setAuthToken(response.data.token);
        }
        
        const { data: profileData = {}, userType: responseUserType } = response.data;

        Alert.alert('Success', `${responseUserType === 'driver' ? 'Driver' : 'Customer'} login successful!`);
        
        if (responseUserType === 'driver') {
          navigation.navigate('DriverApp', { 
            driverData: {
              id: profileData.id,
              name: profileData.name,
              phone: profileData.phone,
              current_lat: profileData.current_lat,
              current_lng: profileData.current_lng,
            }
          });
        } else {
          navigation.navigate('CustomerApp', { 
            userData: {
              id: profileData.id,
              name: profileData.name,
              phone: profileData.phone,
              email: profileData.email,
            }
          });
        }
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
          <View style={styles.userTypeContainer}>
            <Text style={styles.userTypeLabel}>Sign in as</Text>
            <View style={styles.userTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'customer' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('customer')}
              >
                <Text
                  style={[
                    styles.userTypeButtonText,
                    userType === 'customer' && styles.userTypeButtonTextActive
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'driver' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('driver')}
              >
                <Text
                  style={[
                    styles.userTypeButtonText,
                    userType === 'driver' && styles.userTypeButtonTextActive
                  ]}
                >
                  Driver
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
              <Text style={styles.buttonText}>
                Sign In as {userType === 'driver' ? 'Driver' : 'Customer'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleRegister} style={styles.footerButton}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Text style={styles.footerLink}>Register</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Need to switch roles later? Use the selector above before signing in.
          </Text>
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
  userTypeContainer: {
    marginBottom: SPACING.m,
  },
  userTypeLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
    fontWeight: TYPOGRAPHY.medium,
  },
  userTypeButtons: {
    flexDirection: 'row',
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: SPACING.s,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  userTypeButtonText: {
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  userTypeButtonTextActive: {
    color: COLORS.textInverted,
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
  helperText: {
    color: COLORS.textLight,
    fontSize: TYPOGRAPHY.caption,
    textAlign: 'center',
  },
});

export default LoginScreen;