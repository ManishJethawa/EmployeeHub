import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { THEME } from '../../core/theme';
import { Feather } from '@expo/vector-icons';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  iconName?: keyof typeof Feather.glyphMap;
  style?: ViewStyle;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  iconName,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, isFocused && styles.focusedLabel, !!error && styles.errorLabel]}>
        {label}
      </Text>
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInputContainer,
          !!error && styles.errorInputContainer,
        ]}
      >
        {iconName && (
          <Feather
            name={iconName}
            size={18}
            color={
              error
                ? THEME.colors.error
                : isFocused
                ? THEME.colors.primary
                : THEME.colors.textSecondary
            }
            style={styles.icon}
          />
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={THEME.colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.xs,
    paddingLeft: THEME.spacing.xs,
  },
  focusedLabel: {
    color: THEME.colors.primary,
  },
  errorLabel: {
    color: THEME.colors.error,
  },
  inputContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardBackground,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
  },
  focusedInputContainer: {
    borderColor: THEME.colors.primary,
  },
  errorInputContainer: {
    borderColor: THEME.colors.error,
  },
  icon: {
    marginRight: THEME.spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.sizes.md,
  },
  errorText: {
    color: THEME.colors.error,
    fontSize: THEME.typography.sizes.xs,
    marginTop: THEME.spacing.xs,
    paddingLeft: THEME.spacing.xs,
  },
});
