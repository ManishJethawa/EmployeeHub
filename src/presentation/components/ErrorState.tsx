import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '../../core/theme';
import { Feather } from '@expo/vector-icons';
import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Feather name="wifi-off" size={42} color={THEME.colors.error} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      <Button
        title="Try Again"
        onPress={onRetry}
        variant="outline"
        iconName="refresh-cw"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xxl,
    paddingVertical: THEME.spacing.xxxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3F1A24',
    borderWidth: 1.5,
    borderColor: THEME.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.xs,
  },
  message: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: THEME.typography.lineHeights.sm,
    marginBottom: THEME.spacing.xl,
  },
  button: {
    width: 160,
    height: 44,
  },
});
