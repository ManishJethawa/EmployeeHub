import { Employee } from '../../domain/entities/Employee';
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository';
import { LocalDataSource } from '../datasources/LocalDataSource';
import { RemoteDataSource } from '../datasources/RemoteDataSource';
import { EmployeeModel } from '../models/EmployeeModel';

/**
 * Concrete implementation of the EmployeeRepository.
 * Coordinates data operations across Remote (Axios) and Local (AsyncStorage) sources.
 */
export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(
    private remoteDataSource: RemoteDataSource,
    private localDataSource: LocalDataSource
  ) {}

  async getAllEmployees(): Promise<Employee[]> {
    try {
      // 1. Fetch newest records from Remote API
      const remoteJsonList = await this.remoteDataSource.getEmployees();
      
      // 2. Cache updated list locally
      await this.localDataSource.cacheEmployees(remoteJsonList);

      // 3. Return mapped domain entities
      return EmployeeModel.toDomainList(remoteJsonList);
    } catch (error) {
      console.warn('Network request failed. Falling back to offline local storage.', error);
      
      // Offline fallback: load cached data
      const cachedJsonList = await this.localDataSource.getCachedEmployees();
      return EmployeeModel.toDomainList(cachedJsonList);
    }
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    // Queries local cache for immediate availability
    const cachedJsonList = await this.localDataSource.getCachedEmployees();
    const found = cachedJsonList.find((item) => item.id === id);
    if (!found) return null;
    return EmployeeModel.toDomain(found);
  }

  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const rawDto = {
      first_name: employee.firstName,
      last_name: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      salary: employee.salary,
      status: employee.status,
      joining_date: employee.joiningDate,
      avatar_url: employee.avatarUrl,
    };

    // 1. Save to Remote API
    const savedDto = await this.remoteDataSource.createEmployee(rawDto);

    // 2. Sync to Local storage
    const currentCache = await this.localDataSource.getCachedEmployees();
    currentCache.unshift(savedDto);
    await this.localDataSource.cacheEmployees(currentCache);

    // 3. Return Domain object
    return EmployeeModel.toDomain(savedDto);
  }

  async updateEmployee(employee: Employee): Promise<Employee> {
    const rawDto = EmployeeModel.toJson(employee);

    // 1. Save to Remote API
    const updatedDto = await this.remoteDataSource.updateEmployee(rawDto);

    // 2. Sync to Local storage cache
    const currentCache = await this.localDataSource.getCachedEmployees();
    const index = currentCache.findIndex((e) => e.id === employee.id);
    if (index !== -1) {
      currentCache[index] = updatedDto;
      await this.localDataSource.cacheEmployees(currentCache);
    }

    return EmployeeModel.toDomain(updatedDto);
  }

  async deleteEmployee(id: string): Promise<void> {
    // 1. Delete on Remote API
    await this.remoteDataSource.deleteEmployee(id);

    // 2. Sync to Local storage cache
    const currentCache = await this.localDataSource.getCachedEmployees();
    const updatedCache = currentCache.filter((e) => e.id !== id);
    await this.localDataSource.cacheEmployees(updatedCache);
  }
}
