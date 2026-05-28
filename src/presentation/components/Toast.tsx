import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../core/theme';
import { useEmployeeStore } from '../state/useEmployeeStore';
import { Feather } from '@expo/vector-icons';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useEmployeeStore();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      // Slide up and fade in
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      // Dismiss automatically after 3 seconds
      const timer = setTimeout(() => {
        dismissToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const dismissToast = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      hideToast();
    });
  };

  if (!toast) return null;

  const getToastConfig = () => {
    switch (toast.type) {
      case 'error':
        return {
          bg: '#450A0A', // Dark red background
          border: THEME.colors.error,
          icon: 'alert-circle' as const,
          iconColor: THEME.colors.error,
        };
      case 'info':
        return {
          bg: '#1E293B', // Slate background
          border: THEME.colors.secondary,
          icon: 'info' as const,
          iconColor: THEME.colors.secondary,
        };
      case 'success':
      default:
        return {
          bg: '#064E3B', // Dark green background
          border: THEME.colors.success,
          icon: 'check-circle' as const,
          iconColor: THEME.colors.success,
        };
    }
  };

  const config = getToastConfig();

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: config.bg,
          borderColor: config.border,
        },
      ]}
    >
      <View style={styles.content}>
        <Feather name={config.icon} size={20} color={config.iconColor} style={styles.icon} />
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
      </View>
      <TouchableOpacity onPress={dismissToast} style={styles.closeButton}>
        <Feather name="x" size={16} color={THEME.colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 40,
    left: THEME.spacing.lg,
    right: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
    ...THEME.shadows.medium,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  icon: {
    marginRight: THEME.spacing.md,
  },
  message: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    flex: 1,
  },
  closeButton: {
    padding: THEME.spacing.xs,
  },
});
