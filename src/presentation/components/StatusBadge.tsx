import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../core/theme';
import { EmployeeStatus } from '../../domain/entities/Employee';

interface StatusBadgeProps {
  status: EmployeeStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeColors = () => {
    switch (status) {
      case 'On Leave':
        return {
          bg: '#FEF3C7', // Faint yellow/amber
          text: THEME.colors.warning,
        };
      case 'Terminated':
        return {
          bg: THEME.colors.errorLight, // Faint rose
          text: THEME.colors.error,
        };
      case 'Active':
      default:
        return {
          bg: THEME.colors.successLight, // Faint emerald
          text: THEME.colors.success,
        };
    }
  };

  const colors = getBadgeColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.round,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.bold,
  },
});
