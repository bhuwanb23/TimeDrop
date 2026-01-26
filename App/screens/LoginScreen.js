import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigation = useNavigation();

    // Sample credentials for testing
    const SAMPLE_CREDENTIALS = {
        phone: '1234567890',
        password: 'password123',
    };

    const handleLogin = () => {
        // Simple validation
        if (!phoneNumber.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Check credentials (for demo purposes)
        if (
            phoneNumber === SAMPLE_CREDENTIALS.phone &&
            password === SAMPLE_CREDENTIALS.password
        ) {
            // Navigate directly without alert
            navigation.navigate('Dashboard');
        } else {
            Alert.alert('Error', 'Invalid credentials. Use:\nPhone: 1234567890\nPassword: password123');
        }
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
        Alert.alert('Sign Up', 'Sign up screen would be implemented here');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <MaterialIcons name="domain" size={40} color="#1e3b8a" />
                        </View>
                    </View>

                    {/* Headline */}
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Enter your details to sign in</Text>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Phone Number Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.phoneInputContainer}>
                                <View style={styles.countryCodeContainer}>
                                    <Text style={styles.countryCodeText}>{countryCode} 🇺🇸</Text>
                                    <MaterialIcons name="arrow-drop-down" size={20} color="#999" />
                                </View>
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="(555) 000-0000"
                                    placeholderTextColor="#999"
                                    keyboardType="phone-pad"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="••••••••"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!isPasswordVisible}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                >
                                    <MaterialIcons
                                        name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                                        size={24}
                                        color="#999"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Logins */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                            <MaterialIcons name="google" size={20} color="#000" />
                            <Text style={styles.socialButtonText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                            <MaterialIcons name="facebook" size={20} color="#1877F2" />
                            <Text style={styles.socialButtonText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign Up Prompt */}
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
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
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 32,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1e3b8a20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f121a',
        textAlign: 'center',
        paddingBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#556591',
        textAlign: 'center',
        paddingBottom: 32,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0f121a',
        marginBottom: 6,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    countryCodeContainer: {
        width: 96,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#d2d7e5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    countryCodeText: {
        fontSize: 14,
        color: '#0f121a',
        fontWeight: '500',
    },
    phoneInput: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#d2d7e5',
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#0f121a',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#d2d7e5',
        paddingHorizontal: 16,
        paddingRight: 48,
        fontSize: 14,
        color: '#0f121a',
    },
    eyeButton: {
        position: 'absolute',
        right: 16,
        top: 12,
    },
    forgotPasswordButton: {
        alignItems: 'flex-end',
        paddingVertical: 4,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#1e3b8a',
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#1e3b8a',
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        shadowColor: '#1e3b8a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#d2d7e5',
    },
    dividerText: {
        fontSize: 12,
        color: '#556591',
        fontWeight: '500',
        marginHorizontal: 12,
        textTransform: 'uppercase',
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#d2d7e5',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    socialButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0f121a',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#556591',
    },
    signUpLink: {
        fontSize: 14,
        color: '#1e3b8a',
        fontWeight: 'bold',
    },
});

export default LoginScreen;