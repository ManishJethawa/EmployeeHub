import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

/**
 * Parameter list for the Main Bottom Tab Navigator
 */
export type MainTabParamList = {
  Dashboard: undefined;
  Directory: undefined;
  Profile: undefined;
};

/**
 * Parameter list for the Root Stack Navigator
 */
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined; // Nested Tab navigation container
  EmployeeDetail: { employeeId: string };
  AddEditEmployee: { employeeId?: string }; // if undefined, we are in 'Create' mode
};

/**
 * Composite Navigation types enabling screens in Bottom Tabs to fire full-screen Stack pages
 */
export type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
  StackNavigationProp<RootStackParamList>
>;

export type DirectoryNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Directory'>,
  StackNavigationProp<RootStackParamList>
>;

export type ProfileNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  StackNavigationProp<RootStackParamList>
>;

export type RootStackNavigationProp<RouteName extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  RouteName
>;

export type RoutePropType<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
