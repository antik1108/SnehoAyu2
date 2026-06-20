/**
 * Minimal IndexedDB-backed queue for checklist updates made while offline.
 * Flushed automatically when the browser regains connectivity.
 */
const DB_NAME = 'snehoayu-offline';
const STORE_NAME = 'checklist-queue';
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueChecklistUpdate(payload: unknown): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).add({ payload, queuedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function flushChecklistQueue(send: (payload: unknown) => Promise<unknown>): Promise<void> {
  const db = await openDb();
  const items: Array<{ id: number; payload: unknown }> = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  for (const item of items) {
    try {
      await send(item.payload);
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(item.id);
    } catch {
      break;
    }
  }
}
