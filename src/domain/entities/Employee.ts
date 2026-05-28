/**
 * Core Employee entity representing a staff member in the domain layer.
 */

export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  salary: number;
  status: EmployeeStatus;
  joiningDate: string; // ISO date string
  avatarUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}
