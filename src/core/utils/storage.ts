import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Utility providing safe, helper wrappers around AsyncStorage.
 */
export const Storage = {
  /**
   * Save a string or object value to AsyncStorage
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Storage Error: Failed to set item for key [${key}]`, error);
      throw error;
    }
  },

  /**
   * Retrieve and automatically parse an item from AsyncStorage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) return null;

      // Try parsing value if it looks like serialized JSON
      if (value.startsWith('{') || value.startsWith('[')) {
        return JSON.parse(value) as T;
      }
      return value as unknown as T;
    } catch (error) {
      console.error(`Storage Error: Failed to get item for key [${key}]`, error);
      return null;
    }
  },

  /**
   * Delete a key-value pair from AsyncStorage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage Error: Failed to remove item for key [${key}]`, error);
      throw error;
    }
  },

  /**
   * Clear all items in local storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage Error: Failed to clear AsyncStorage', error);
      throw error;
    }
  },
};
