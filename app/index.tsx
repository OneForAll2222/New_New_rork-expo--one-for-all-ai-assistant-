import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAIN_GRADIENT, COLORS } from '@/constants/colors';

type AuthMode = 'welcome' | 'signin' | 'signup' | 'forgot';

export default function AuthScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('welcome');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);


  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedCredentials = await AsyncStorage.getItem('savedCredentials');
      if (savedCredentials) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
        console.log('Loaded saved credentials');
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const saveCredentials = async (email: string, password: string) => {
    try {
      await AsyncStorage.setItem('savedCredentials', JSON.stringify({ email, password }));
      console.log('Credentials saved');
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const clearSavedCredentials = async () => {
    try {
      await AsyncStorage.removeItem('savedCredentials');
      console.log('Saved credentials cleared');
    } catch (error) {
      console.error('Error clearing saved credentials:', error);
    }
  };

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    handleHaptic();
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(async () => {
      setIsLoading(false);
      console.log('Sign in successful, navigating to specialists');
      
      // Handle Remember Me functionality
      if (rememberMe) {
        await saveCredentials(email, password);
      } else {
        await clearSavedCredentials();
      }
      
      // Direct navigation without alert for better reliability
      router.replace('/(tabs)/specialists');
    }, 1000);
  };

  const handleSignUp = async () => {
    handleHaptic();
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Email Confirmation Required',
        'We\'ve sent a confirmation email to your address. Please check your inbox and click the verification link to complete your registration.',
        [
          { text: 'OK', onPress: () => setAuthMode('signin') }
        ]
      );
    }, 1500);
  };

  const handleForgotPassword = async () => {
    handleHaptic();
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Reset Link Sent',
        'We\'ve sent a password reset link to your email address. Please check your inbox.',
        [
          { text: 'OK', onPress: () => setAuthMode('signin') }
        ]
      );
    }, 1500);
  };

  const renderWelcomeScreen = () => (
    <View style={styles.welcomeContainer}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#fff', '#f0f0f0']}
          style={styles.logoCircle}
        >
          <Text style={styles.logoText}>1</Text>
        </LinearGradient>
        <Text style={styles.welcomeTitle}>One for All</Text>
        <Text style={styles.welcomeSubtitle}>Your AI-Powered Assistant Hub</Text>
      </View>

      <View style={styles.welcomeContent}>
        <View style={styles.powerBadge}>
          <Text style={styles.powerBadgeText}>Powered by ChatGPT-4</Text>
        </View>
        
        <Text style={styles.mainDescription}>
          Access specialized AI assistants for every aspect of your life. From coding to health advice, music production to learning - we&apos;ve got you covered.
        </Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featuresList}>
            <Text style={styles.featureListItem}>💻 Software Development & Coding</Text>
            <Text style={styles.featureListItem}>🏥 Medical Consultation & Health</Text>
            <Text style={styles.featureListItem}>🎵 Music Production & Audio</Text>
            <Text style={styles.featureListItem}>📚 Learning & Education</Text>
            <Text style={styles.featureListItem}>💼 Business & Professional Advice</Text>
            <Text style={styles.featureListItem}>🎨 Creative & Design Support</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => {
              handleHaptic();
              setAuthMode('signin');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {
              handleHaptic();
              setAuthMode('signup');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Created by Alissa Smith</Text>
      </View>
    </View>
  );

  const renderAuthForm = () => {
    const isSignUp = authMode === 'signup';
    const isForgot = authMode === 'forgot';
    
    return (
      <View style={styles.formContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            handleHaptic();
            setAuthMode('welcome');
            // Don't clear email/password if Remember Me is checked
            if (!rememberMe) {
              setEmail('');
              setPassword('');
            }
            setConfirmPassword('');
            setFullName('');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isForgot ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.formSubtitle}>
            {isForgot 
              ? 'Enter your email to receive a reset link'
              : isSignUp 
              ? 'Join the One for All community'
              : 'Sign in to continue'
            }
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {isSignUp && (
            <View style={styles.inputWrapper}>
              <User size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Mail size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {!isForgot && (
            <View style={styles.inputWrapper}>
              <Lock size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingRight: 50 }]}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="rgba(255, 255, 255, 0.7)" />
                ) : (
                  <Eye size={20} color="rgba(255, 255, 255, 0.7)" />
                )}
              </TouchableOpacity>
            </View>
          )}

          {isSignUp && (
            <View style={styles.inputWrapper}>
              <Lock size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingRight: 50 }]}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="rgba(255, 255, 255, 0.7)" />
                ) : (
                  <Eye size={20} color="rgba(255, 255, 255, 0.7)" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!isForgot && !isSignUp && (
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => {
              handleHaptic();
              setRememberMe(!rememberMe);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && (
                <Check size={16} color={COLORS.DARK_PURPLE} />
              )}
            </View>
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isLoading && styles.disabledButton]}
          onPress={isForgot ? handleForgotPassword : isSignUp ? handleSignUp : handleSignIn}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Please wait...' : isForgot ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          {!isForgot && !isSignUp && (
            <TouchableOpacity
              onPress={() => {
                handleHaptic();
                setAuthMode('forgot');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
          
          {!isForgot && (
            <TouchableOpacity
              onPress={() => {
                handleHaptic();
                setAuthMode(isSignUp ? 'signin' : 'signup');
                // Don't clear email/password if Remember Me is checked and switching to signin
                if (!(rememberMe && !isSignUp)) {
                  setEmail('');
                  setPassword('');
                }
                setConfirmPassword('');
                setFullName('');
                if (isSignUp) {
                  setRememberMe(false);
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>
                {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={MAIN_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {authMode === 'welcome' ? renderWelcomeScreen() : renderAuthForm()}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.DARK_PURPLE,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  mainDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButton: {
    backgroundColor: '#fff',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.DARK_PURPLE,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  formHeader: {
    marginBottom: 40,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    height: '100%',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  linkContainer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
  },
  linkText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textDecorationLine: 'underline',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  rememberMeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  footerContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },
  featuresContainer: {
    alignItems: 'center',
  },
  powerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  powerBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  featuresList: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureListItem: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    lineHeight: 20,
  },

});