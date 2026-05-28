import axios, { AxiosInstance } from 'axios';
import { EmployeeJSON } from '../models/EmployeeModel';

export interface RemoteDataSource {
  getEmployees(): Promise<EmployeeJSON[]>;
  createEmployee(employee: Omit<EmployeeJSON, 'id'>): Promise<EmployeeJSON>;
  updateEmployee(employee: EmployeeJSON): Promise<EmployeeJSON>;
  deleteEmployee(id: string): Promise<void>;
}

// Initial mock dataset for a beautiful, rich first-run experience
const INITIAL_REMOTE_EMPLOYEES: EmployeeJSON[] = [
  {
    id: 'emp_1',
    first_name: 'Alex',
    last_name: 'Rivera',
    email: 'alex.rivera@employeehub.io',
    phone: '+1 (555) 019-2834',
    department: 'Engineering',
    role: 'Lead Architect',
    salary: 135000,
    status: 'Active',
    joining_date: '2023-01-15T09:00:00.000Z',
    avatar_url: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=6366F1&color=fff&size=128',
  },
  {
    id: 'emp_2',
    first_name: 'Sarah',
    last_name: 'Chen',
    email: 'sarah.chen@employeehub.io',
    phone: '+1 (555) 024-8192',
    department: 'Product',
    role: 'Senior Product Manager',
    salary: 128000,
    status: 'Active',
    joining_date: '2022-06-10T09:00:00.000Z',
    avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=06B6D4&color=fff&size=128',
  },
  {
    id: 'emp_3',
    first_name: 'Marcus',
    last_name: 'Johnson',
    email: 'marcus.j@employeehub.io',
    phone: '+1 (555) 039-4819',
    department: 'Design',
    role: 'UI/UX Designer',
    salary: 95000,
    status: 'On Leave',
    joining_date: '2024-03-01T09:00:00.000Z',
    avatar_url: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=F59E0B&color=fff&size=128',
  },
  {
    id: 'emp_4',
    first_name: 'Elena',
    last_name: 'Vasiliev',
    email: 'elena.v@employeehub.io',
    phone: '+1 (555) 041-9238',
    department: 'Marketing',
    role: 'Growth Specialist',
    salary: 82000,
    status: 'Active',
    joining_date: '2023-11-20T09:00:00.000Z',
    avatar_url: 'https://ui-avatars.com/api/?name=Elena+Vasiliev&background=10B981&color=fff&size=128',
  },
];

export class RemoteDataSourceImpl implements RemoteDataSource {
  private api: AxiosInstance;
  private localMockState: EmployeeJSON[] = [...INITIAL_REMOTE_EMPLOYEES];

  constructor() {
    // Configured Axios Client with default headers and base URL
    this.api = axios.create({
      baseURL: 'https://api.employeehub.com/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Mock Interceptors could be registered here for auth headers.
  }

  // Artificial delay helper to simulate real mobile HTTP calls
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getEmployees(): Promise<EmployeeJSON[]> {
    await this.delay(600); // 600ms network delay simulation
    return [...this.localMockState];
  }

  async createEmployee(employee: Omit<EmployeeJSON, 'id'>): Promise<EmployeeJSON> {
    await this.delay(800);
    const newEmployee: EmployeeJSON = {
      ...employee,
      id: `emp_${Date.now()}`,
    };
    this.localMockState.unshift(newEmployee);
    return newEmployee;
  }

  async updateEmployee(employee: EmployeeJSON): Promise<EmployeeJSON> {
    await this.delay(800);
    const index = this.localMockState.findIndex((e) => e.id === employee.id);
    if (index === -1) {
      throw new Error(`RemoteDataSource: Employee with ID ${employee.id} not found.`);
    }
    this.localMockState[index] = employee;
    return employee;
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.delay(500);
    this.localMockState = this.localMockState.filter((e) => e.id !== id);
  }
}
