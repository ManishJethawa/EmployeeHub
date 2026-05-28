import { Employee } from '../entities/Employee';
import { EmployeeRepository } from '../repositories/EmployeeRepository';

/**
 * Use case to retrieve all employees from the repository.
 */
export class GetEmployees {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(): Promise<Employee[]> {
    return this.employeeRepository.getAllEmployees();
  }
}
