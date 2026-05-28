import { Employee } from '../entities/Employee';

/**
 * Interface boundary defining core storage/API actions on Employee data.
 * The Data Layer must implement this repository.
 */
export interface EmployeeRepository {
  getAllEmployees(): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee | null>;
  createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee>;
  updateEmployee(employee: Employee): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;
}
