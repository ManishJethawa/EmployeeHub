import { create } from 'zustand';
import { Employee, User } from '../../domain/entities/Employee';

// Data layer & Use case wiring (Dependency Injection)
import { RemoteDataSourceImpl } from '../../data/datasources/RemoteDataSource';
import { LocalDataSourceImpl } from '../../data/datasources/LocalDataSource';
import { EmployeeRepositoryImpl } from '../../data/repositories/EmployeeRepositoryImpl';
import { GetEmployees } from '../../domain/usecases/GetEmployees';
import { AddEmployee } from '../../domain/usecases/AddEmployee';
import { UpdateEmployee } from '../../domain/usecases/UpdateEmployee';
import { DeleteEmployee } from '../../domain/usecases/DeleteEmployee';
import { Storage } from '../../core/utils/storage';

const remoteDataSource = new RemoteDataSourceImpl();
const localDataSource = new LocalDataSourceImpl();
const repository = new EmployeeRepositoryImpl(remoteDataSource, localDataSource);

const getEmployeesUseCase = new GetEmployees(repository);
const addEmployeeUseCase = new AddEmployee(repository);
const updateEmployeeUseCase = new UpdateEmployee(repository);
const deleteEmployeeUseCase = new DeleteEmployee(repository);

const USER_SESSION_KEY = '@user_session';
const REGISTERED_USERS_KEY = '@registered_users';

export interface RegisteredUser {
  name: string;
  email: string;
  password?: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  message: string;
  type: ToastType;
}

// Pre-configured default admin user for direct login out-of-the-box
const DEFAULT_ADMIN: RegisteredUser = {
  name: 'Admin Supervisor',
  email: 'admin@employeehub.com',
  password: 'password123',
};

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  currentUser: User | null;
  registeredUsers: RegisteredUser[];
  isLoading: boolean;
  error: string | null;
  toast: ToastMessage | null;

  // Authentication Actions
  checkSession: () => Promise<void>;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;

  // Toast UI Actions
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;

  // Employee Operations
  fetchEmployees: () => Promise<void>;
  selectEmployee: (employee: Employee | null) => void;
  createEmployee: (employeeData: Omit<Employee, 'id'>) => Promise<boolean>;
  editEmployee: (employee: Employee) => Promise<boolean>;
  removeEmployee: (id: string) => Promise<boolean>;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  currentUser: null,
  registeredUsers: [],
  isLoading: false,
  error: null,
  toast: null,

  checkSession: async () => {
    try {
      // 1. Load active user session if exists
      const savedUser = await Storage.getItem<User>(USER_SESSION_KEY);
      if (savedUser) {
        set({ currentUser: savedUser });
      }

      // 2. Load registered users list from AsyncStorage
      const usersList = await Storage.getItem<RegisteredUser[]>(REGISTERED_USERS_KEY);
      if (usersList) {
        set({ registeredUsers: usersList });
      } else {
        // Cache the default admin user on first run
        await Storage.setItem(REGISTERED_USERS_KEY, [DEFAULT_ADMIN]);
        set({ registeredUsers: [DEFAULT_ADMIN] });
      }
    } catch (e) {
      console.error('Failed to resolve active user session', e);
    }
  },

  login: async (email: string, password?: string, rememberMe = false) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
      
      const { registeredUsers, showToast } = get();
      
      // Match credentials against registered database
      const matchedUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!matchedUser) {
        throw new Error('No account found with this email. Please register.');
      }

      if (password && matchedUser.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }

      const userSession: User = {
        id: `usr_${Date.now()}`,
        email: matchedUser.email,
        name: matchedUser.name,
        token: `jwt_token_${Date.now()}`,
      };

      // Persist user session only if "Remember Me" checkbox was toggled
      if (rememberMe) {
        await Storage.setItem(USER_SESSION_KEY, userSession);
      } else {
        // Ensure old stored session is cleared if rememberMe is unchecked
        await Storage.removeItem(USER_SESSION_KEY);
      }

      set({ currentUser: userSession, isLoading: false });
      showToast(`Welcome back, ${matchedUser.name}!`, 'success');
      return true;
    } catch (e: any) {
      set({ error: e.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

      const { registeredUsers } = get();

      const exists = registeredUsers.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (exists) {
        throw new Error('An account with this email is already registered.');
      }

      const newUser: RegisteredUser = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      const updatedUsersList = [...registeredUsers, newUser];
      
      // Save updated database list to local storage
      await Storage.setItem(REGISTERED_USERS_KEY, updatedUsersList);

      set({ registeredUsers: updatedUsersList, isLoading: false });
      return true;
    } catch (e: any) {
      set({ error: e.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    const { showToast } = get();
    await Storage.removeItem(USER_SESSION_KEY);
    set({ currentUser: null, employees: [], selectedEmployee: null });
    showToast('Signed out successfully', 'info');
  },

  showToast: (message: string, type: ToastType = 'success') => {
    set({ toast: { message, type } });
  },

  hideToast: () => {
    set({ toast: null });
  },

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getEmployeesUseCase.execute();
      set({ employees: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch employees', isLoading: false });
      get().showToast('Failed to fetch employees', 'error');
    }
  },

  selectEmployee: (employee: Employee | null) => {
    set({ selectedEmployee: employee });
  },

  createEmployee: async (employeeData: Omit<Employee, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const newEmp = await addEmployeeUseCase.execute(employeeData);
      set((state) => ({
        employees: [newEmp, ...state.employees],
        isLoading: false,
      }));
      get().showToast(`${newEmp.firstName} registered successfully`, 'success');
      return true;
    } catch (e: any) {
      set({ error: e.message || 'Failed to add employee', isLoading: false });
      get().showToast(e.message || 'Failed to add employee', 'error');
      return false;
    }
  },

  editEmployee: async (employee: Employee) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEmp = await updateEmployeeUseCase.execute(employee);
      set((state) => ({
        employees: state.employees.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)),
        selectedEmployee: state.selectedEmployee?.id === updatedEmp.id ? updatedEmp : state.selectedEmployee,
        isLoading: false,
      }));
      get().showToast(`Updated details for ${updatedEmp.firstName}`, 'success');
      return true;
    } catch (e: any) {
      set({ error: e.message || 'Failed to update employee', isLoading: false });
      get().showToast(e.message || 'Failed to update details', 'error');
      return false;
    }
  },

  removeEmployee: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { employees } = get();
      const targetEmp = employees.find(e => e.id === id);
      const name = targetEmp ? targetEmp.firstName : 'Employee';

      await deleteEmployeeUseCase.execute(id);
      set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
        selectedEmployee: state.selectedEmployee?.id === id ? null : state.selectedEmployee,
        isLoading: false,
      }));
      get().showToast(`${name} removed from record`, 'info');
      return true;
    } catch (e: any) {
      set({ error: e.message || 'Failed to delete employee', isLoading: false });
      get().showToast(e.message || 'Failed to remove record', 'error');
      return false;
    }
  },
}));
