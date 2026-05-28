import { Storage } from '../../core/utils/storage';
import { EmployeeJSON } from '../models/EmployeeModel';

const CACHE_KEY = '@employee_hub_cache';

export interface LocalDataSource {
  getCachedEmployees(): Promise<EmployeeJSON[]>;
  cacheEmployees(employees: EmployeeJSON[]): Promise<void>;
  clearCache(): Promise<void>;
}

export class LocalDataSourceImpl implements LocalDataSource {
  async getCachedEmployees(): Promise<EmployeeJSON[]> {
    const data = await Storage.getItem<EmployeeJSON[]>(CACHE_KEY);
    return data || [];
  }

  async cacheEmployees(employees: EmployeeJSON[]): Promise<void> {
    await Storage.setItem(CACHE_KEY, employees);
  }

  async clearCache(): Promise<void> {
    await Storage.removeItem(CACHE_KEY);
  }
}
