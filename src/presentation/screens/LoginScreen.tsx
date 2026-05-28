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
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../core/theme';
import { useEmployeeStore } from '../state/useEmployeeStore';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { Feather } from '@expo/vector-icons';
import { RootStackNavigationProp } from '../navigation/types';

// Form validation schema using Zod
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Login'>>();
  const { login, isLoading, error } = useEmployeeStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Authenticate supervisor
    await login(data.email, data.password, data.rememberMe);
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
          <View style={styles.logoContainer}>
            <Feather name="users" size={42} color={THEME.colors.primary} />
          </View>
          <Text style={styles.title}>EmployeeHub</Text>
          <Text style={styles.subtitle}>HR & Staff Management System</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to manage your organization</Text>

          {error && (
            <View style={styles.errorBanner}>
              <Feather name="alert-triangle" size={16} color={THEME.colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

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

          {/* Remember Me Checkbox Row */}
          <Controller
            control={control}
            name="rememberMe"
            render={({ field: { value, onChange } }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onChange(!value)}
                style={styles.rememberMeContainer}
              >
                <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                  {value && <Feather name="check" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.rememberMeText}>Remember session details</Text>
              </TouchableOpacity>
            )}
          />

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        {/* Navigation redirection to Register screen */}
        <View style={styles.registerRedirect}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.demoCard}>
          <Feather name="info" size={16} color={THEME.colors.secondary} style={styles.demoIcon} />
          <Text style={styles.demoText}>
            Demo Credentials: Log in with "admin@employeehub.com" / "password123" or sign up a new account.
          </Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
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
    fontWeight: THEME.typography.weights.medium,
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
  welcomeText: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.lg,
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
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    paddingVertical: THEME.spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: THEME.borderRadius.xs,
    borderWidth: 2,
    borderColor: THEME.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
    backgroundColor: THEME.colors.background,
  },
  checkboxChecked: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  rememberMeText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
  },
  submitButton: {
    marginTop: THEME.spacing.xs,
  },
  registerRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: THEME.spacing.xl,
  },
  registerText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.sizes.sm,
  },
  registerLink: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
    fontSize: THEME.typography.sizes.sm,
  },
  demoCard: {
    flexDirection: 'row',
    backgroundColor: '#0F2C35',
    borderWidth: 1,
    borderColor: THEME.colors.secondary,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginTop: THEME.spacing.xl,
    alignItems: 'center',
  },
  demoIcon: {
    marginRight: THEME.spacing.sm,
  },
  demoText: {
    flex: 1,
    fontSize: THEME.typography.sizes.xs,
    color: '#A5E9F6',
    lineHeight: THEME.typography.lineHeights.xs,
  },
});
