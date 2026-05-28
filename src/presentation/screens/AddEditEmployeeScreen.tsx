import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { THEME } from '../../core/theme';
import { useEmployeeStore } from '../state/useEmployeeStore';
import { RoutePropType, RootStackNavigationProp } from '../navigation/types';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { EmployeeStatus } from '../../domain/entities/Employee';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'];
const STATUSES: EmployeeStatus[] = ['Active', 'On Leave', 'Terminated'];

// Zod Schema for Employee form validation
const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  department: z.string().min(1, 'Department is required'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  salary: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Salary must be a positive number',
  }),
  status: z.enum(['Active', 'On Leave', 'Terminated'] as const),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const AddEditEmployeeScreen: React.FC = () => {
  const route = useRoute<RoutePropType<'AddEditEmployee'>>();
  const navigation = useNavigation<RootStackNavigationProp<'AddEditEmployee'>>();
  const { employeeId } = route.params;

  const { employees, createEmployee, editEmployee, isLoading, error } = useEmployeeStore();
  
  // Resolve existing details if in Edit mode
  const isEditMode = !!employeeId;
  const existingEmployee = isEditMode ? employees.find((e) => e.id === employeeId) : null;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: existingEmployee?.firstName || '',
      lastName: existingEmployee?.lastName || '',
      email: existingEmployee?.email || '',
      phone: existingEmployee?.phone || '',
      department: existingEmployee?.department || DEPARTMENTS[0],
      role: existingEmployee?.role || '',
      salary: existingEmployee?.salary ? String(existingEmployee.salary) : '',
      status: existingEmployee?.status || 'Active',
    },
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    const formattedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      department: data.department,
      role: data.role,
      salary: Number(data.salary),
      status: data.status,
      joiningDate: existingEmployee?.joiningDate || new Date().toISOString(),
      avatarUrl: existingEmployee?.avatarUrl,
    };

    let success = false;
    if (isEditMode && existingEmployee) {
      success = await editEmployee({
        ...formattedData,
        id: existingEmployee.id,
      });
    } else {
      success = await createEmployee(formattedData);
    }

    if (success) {
      // Pop screen or go back
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {isEditMode ? 'Modify Staff Record' : 'Create Staff Record'}
          </Text>

          {error && <Text style={styles.errorAlert}>{error}</Text>}

          {/* Name Row Container */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    label="First Name"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Jane"
                    error={errors.firstName?.message}
                  />
                )}
              />
            </View>
            <View style={styles.col}>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value } }) => (
                  <InputField
                    label="Last Name"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Doe"
                    error={errors.lastName?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Contact details */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Email Address"
                value={value}
                onChangeText={onChange}
                placeholder="jane.doe@company.com"
                keyboardType="email-address"
                iconName="mail"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Phone Number"
                value={value}
                onChangeText={onChange}
                placeholder="+1 (555) 012-3456"
                keyboardType="phone-pad"
                iconName="phone"
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Job Title / Role"
                value={value}
                onChangeText={onChange}
                placeholder="Software Engineer"
                iconName="user"
                error={errors.role?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="salary"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Annual Salary ($)"
                value={value}
                onChangeText={onChange}
                placeholder="85000"
                keyboardType="numeric"
                iconName="dollar-sign"
                error={errors.salary?.message}
              />
            )}
          />

          {/* Segment Selector for Department */}
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Department</Text>
            <Controller
              control={control}
              name="department"
              render={({ field: { value } }) => (
                <View style={styles.gridSelector}>
                  {DEPARTMENTS.map((dept) => {
                    const isSelected = value === dept;
                    return (
                      <TouchableOpacity
                        key={dept}
                        onPress={() => setValue('department', dept)}
                        style={[
                          styles.gridOption,
                          isSelected && styles.gridOptionSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.gridOptionText,
                            isSelected && styles.gridOptionTextSelected,
                          ]}
                        >
                          {dept}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
          </View>

          {/* Segment Selector for Status */}
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Employment Status</Text>
            <Controller
              control={control}
              name="status"
              render={({ field: { value } }) => (
                <View style={styles.statusSegment}>
                  {STATUSES.map((status) => {
                    const isSelected = value === status;
                    let activeBg = THEME.colors.primary;
                    if (isSelected) {
                      if (status === 'On Leave') activeBg = THEME.colors.warning;
                      if (status === 'Terminated') activeBg = THEME.colors.error;
                    }

                    return (
                      <TouchableOpacity
                        key={status}
                        onPress={() => setValue('status', status)}
                        style={[
                          styles.segmentOption,
                          isSelected && { backgroundColor: activeBg, borderColor: activeBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.segmentText,
                            isSelected && styles.segmentTextSelected,
                          ]}
                        >
                          {status}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
          </View>

          <Button
            title={isEditMode ? 'Update Record' : 'Register Employee'}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: THEME.spacing.lg,
  },
  formCard: {
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.subtle,
  },
  formTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.lg,
  },
  errorAlert: {
    color: THEME.colors.error,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.bold,
    backgroundColor: '#3F1A24',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.lg,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  col: {
    flex: 1,
  },
  selectorContainer: {
    marginBottom: THEME.spacing.lg,
  },
  selectorLabel: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.sm,
    paddingLeft: THEME.spacing.xs,
  },
  gridSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  gridOption: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.sm,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    minWidth: '30%',
    alignItems: 'center',
  },
  gridOptionSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  gridOptionText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
  },
  gridOptionTextSelected: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  statusSegment: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.xs,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
  },
  segmentOption: {
    flex: 1,
    paddingVertical: THEME.spacing.md,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  segmentText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
  },
  segmentTextSelected: {
    color: '#FFFFFF',
    fontWeight: THEME.typography.weights.bold,
  },
  submitBtn: {
    marginTop: THEME.spacing.lg,
    width: '100%',
  },
});
