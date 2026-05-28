import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../core/theme';
import { useEmployeeStore } from '../state/useEmployeeStore';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { RootStackNavigationProp } from '../navigation/types';
import { Feather } from '@expo/vector-icons';

// Form validation schema using Zod with refinement check
const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Register'>>();
  const { register, isLoading, error } = useEmployeeStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const success = await register(data.fullName, data.email, data.password);
    if (success) {
      Alert.alert(
        'Registration Successful',
        'Your supervisor account has been created! You can now sign in using these credentials.',
        [
          {
            text: 'Sign In Now',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Feather name="arrow-left" size={22} color={THEME.colors.primary} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Feather name="user-plus" size={40} color={THEME.colors.secondary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register as a Supervisor</Text>
        </View>

        <View style={styles.card}>
          {error && (
            <View style={styles.errorBanner}>
              <Feather name="alert-triangle" size={16} color={THEME.colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Full Name"
                value={value}
                onChangeText={onChange}
                placeholder="Jane Doe"
                iconName="user"
                error={errors.fullName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Email Address"
                value={value}
                onChangeText={onChange}
                placeholder="supervisor@company.com"
                keyboardType="email-address"
                iconName="mail"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Password"
                value={value}
                onChangeText={onChange}
                placeholder="••••••••"
                secureTextEntry
                iconName="lock"
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                placeholder="••••••••"
                secureTextEntry
                iconName="check-square"
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.loginOptionContainer}>
          <Text style={styles.loginOptionText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: THEME.spacing.xl,
    paddingTop: THEME.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: -10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.xs,
  },
  backButtonText: {
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    marginLeft: THEME.spacing.xs,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: THEME.borderRadius.xl,
    backgroundColor: THEME.colors.cardBackground,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.medium,
  },
  title: {
    fontSize: THEME.typography.sizes.xxl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
  },
  card: {
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.medium,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3F1A24',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.error,
  },
  errorBannerText: {
    color: '#FFB3C1',
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    marginLeft: THEME.spacing.sm,
    flex: 1,
  },
  submitButton: {
    marginTop: THEME.spacing.md,
  },
  loginOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: THEME.spacing.xl,
  },
  loginOptionText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.sizes.sm,
  },
  loginLink: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
    fontSize: THEME.typography.sizes.sm,
  },
});
