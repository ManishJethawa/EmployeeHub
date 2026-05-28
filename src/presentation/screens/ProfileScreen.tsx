import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { THEME } from '../../core/theme';
import { useEmployeeStore } from '../state/useEmployeeStore';
import { Button } from '../components/Button';
import { Feather } from '@expo/vector-icons';

export const ProfileScreen: React.FC = () => {
  const { currentUser, employees, registeredUsers, logout } = useEmployeeStore();

  const handleLogoutPress = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to end your supervisor session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  // Group employee counts by department
  const departmentStats = employees.reduce((acc: { [key: string]: number }, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const departmentList = Object.entries(departmentStats).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      
      {/* Profile Header Detail */}
      <View style={styles.profileHeader}>
        <View style={styles.largeAvatarPlaceholder}>
          <Text style={styles.avatarText}>
            {currentUser?.name?.substring(0, 2).toUpperCase() || 'HR'}
          </Text>
        </View>
        <Text style={styles.adminName}>{currentUser?.name || 'Supervisor Admin'}</Text>
        <Text style={styles.adminRole}>Organization Director</Text>
      </View>

      {/* Profile Data Details Card */}
      <View style={styles.detailsContainer}>
        
        {/* supervisor account card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardHeading}>Account Information</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.iconLabel}>
              <Feather name="mail" size={16} color={THEME.colors.primary} />
              <Text style={styles.detailLabel}>Email</Text>
            </View>
            <Text style={styles.detailValue} numberOfLines={1}>{currentUser?.email || 'admin@company.com'}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconLabel}>
              <Feather name="shield" size={16} color={THEME.colors.primary} />
              <Text style={styles.detailLabel}>Role Level</Text>
            </View>
            <Text style={styles.detailValue}>Administrator</Text>
          </View>

          <View style={[styles.detailRow, styles.lastRow]}>
            <View style={styles.iconLabel}>
              <Feather name="database" size={16} color={THEME.colors.primary} />
              <Text style={styles.detailLabel}>Supervisors Registered</Text>
            </View>
            <Text style={styles.detailValue}>{registeredUsers.length}</Text>
          </View>
        </View>

        {/* department stats list */}
        <View style={styles.infoCard}>
          <Text style={styles.cardHeading}>Department Breakdown</Text>
          
          {departmentList.length === 0 ? (
            <Text style={styles.emptyText}>No department metrics available</Text>
          ) : (
            departmentList.map(({ name, count }, index) => {
              const isLast = index === departmentList.length - 1;
              return (
                <View key={name} style={[styles.detailRow, isLast && styles.lastRow]}>
                  <View style={styles.iconLabel}>
                    <Feather name="folder" size={16} color={THEME.colors.secondary} />
                    <Text style={styles.detailLabel}>{name}</Text>
                  </View>
                  <Text style={styles.detailValue}>{count} {count === 1 ? 'employee' : 'employees'}</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Session actions */}
        <Button
          title="Sign Out of Session"
          onPress={handleLogoutPress}
          variant="danger"
          iconName="log-out"
          style={styles.logoutBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xxl,
    backgroundColor: THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderColor: THEME.colors.border,
  },
  largeAvatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.medium,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: THEME.typography.sizes.jumbo,
    fontWeight: THEME.typography.weights.bold,
  },
  adminName: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  adminRole: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
  },
  detailsContainer: {
    padding: THEME.spacing.lg,
  },
  infoCard: {
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
  },
  emptyText: {
    color: THEME.colors.textMuted,
    fontSize: THEME.typography.sizes.sm,
    textAlign: 'center',
    paddingVertical: THEME.spacing.sm,
  },
  logoutBtn: {
    marginTop: THEME.spacing.sm,
    width: '100%',
  },
});
