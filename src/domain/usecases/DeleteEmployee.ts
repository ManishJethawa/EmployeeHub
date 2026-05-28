import { EmployeeRepository } from '../repositories/EmployeeRepository';

/**
 * Use case to delete an employee record.
 */
export class DeleteEmployee {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Employee ID is required for deletion');
    }
    return this.employeeRepository.deleteEmployee(id);
  }
}
