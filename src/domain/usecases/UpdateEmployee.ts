import { Employee } from '../entities/Employee';
import { EmployeeRepository } from '../repositories/EmployeeRepository';

/**
 * Use case to update an existing employee's details.
 */
export class UpdateEmployee {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(employee: Employee): Promise<Employee> {
    if (!employee.id) {
      throw new Error('Employee ID is required for update');
    }
    return this.employeeRepository.updateEmployee(employee);
  }
}
