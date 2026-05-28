import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../core/theme';
import { useEmployeeStore } from '../state/useEmployeeStore';
import { EmployeeCard } from '../components/EmployeeCard';
import { DirectoryNavigationProp } from '../navigation/types';
import { Feather } from '@expo/vector-icons';
import { Employee } from '../../domain/entities/Employee';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';

export const EmployeeListScreen: React.FC = () => {
  const navigation = useNavigation<DirectoryNavigationProp>();
  const {
    employees,
    isLoading,
    error,
    currentUser,
    fetchEmployees,
    selectEmployee,
  } = useEmployeeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Performance: Memoize unique departments list to avoid recalculation
  const departments = useMemo(() => {
    return ['All', ...new Set(employees.map((e) => e.department))];
  }, [employees]);

  // Performance: Memoize filter computations to prevent lags during searching
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      const matchesSearch =
        fullName.includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query);

      const matchesDept =
        !selectedDeptFilter ||
        selectedDeptFilter === 'All' ||
        emp.department === selectedDeptFilter;

      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, selectedDeptFilter]);

  // Performance: Memoize callback functions to prevent child component re-renders
  const handleCardPress = useCallback((employee: Employee) => {
    selectEmployee(employee);
    navigation.navigate('EmployeeDetail', { employeeId: employee.id });
  }, [navigation, selectEmployee]);

  const handleAddNewPress = useCallback(() => {
    selectEmployee(null);
    navigation.navigate('AddEditEmployee', {});
  }, [navigation, selectEmployee]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const renderFilterItem = useCallback(({ item }: { item: string }) => {
    const isSelected =
      selectedDeptFilter === item || (item === 'All' && !selectedDeptFilter);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedDeptFilter(item === 'All' ? null : item)}
        style={[
          styles.filterPill,
          isSelected && styles.filterPillActive,
        ]}
      >
        <Text
          style={[
            styles.filterPillText,
            isSelected && styles.filterPillTextActive,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedDeptFilter]);

  const renderEmployeeItem = useCallback(({ item }: { item: Employee }) => (
    <EmployeeCard employee={item} onPress={() => handleCardPress(item)} />
  ), [handleCardPress]);

  // KeyExtractor functions memoized for FlatList
  const employeeKeyExtractor = useCallback((item: Employee) => item.id, []);
  const departmentKeyExtractor = useCallback((item: string) => item, []);

  // UI State: Error boundaries
  if (error && employees.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
        <ErrorState message={error} onRetry={fetchEmployees} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.cardBackground} />
      
      {/* Greetings Sub-header */}
      <View style={styles.subheader}>
        <View>
          <Text style={styles.greetingsText}>Welcome back,</Text>
          <Text style={styles.adminName}>{currentUser?.name || 'Administrator'}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{employees.length} Staff</Text>
        </View>
      </View>

      {/* Interactive Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={THEME.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, role or email..."
          placeholderTextColor={THEME.colors.textMuted}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Feather name="x" size={18} color={THEME.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Dynamic Department Filter list */}
      <View style={styles.filterListContainer}>
        <FlatList
          data={departments}
          renderItem={renderFilterItem}
          keyExtractor={departmentKeyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterListContent}
        />
      </View>

      {/* Main Employee list container with optimized layout states */}
      {isLoading && employees.length === 0 ? (
        <View style={styles.loaderPadding}>
          <SkeletonLoader />
        </View>
      ) : filteredEmployees.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No Results Found' : 'Directory Empty'}
          description={
            searchQuery
              ? `We couldn't find any results matching "${searchQuery}"`
              : 'There are no employees registered in this system yet.'
          }
          iconName="users"
          actionTitle={searchQuery ? 'Clear Search' : 'Register Employee'}
          onActionPress={searchQuery ? handleClearSearch : handleAddNewPress}
        />
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={employeeKeyExtractor}
          renderItem={renderEmployeeItem}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchEmployees}
          refreshing={isLoading}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleAddNewPress}
        style={styles.fab}
      >
        <Feather name="plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  subheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
  },
  greetingsText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
  },
  adminName: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  countBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.round,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  countBadgeText: {
    color: THEME.colors.secondary,
    fontWeight: THEME.typography.weights.bold,
    fontSize: THEME.typography.sizes.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardBackground,
    marginHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    height: 50,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  searchIcon: {
    marginRight: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.sizes.md,
  },
  filterListContainer: {
    height: 52,
    marginBottom: THEME.spacing.sm,
  },
  filterListContent: {
    paddingHorizontal: THEME.spacing.lg,
    alignItems: 'center',
  },
  filterPill: {
    backgroundColor: THEME.colors.cardBackground,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.round,
    marginRight: THEME.spacing.sm,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  filterPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterPillText: {
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
    fontSize: THEME.typography.sizes.sm,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: THEME.typography.weights.semibold,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 100,
  },
  loaderPadding: {
    paddingHorizontal: THEME.spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: THEME.spacing.xl,
    right: THEME.spacing.xl,
    backgroundColor: THEME.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.shadows.medium,
  },
});
