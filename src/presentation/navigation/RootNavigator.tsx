import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from './types';
import { THEME } from '../../core/theme';
import { useEmployeeStore } from '../state/useEmployeeStore';

// Import Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { EmployeeListScreen } from '../screens/EmployeeListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EmployeeDetailScreen } from '../screens/EmployeeDetailScreen';
import { AddEditEmployeeScreen } from '../screens/AddEditEmployeeScreen';

import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Nested Tab Navigator for authenticated flows
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'grid';
          if (route.name === 'Dashboard') {
            iconName = 'grid';
          } else if (route.name === 'Directory') {
            iconName = 'users';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.textSecondary,
        tabBarLabelStyle: {
          fontWeight: THEME.typography.weights.medium,
          fontSize: 11,
          paddingBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: THEME.colors.cardBackground,
          borderTopColor: THEME.colors.border,
          borderTopWidth: 1.5,
          height: 60,
          paddingTop: 6,
        },
        headerStyle: {
          backgroundColor: THEME.colors.cardBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1.5,
          borderBottomColor: THEME.colors.border,
        },
        headerTintColor: THEME.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: THEME.typography.weights.bold,
          fontSize: THEME.typography.sizes.lg,
        },
        cardStyle: {
          backgroundColor: THEME.colors.background,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Overview' }}
      />
      <Tab.Screen
        name="Directory"
        component={EmployeeListScreen}
        options={{ title: 'Directory' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { currentUser, checkSession, isLoading } = useEmployeeStore();

  useEffect(() => {
    // Check local storage for persistent user sessions on startup
    checkSession();
  }, []);

  if (isLoading && !currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: THEME.colors.cardBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: THEME.colors.border,
        },
        headerTintColor: THEME.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: THEME.typography.weights.bold,
          fontSize: THEME.typography.sizes.lg,
        },
        cardStyle: {
          backgroundColor: THEME.colors.background,
        },
      }}
    >
      {currentUser === null ? (
        // Auth Stack
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        // App Stack (Tab Navigator nested inside Stack)
        <>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EmployeeDetail"
            component={EmployeeDetailScreen}
            options={{ title: 'Employee Details' }}
          />
          <Stack.Screen
            name="AddEditEmployee"
            component={AddEditEmployeeScreen}
            options={({ route }) => ({
              title: route.params?.employeeId ? 'Edit Employee' : 'Add Employee',
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
