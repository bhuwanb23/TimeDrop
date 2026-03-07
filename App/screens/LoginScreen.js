import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
    const [userType, setUserType] = useState('driver'); // 'driver' or 'customer'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigation = useNavigation();

    // Sample credentials for testing
    const SAMPLE_CREDENTIALS = {
        driver: {
            phone: '1234567890',
            password: 'password123',
        },
        customer: {
            phone: '9876543210',
            password: 'customer123',
        }
    };

    const handleLogin = () => {
        // Simple validation
        if (!phoneNumber.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Check credentials based on user type (for demo purposes)
        const credentials = SAMPLE_CREDENTIALS[userType];
        if (
            phoneNumber === credentials.phone &&
            password === credentials.password
        ) {
            // Navigate based on user type
            if (userType === 'driver') {
                navigation.navigate('MainTabs');
            } else {
                navigation.navigate('CustomerMainTabs');
            }
        } else {
            const userTypeText = userType === 'driver' ? 'Driver' : 'Customer';
            Alert.alert('Error', `Invalid ${userTypeText} credentials. Use:\nPhone: ${credentials.phone}\nPassword: ${credentials.password}`);
        }
    };

    // Green theme colors
    const themeColors = {
        primary: '#10B981',
        primaryDark: '#059669',
        primaryLight: '#D1FAE5',
        accent: '#34D399',
        text: '#064E3B',
        textLight: '#6EE7B7',
    };

    const handleGoogleLogin = () => {
        Alert.alert('Google Login', 'Google login would be implemented here');
    };

    const handleFacebookLogin = () => {
        Alert.alert('Facebook Login', 'Facebook login would be implemented here');
    };

    const handleForgotPassword = () => {
        Alert.alert('Forgot Password', 'Password reset functionality would go here');
    };

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header Section with Green Gradient Background */}
                <View style={styles.headerSection}>
                    <View style={styles.headerContent}>
                        <Text style={styles.welcomeText}>Welcome to</Text>
                        <Text style={styles.appName}>TimeDrop</Text>
                        <Text style={styles.tagline}>Fast & Reliable Delivery</Text>
                    </View>
                    
                    {/* Decorative Circles */}
                    <View style={styles.decorativeCircle1} />
                    <View style={styles.decorativeCircle2} />
                </View>

                {/* Main Card */}
                <View style={styles.card}>
                    {/* User Type Selection - Modern Tabs */}
                    <View style={styles.userTypeContainer}>
                        <View style={styles.tabContainer}>
                            <TouchableOpacity 
                                style={[styles.tab, userType === 'driver' && styles.tabActive]}
                                onPress={() => setUserType('driver')}
                            >
                                <Ionicons 
                                    name="car-sport" 
                                    size={20} 
                                    color={userType === 'driver' ? '#fff' : '#6B7280'} 
                                />
                                <Text style={[styles.tabText, userType === 'driver' && styles.tabTextActive]}>Driver</Text>
                                {userType === 'driver' && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.tab, userType === 'customer' && styles.tabActive]}
                                onPress={() => setUserType('customer')}
                            >
                                <Ionicons 
                                    name="bag-handle-outline" 
                                    size={20} 
                                    color={userType === 'customer' ? '#fff' : '#6B7280'} 
                                />
                                <Text style={[styles.tabText, userType === 'customer' && styles.tabTextActive]}>Customer</Text>
                                {userType === 'customer' && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View style={styles.form}>
                        {/* Phone Number Input */}
                        <View style={styles.inputGroup}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="call-outline" size={20} color="#1e3b8a" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone Number"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="phone-pad"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    accessibilityLabel="Phone number input"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#1e3b8a" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!isPasswordVisible}
                                    value={password}
                                    onChangeText={setPassword}
                                    accessibilityLabel="Password input"
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                >
                                    <Ionicons
                                        name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#6B7280"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                            <Ionicons name="help-circle-outline" size={14} color="#1e3b8a" />
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button - Gradient Style */}
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Sign In</Text>
                            <Ionicons name="arrow-forward-outline" size={20} color="#fff" style={styles.loginButtonIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Logins - Circular Buttons */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButtonCircle} onPress={handleGoogleLogin}>
                            <Ionicons name="logo-google" size={28} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButtonCircle} onPress={handleFacebookLogin}>
                            <Ionicons name="logo-facebook" size={28} color="#4267B2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButtonCircle} onPress={handleSignUp}>
                            <Ionicons name="mail-outline" size={28} color="#1e3b8a" />
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Prompt */}
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={styles.signUpLink}>Create Account</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sample Credentials Info */}
                    <View style={styles.credentialsInfo}>
                        <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                        <Text style={styles.credentialsInfoText}>
                            Demo: {userType === 'driver' ? '1234567890' : '9876543210'} / password123
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    headerSection: {
        backgroundColor: '#10B981',
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
        position: 'relative',
    },
    headerContent: {
        alignItems: 'center',
        zIndex: 1,
    },
    welcomeText: {
        fontSize: 18,
        color: '#ECFDF5',
        fontWeight: '500',
        marginBottom: 8,
    },
    appName: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 16,
        color: '#A7F3D0',
        fontWeight: '400',
    },
    decorativeCircle1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -50,
        right: -50,
    },
    decorativeCircle2: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        bottom: -30,
        left: -30,
    },
    card: {
        width: '90%',
        maxWidth: 420,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 28,
        alignSelf: 'center',
        marginTop: -40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    userTypeContainer: {
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 4,
        gap: 4,
    },
    tab: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        position: 'relative',
    },
    tabActive: {
        backgroundColor: '#10B981',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -4,
        width: 20,
        height: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    form: {
        width: '100%',
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
        color: '#10B981',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    eyeButton: {
        padding: 4,
    },
    forgotPasswordButton: {
        alignItems: 'flex-end',
        paddingVertical: 4,
        marginBottom: 8,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#10B981',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
    loginButtonIcon: {
        marginLeft: 8,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        gap: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
        justifyContent: 'center',
    },
    socialButtonCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    signUpText: {
        fontSize: 15,
        color: '#6B7280',
    },
    signUpLink: {
        fontSize: 15,
        color: '#10B981',
        fontWeight: 'bold',
    },
    credentialsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    credentialsInfoText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
});

export default LoginScreen;