import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { THEME } from '../../core/theme';
import { Feather } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconName?: keyof typeof Feather.glyphMap;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  iconName,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          button: [styles.baseButton, styles.secondaryButton, style],
          text: [styles.baseText, styles.secondaryText, textStyle],
          color: THEME.colors.background,
        };
      case 'danger':
        return {
          button: [styles.baseButton, styles.dangerButton, style],
          text: [styles.baseText, styles.dangerText, textStyle],
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          button: [styles.baseButton, styles.outlineButton, style],
          text: [styles.baseText, styles.outlineText, textStyle],
          color: THEME.colors.primary,
        };
      case 'primary':
      default:
        return {
          button: [styles.baseButton, styles.primaryButton, style],
          text: [styles.baseText, styles.primaryText, textStyle],
          color: THEME.colors.textOnPrimary,
        };
    }
  };

  const currentStyles = getStyles();
  const isInteractionDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isInteractionDisabled}
      style={[
        currentStyles.button,
        isInteractionDisabled && styles.disabledButton,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={currentStyles.color} />
      ) : (
        <View style={styles.contentContainer}>
          {iconName && (
            <Feather
              name={iconName}
              size={18}
              color={variant === 'outline' ? THEME.colors.primary : currentStyles.color}
              style={styles.icon}
            />
          )}
          <Text style={currentStyles.text}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 52,
    borderRadius: THEME.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    ...THEME.shadows.subtle,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: THEME.spacing.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButton: {
    backgroundColor: THEME.colors.primary,
  },
  secondaryButton: {
    backgroundColor: THEME.colors.secondary,
  },
  dangerButton: {
    backgroundColor: THEME.colors.error,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
  },
  baseText: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
  },
  primaryText: {
    color: THEME.colors.textOnPrimary,
  },
  secondaryText: {
    color: THEME.colors.background,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: THEME.colors.primary,
  },
});
