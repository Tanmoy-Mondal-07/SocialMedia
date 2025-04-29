import { openDB } from 'idb';

const DB_NAME = 'dante-notification-cache';
const STORE_NAME = 'notifications';
const DB_VERSION = 5.1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    let store;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      store = db.createObjectStore(STORE_NAME, {
        keyPath: '$id',
      });
    } else {
      store = db.transaction.objectStore(STORE_NAME);
    }

    // basic indexes if not already there
    if (!store.indexNames.contains('timestamp')) {
      store.createIndex('timestamp', 'timestamp');
    }

    // Composite index for efficient userId + $createdAt filtering
    if (!store.indexNames.contains('userId_createdAt')) {
      store.createIndex('userId_createdAt', ['userId', '$createdAt']);
    }
  },
});

const now = () => new Date().getTime();
const MAX_AGE = 24 * 60 * 60 * 1000;

export async function addNotification(notification) {
  try {
    const db = await dbPromise;
    const notificationWithTimestamp = { ...notification, timestamp: now() };
    await db.put(STORE_NAME, notificationWithTimestamp);
    return true
  } catch (error) {
    return false
  }
}

export async function getNotification(id) {
  // console.log('exist');
  const db = await dbPromise;
  const entry = await db.get(STORE_NAME, id);

  if (!entry) return null;

  if (now() - entry.timestamp > MAX_AGE) {
    await db.delete(STORE_NAME, id);
    return null;
  }

  return entry;
}

export async function deleteNotification(id) {
  try {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  } catch (error) {
    return null
  }
}

export async function clearAllNotifications() {
  const db = await dbPromise;
  return db.clear(STORE_NAME);
}

export async function cleanOldNotifications() {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const allKeys = await store.getAllKeys();

  for (const key of allKeys) {
    const entry = await store.get(key);
    if (now() - entry.timestamp > MAX_AGE) {
      await store.delete(key);
    }
  }
  await tx.done;
}

// Optimized query using composite index
export async function getNotificationsByUser(userId) {
  if (typeof userId !== 'string' || !userId) {
    // throw new Error('"its not a problem"/ Invalid userId provided to getNotificationsByUser');
    return
  }

  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.objectStore(STORE_NAME).index('userId_createdAt');

  const minDate = new Date(0).toISOString(); // earliest possible ISO string
  const maxDate = new Date().toISOString();  // current time

  const range = IDBKeyRange.bound(
    [userId, minDate],
    [userId, maxDate],
    false,
    false
  );
  // console.log(range);

  const notifications = await index.getAll(range);
  const validNotifications = notifications.filter(n => now() - n.timestamp <= MAX_AGE);
  validNotifications.reverse();

  await tx.done;
  return validNotifications;
}