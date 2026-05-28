import { Employee, EmployeeStatus } from '../../domain/entities/Employee';

/**
 * Data Model for Employee in the Data Layer.
 * Decouples raw data storage/API schemas from the core domain entities.
 */
export interface EmployeeJSON {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  salary: number;
  status: string;
  joining_date: string;
  avatar_url?: string;
}

export class EmployeeModel {
  /**
   * Maps database/API JSON representation to Domain Entity
   */
  static toDomain(json: EmployeeJSON): Employee {
    return {
      id: json.id,
      firstName: json.first_name,
      lastName: json.last_name,
      email: json.email,
      phone: json.phone,
      department: json.department,
      role: json.role,
      salary: Number(json.salary),
      status: (json.status as EmployeeStatus) || 'Active',
      joiningDate: json.joining_date,
      avatarUrl: json.avatar_url || `https://ui-avatars.com/api/?name=${json.first_name}+${json.last_name}&background=6366F1&color=fff&size=128`,
    };
  }

  /**
   * Maps Domain Entity to API JSON representation
   */
  static toJson(domain: Employee): EmployeeJSON {
    return {
      id: domain.id,
      first_name: domain.firstName,
      last_name: domain.lastName,
      email: domain.email,
      phone: domain.phone,
      department: domain.department,
      role: domain.role,
      salary: domain.salary,
      status: domain.status,
      joining_date: domain.joiningDate,
      avatar_url: domain.avatarUrl,
    };
  }

  /**
   * Utility to parse arrays of API data
   */
  static toDomainList(list: EmployeeJSON[]): Employee[] {
    return list.map(EmployeeModel.toDomain);
  }
}
