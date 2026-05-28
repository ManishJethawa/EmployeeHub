import { Employee } from '../entities/Employee';
import { EmployeeRepository } from '../repositories/EmployeeRepository';

/**
 * Use case to add/create a new employee.
 */
export class AddEmployee {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    // Add business rules or validations here if needed
    if (!employeeData.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    return this.employeeRepository.createEmployee(employeeData);
  }
}
