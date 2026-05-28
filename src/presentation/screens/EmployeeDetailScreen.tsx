import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { THEME } from '../../core/theme';
import { useEmployeeStore } from '../state/useEmployeeStore';
import { RoutePropType, RootStackNavigationProp } from '../navigation/types';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Feather } from '@expo/vector-icons';

export const EmployeeDetailScreen: React.FC = () => {
  const route = useRoute<RoutePropType<'EmployeeDetail'>>();
  const navigation = useNavigation<RootStackNavigationProp<'EmployeeDetail'>>();
  const { employeeId } = route.params;

  const { employees, removeEmployee, isLoading } = useEmployeeStore();
  
  // Find employee from store (ensures reactivity if they get updated)
  const employee = employees.find((e) => e.id === employeeId);

  if (!employee) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="frown" size={48} color={THEME.colors.error} />
        <Text style={styles.errorText}>Employee not found</Text>
        <Button
          title="Back to List"
          onPress={() => navigation.navigate('MainTabs')}
          style={styles.backBtn}
        />
      </View>
    );
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to remove ${employee.firstName} ${employee.lastName} from the organization directory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await removeEmployee(employee.id);
            if (success) {
              navigation.navigate('MainTabs');
            }
          },
        },
      ]
    );
  };

  const handleEditPress = () => {
    navigation.navigate('AddEditEmployee', { employeeId: employee.id });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      
      {/* Profile Header Header Card */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: employee.avatarUrl }} style={styles.largeAvatar} />
        <Text style={styles.fullName}>{`${employee.firstName} ${employee.lastName}`}</Text>
        <Text style={styles.roleTitle}>{employee.role}</Text>
        <View style={styles.badgeContainer}>
          <StatusBadge status={employee.status} />
        </View>
      </View>

      {/* Info Sections Details */}
      <View style={styles.detailsContainer}>
        
        {/* Card 1: Job Info */}
        <View style={styles.detailCard}>
          <Text style={styles.cardHeading}>Employment Information</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.iconLabel}>
              <Feather name="briefcase" size={16} color={THEME.colors.primary} />
              <Text style={styles.detailLabel}>Department</Text>
            </View>
            <Text style={styles.detailValue}>{employee.department}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconLabel}>
              <Feather name="dollar-sign" size={16} color={THEME.colors.primary} />
              <Text style={styles.detailLabel}>Annual Salary</Text>
            </View>
            <Text style={styles.detailValue}>{formatSalary(employee.salary)}</Text>
          </View>

          <View style={[styles.detailRow, styles.lastRow]}>
            <View style={styles.iconLabel}>
              <Feather name="calendar" size={16} color={THEME.colors.primary} />
              <Text style={styles.detailLabel}>Joining Date</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(employee.joiningDate)}</Text>
          </View>
        </View>

        {/* Card 2: Contact Info */}
        <View style={styles.detailCard}>
          <Text style={styles.cardHeading}>Contact Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.iconLabel}>
              <Feather name="mail" size={16} color={THEME.colors.secondary} />
              <Text style={styles.detailLabel}>Email Address</Text>
            </View>
            <Text style={styles.detailValue} numberOfLines={1}>{employee.email}</Text>
          </View>

          <View style={[styles.detailRow, styles.lastRow]}>
            <View style={styles.iconLabel}>
              <Feather name="phone" size={16} color={THEME.colors.secondary} />
              <Text style={styles.detailLabel}>Phone Number</Text>
            </View>
            <Text style={styles.detailValue}>{employee.phone}</Text>
          </View>
        </View>

        {/* Form Administration Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Edit Profile"
            onPress={handleEditPress}
            variant="primary"
            iconName="edit-3"
            style={styles.actionBtn}
          />
          <Button
            title="Remove Employee"
            onPress={handleDeletePress}
            variant="danger"
            iconName="trash-2"
            loading={isLoading}
            style={styles.actionBtn}
          />
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.xl,
  },
  errorText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.semibold,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  backBtn: {
    width: 200,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xxl,
    backgroundColor: THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderColor: THEME.colors.border,
  },
  largeAvatar: {
    width: 110,
    height: 110,
    borderRadius: THEME.borderRadius.round,
    borderWidth: 3,
    borderColor: THEME.colors.primary,
    marginBottom: THEME.spacing.md,
    backgroundColor: THEME.colors.border,
  },
  fullName: {
    fontSize: THEME.typography.sizes.xxl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  roleTitle: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
  },
  badgeContainer: {
    marginTop: THEME.spacing.md,
  },
  detailsContainer: {
    padding: THEME.spacing.lg,
  },
  detailCard: {
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.subtle,
  },
  cardHeading: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingBottom: THEME.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    marginLeft: THEME.spacing.sm,
    fontWeight: THEME.typography.weights.medium,
  },
  detailValue: {
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weights.semibold,
    flex: 1,
    textAlign: 'right',
    marginLeft: THEME.spacing.lg,
  },
  actionsContainer: {
    marginTop: THEME.spacing.sm,
    gap: THEME.spacing.md,
  },
  actionBtn: {
    width: '100%',
  },
});
