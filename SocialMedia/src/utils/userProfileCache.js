import { openDB } from 'idb';

const DB_NAME = 'dante-social-app-cache';
const STORE_NAME = 'user-profiles';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME);
      store.createIndex('timestamp', 'timestamp');
    }
  },
});

const now = () => new Date().getTime();

// Mmx cache time 24 hours(milliseconds)
const MAX_AGE = 24 * 60 * 60 * 1000;

export async function setUserProfile(userId, profileData) {
  const db = await dbPromise;
  await db.put(STORE_NAME, { data: profileData, timestamp: now() }, userId);
}

export async function getUserProfile(userId) {
  const db = await dbPromise;
  const entry = await db.get(STORE_NAME, userId);

  if (!entry) return null;

  if (now() - entry.timestamp > MAX_AGE) {
    await db.delete(STORE_NAME, userId);
    return null;
  }

  return entry.data;
}

export async function deleteUserProfile(userId) {
  const db = await dbPromise;
  return db.delete(STORE_NAME, userId);
}

export async function clearAllProfiles() {
  const db = await dbPromise;
  return db.clear(STORE_NAME);
}

export async function cleanOldProfiles() {
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

// Clear entire DB on load (app reload wipe)
(async () => {
  const db = await dbPromise;
  await db.clear(STORE_NAME);
})();