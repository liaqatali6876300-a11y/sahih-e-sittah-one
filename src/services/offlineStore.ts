import { HadithItem } from '../types/hadith';

const DB_NAME = 'sihah-sitta-offline-db';
const DB_VERSION = 1;
const CHAPTER_STORE = 'chapters';
const BOOK_STORE = 'books';

function openDB(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(CHAPTER_STORE)) {
          db.createObjectStore(CHAPTER_STORE);
        }
        if (!db.objectStoreNames.contains(BOOK_STORE)) {
          db.createObjectStore(BOOK_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function getOfflineChapter(
  key: string
): Promise<HadithItem[] | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(CHAPTER_STORE, 'readonly');
      const store = tx.objectStore(CHAPTER_STORE);
      const req = store.get(key);
      req.onsuccess = () => {
        resolve(Array.isArray(req.result) ? (req.result as HadithItem[]) : null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveOfflineChapter(
  key: string,
  items: HadithItem[]
): Promise<void> {
  const db = await openDB();
  if (!db || items.length === 0) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(CHAPTER_STORE, 'readwrite');
      const store = tx.objectStore(CHAPTER_STORE);
      store.put(items, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getOfflineBook(
  bookId: string
): Promise<HadithItem[] | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(BOOK_STORE, 'readonly');
      const store = tx.objectStore(BOOK_STORE);
      const req = store.get(bookId);
      req.onsuccess = () => {
        resolve(Array.isArray(req.result) ? (req.result as HadithItem[]) : null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveOfflineBook(
  bookId: string,
  items: HadithItem[]
): Promise<void> {
  const db = await openDB();
  if (!db || items.length === 0) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(BOOK_STORE, 'readwrite');
      const store = tx.objectStore(BOOK_STORE);
      store.put(items, bookId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getOfflineBookIds(): Promise<string[]> {
  const db = await openDB();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(BOOK_STORE, 'readonly');
      const store = tx.objectStore(BOOK_STORE);
      const req = store.getAllKeys();
      req.onsuccess = () => {
        resolve(Array.isArray(req.result) ? req.result.map(String) : []);
      };
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}
