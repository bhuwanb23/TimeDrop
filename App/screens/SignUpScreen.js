import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState('driver'); // 'driver' or 'customer'
    
    // Form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        vehicleModel: '',
        vehiclePlate: '',
    });

    // Update form field
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Validate form
    const validateForm = () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return false;
        }
        if (!formData.email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }
        if (!formData.phone.trim()) {
            Alert.alert('Error', 'Please enter your phone number');
            return false;
        }
        if (!formData.password.trim()) {
            Alert.alert('Error', 'Please enter a password');
            return false;
        }
        if (formData.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        
        // Driver-specific validation
        if (userType === 'driver') {
            if (!formData.vehicleModel.trim()) {
                Alert.alert('Error', 'Please enter your vehicle model');
                return false;
            }
            if (!formData.vehiclePlate.trim()) {
                Alert.alert('Error', 'Please enter your license plate');
                return false;
            }
        }
        
        return true;
    };

    // Handle registration
    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Prepare user data
            const userData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                password: formData.password,
                userType: userType,
                ...(userType === 'driver' && {
                    vehicleModel: formData.vehicleModel.trim(),
                    vehiclePlate: formData.vehiclePlate.trim(),
                    vehicleYear: '2020', // Default value
                    vehicleColor: 'Silver', // Default value
                    rating: 5.0, // New drivers start with 5.0 rating
                    totalDeliveries: 0,
                    memberSince: new Date().getFullYear().toString(),
                    status: 'offline'
                })
            };

            console.log('Registering user:', userData);

            // Try to register with backend (optional - will fail gracefully if offline)
            let registeredUser = null;
            try {
                // In a real app, you would call:
                // const response = await apiService.auth.register(userData);
                // registeredUser = response.user;
                
                // For now, simulate successful registration
                await new Promise(resolve => setTimeout(resolve, 1500));
                registeredUser = {
                    id: Date.now().toString(),
                    ...userData,
                    token: 'mock-token-' + Date.now()
                };
            } catch (apiError) {
                console.log('Backend registration failed, using local registration');
                // Create local user object
                registeredUser = {
                    id: Date.now().toString(),
                    ...userData,
                    token: 'local-token-' + Date.now()
                };
            }

            // Save authentication token
            await AsyncStorage.setItem('token', registeredUser.token);

            // If driver, save profile data
            if (userType === 'driver') {
                const driverProfile = {
                    name: registeredUser.name,
                    email: registeredUser.email,
                    phone: registeredUser.phone,
                    vehicleModel: registeredUser.vehicleModel,
                    vehiclePlate: registeredUser.vehiclePlate,
                    vehicleYear: registeredUser.vehicleYear,
                    vehicleColor: registeredUser.vehicleColor,
                    rating: registeredUser.rating,
                    totalDeliveries: registeredUser.totalDeliveries,
                    memberSince: registeredUser.memberSince,
                };
                await AsyncStorage.setItem('driverProfile', JSON.stringify(driverProfile));
                await AsyncStorage.setItem('driverStatus', 'offline');
            }

            // Show success message
            Alert.alert(
                'Registration Successful!',
                `Welcome ${registeredUser.name}! Your account has been created.`,
                [
                    {
                        text: 'Continue',
                        onPress: () => {
                            // Navigate to appropriate screen
                            if (userType === 'driver') {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'MainTabs' }],
                                });
                            } else {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'CustomerMainTabs' }],
                                });
                            }
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert(
                'Registration Failed',
                error.message || 'Failed to create account. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Green theme colors
    const themeColors = {
        primary: '#10B981',
        primaryDark: '#059669',
        primaryLight: '#D1FAE5',
        border: '#A7F3D0',
        background: '#ECFDF5',
        text: '#064E3B',
        textLight: '#059669',
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <MaterialIcons name="arrow-back" size={24} color={themeColors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join TimeDrop today</Text>
                    </View>

                    {/* User Type Toggle */}
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>I am a:</Text>
                        <View style={styles.toggleButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    userType === 'driver' && styles.toggleButtonActive
                                ]}
                                onPress={() => setUserType('driver')}
                            >
                                <Text style={[
                                    styles.toggleButtonText,
                                    userType === 'driver' && styles.toggleButtonTextActive
                                ]}>Driver</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.toggleButton,
                                    userType === 'customer' && styles.toggleButtonActive
                                ]}
                                onPress={() => setUserType('customer')}
                            >
                                <Text style={[
                                    styles.toggleButtonText,
                                    userType === 'customer' && styles.toggleButtonTextActive
                                ]}>Customer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Name Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="person" size={20} color={themeColors.textLight} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#9CA3AF"
                                value={formData.name}
                                onChangeText={(text) => updateField('name', text)}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    {/* Email Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="email" size={20} color={themeColors.textLight} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#9CA3AF"
                                value={formData.email}
                                onChangeText={(text) => updateField('email', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Phone Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="phone" size={20} color={themeColors.textLight} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                placeholderTextColor="#9CA3AF"
                                value={formData.phone}
                                onChangeText={(text) => updateField('phone', text)}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Password Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="lock" size={20} color={themeColors.textLight} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#9CA3AF"
                                value={formData.password}
                                onChangeText={(text) => updateField('password', text)}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    {/* Confirm Password Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="lock-outline" size={20} color={themeColors.textLight} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#9CA3AF"
                                value={formData.confirmPassword}
                                onChangeText={(text) => updateField('confirmPassword', text)}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    {/* Driver-Specific Fields */}
                    {userType === 'driver' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Vehicle Model</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="directions-car" size={20} color={themeColors.textLight} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g., Toyota Prius"
                                        placeholderTextColor="#9CA3AF"
                                        value={formData.vehicleModel}
                                        onChangeText={(text) => updateField('vehicleModel', text)}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>License Plate</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="local-shipping" size={20} color={themeColors.textLight} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g., ABC-1234"
                                        placeholderTextColor="#9CA3AF"
                                        value={formData.vehiclePlate}
                                        onChangeText={(text) => updateField('vehiclePlate', text)}
                                        autoCapitalize="characters"
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Terms Notice */}
                    <Text style={styles.termsText}>
                        By creating an account, you agree to our{' '}
                        <Text style={styles.termsLink}>Terms of Service</Text>
                        {' '}and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>

                    {/* Login Link */}
                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECFDF5',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    headerSection: {
        marginTop: 20,
        marginBottom: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#064E3B',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#059669',
    },
    toggleContainer: {
        marginBottom: 24,
    },
    toggleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    toggleButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#A7F3D0',
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    toggleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#059669',
    },
    toggleButtonTextActive: {
        color: '#FFFFFF',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#A7F3D0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#064E3B',
        paddingVertical: 12,
    },
    submitButton: {
        backgroundColor: '#10B981',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    termsText: {
        fontSize: 13,
        color: '#059669',
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 20,
    },
    termsLink: {
        color: '#10B981',
        fontWeight: '600',
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        marginBottom: 20,
    },
    loginText: {
        fontSize: 15,
        color: '#059669',
    },
    loginLink: {
        fontSize: 15,
        fontWeight: '700',
        color: '#10B981',
    },
});

export default SignUpScreen;
