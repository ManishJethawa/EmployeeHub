import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../core/theme';
import { useEmployeeStore } from '../state/useEmployeeStore';
import { DashboardNavigationProp } from '../navigation/types';
import { Feather } from '@expo/vector-icons';
import { Employee } from '../../domain/entities/Employee';
import { SkeletonLoader } from '../components/SkeletonLoader';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { employees, currentUser, isLoading, fetchEmployees, selectEmployee } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Performance: Memoize employee status calculations
  const metrics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'Active').length;
    const leave = employees.filter((e) => e.status === 'On Leave').length;
    return { total, active, leave };
  }, [employees]);

  // Performance: Memoize recent hires sorting to prevent recalculations
  const recentHires = useMemo(() => {
    return [...employees]
      .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
      .slice(0, 3);
  }, [employees]);

  // Performance: Memoize callbacks to prevent rerender loops
  const handleRecentPress = useCallback((employee: Employee) => {
    selectEmployee(employee);
    navigation.navigate('EmployeeDetail', { employeeId: employee.id });
  }, [navigation, selectEmployee]);

  // Performance: Memoize quick actions list
  const quickActions = useMemo(() => [
    {
      title: 'Add Employee',
      icon: 'user-plus' as const,
      color: THEME.colors.primary,
      onPress: () => {
        selectEmployee(null);
        navigation.navigate('AddEditEmployee', {});
      },
    },
    {
      title: 'Staff Directory',
      icon: 'users' as const,
      color: THEME.colors.secondary,
      onPress: () => navigation.navigate('Directory'),
    },
    {
      title: 'Supervisor Profile',
      icon: 'settings' as const,
      color: THEME.colors.warning,
      onPress: () => navigation.navigate('Profile'),
    },
  ], [navigation, selectEmployee]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      
      {/* Upper Welcome Header banner */}
      <View style={styles.header}>
        <View style={styles.welcomeRow}>
          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>Dashboard</Text>
            <Text style={styles.adminName} numberOfLines={1}>
              Hello, {currentUser?.name || 'Supervisor'}
            </Text>
          </View>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {currentUser?.name?.substring(0, 2).toUpperCase() || 'HR'}
            </Text>
          </View>
        </View>
      </View>

      {/* Metrics Row Section */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIconBg, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
            <Feather name="users" size={20} color={THEME.colors.primary} />
          </View>
          <Text style={styles.metricNumber}>{metrics.total}</Text>
          <Text style={styles.metricLabel}>Total Staff</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Feather name="check-circle" size={20} color={THEME.colors.success} />
          </View>
          <Text style={styles.metricNumber}>{metrics.active}</Text>
          <Text style={styles.metricLabel}>Active</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Feather name="clock" size={20} color={THEME.colors.warning} />
          </View>
          <Text style={styles.metricNumber}>{metrics.leave}</Text>
          <Text style={styles.metricLabel}>On Leave</Text>
        </View>
      </View>

      {/* Quick Action Grid */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Quick Operations</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={action.onPress}
              style={styles.actionCard}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
                <Feather name={action.icon} size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Employees List */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Hires</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Directory')}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {isLoading && employees.length === 0 ? (
          <SkeletonLoader />
        ) : recentHires.length === 0 ? (
          <View style={styles.emptyRecentCard}>
            <Text style={styles.emptyRecentText}>No employee records found</Text>
          </View>
        ) : (
          recentHires.map((emp) => (
            <TouchableOpacity
              key={emp.id}
              activeOpacity={0.8}
              onPress={() => handleRecentPress(emp)}
              style={styles.recentItemRow}
            >
              <Image source={{ uri: emp.avatarUrl }} style={styles.recentAvatar} />
              <View style={styles.recentInfo}>
                <Text style={styles.recentName}>{`${emp.firstName} ${emp.lastName}`}</Text>
                <Text style={styles.recentRole}>{emp.role}</Text>
              </View>
              <View style={styles.recentArrow}>
                <Feather name="chevron-right" size={16} color={THEME.colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.xl,
    paddingBottom: THEME.spacing.md,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  greetingText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
  adminName: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    marginTop: 2,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: THEME.typography.weights.bold,
    fontSize: THEME.typography.sizes.md,
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.sm,
    marginVertical: THEME.spacing.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'flex-start',
    ...THEME.shadows.subtle,
  },
  metricIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  metricNumber: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  metricLabel: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
    fontWeight: THEME.typography.weights.medium,
  },
  sectionContainer: {
    paddingHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  viewAllLink: {
    color: THEME.colors.primary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    ...THEME.shadows.subtle,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  actionText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  emptyRecentCard: {
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  emptyRecentText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.sizes.sm,
  },
  recentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.subtle,
  },
  recentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.border,
    marginRight: THEME.spacing.md,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  recentRole: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  recentArrow: {
    paddingLeft: THEME.spacing.sm,
  },
});
