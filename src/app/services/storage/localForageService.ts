import localforage from 'localforage';
import { StorageService } from './storageService';

class LocalForageService implements StorageService {
  async getItem<T>(key: string): Promise<T | null> {
    return localforage.getItem<T>(key);
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    return void localforage.setItem(key, value);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new LocalForageService();
