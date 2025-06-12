import type { ExampleAudioObject } from '@/types';

/**
 * 使用 IndexedDB 存储音频与相关数据
 */
export class ExampleAudioDB {
  static DB_NAME = 'example-audio-db';
  static DB_VERSION = 1;
  static STORE_NAME = 'audio';

  private db: IDBDatabase | undefined;

  constructor() {}

  openDB() {
    return new Promise<IDBDatabase>((res, rej) => {
      const dbOpenRequest = indexedDB.open(ExampleAudioDB.DB_NAME, ExampleAudioDB.DB_VERSION);

      dbOpenRequest.onerror = () => {
        rej('Error loading database.');
      };

      dbOpenRequest.onsuccess = () => {
        this.db = dbOpenRequest.result;
        res(this.db);
      };

      dbOpenRequest.onupgradeneeded = (event) => {
        const db: IDBDatabase = (event.target! as unknown as { result: IDBDatabase }).result;

        if (!db.objectStoreNames.contains(ExampleAudioDB.STORE_NAME)) {
          db.createObjectStore(
            ExampleAudioDB.STORE_NAME,
            { keyPath: 'id' },
          );
        }
      };
    });
  }

  async addExampleAudio(exampleAudio: ExampleAudioObject) {
    if (!this.db) {
      await this.openDB();
    }

    return new Promise((res, rej) => {
      const transaction = this.db!.transaction(ExampleAudioDB.STORE_NAME, 'readwrite');
      const objectStore = transaction.objectStore(ExampleAudioDB.STORE_NAME);

      const putRequest = objectStore.put({
        ...exampleAudio
      });

      putRequest.onerror = () => {
        rej('Error');
      };

      putRequest.onsuccess = () => {
        res('Success');
      };
    });
  }

  async getExampleAudio(id: string) {
    if (!this.db) {
      await this.openDB();
    }

    return new Promise<ExampleAudioObject | null>((res, rej) => {
      const transaction = this.db!.transaction(ExampleAudioDB.STORE_NAME, 'readwrite');
      const objectStore = transaction.objectStore(ExampleAudioDB.STORE_NAME);

      const getRequest = objectStore.get(id);

      getRequest.onerror = () => {
        rej('Error');
      };

      getRequest.onsuccess = () => {
        const exampleAudioObject = getRequest.result;
        if (exampleAudioObject) {
          res(exampleAudioObject);
        } else {
          res(null);
        }
      };
    });
  }
}
