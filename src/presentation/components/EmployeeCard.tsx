import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../core/theme';
import { Employee } from '../../domain/entities/Employee';
import { StatusBadge } from './StatusBadge';
import { Feather } from '@expo/vector-icons';

interface EmployeeCardProps {
  employee: Employee;
  onPress: () => void;
}

const EmployeeCardComponent: React.FC<EmployeeCardProps> = ({ employee, onPress }) => {
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <Image source={{ uri: employee.avatarUrl }} style={styles.avatar} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName}
          </Text>
          <StatusBadge status={employee.status} />
        </View>
        
        <Text style={styles.role} numberOfLines={1}>
          {employee.role}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.tag}>
            <Feather name="briefcase" size={12} color={THEME.colors.secondary} />
            <Text style={styles.tagText}>{employee.department}</Text>
          </View>
          
          <Feather name="chevron-right" size={18} color={THEME.colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.subtle,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.border,
    marginRight: THEME.spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  name: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  role: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.xs,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  tagText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textSecondary,
    marginLeft: THEME.spacing.xs,
  },
});

// Memoize component to block redundant rendering cycles
export const EmployeeCard = React.memo(EmployeeCardComponent);
