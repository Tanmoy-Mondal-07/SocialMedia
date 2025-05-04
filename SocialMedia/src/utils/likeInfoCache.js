import { openDB } from 'idb';

const DB_NAME = 'dante-profile-likeInfo-cache';
const STORE_NAME = 'likeInfo';
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
const MAX_AGE = 30 * 60 * 1000;

export async function setPostLikeInfo(postId, postLikeData) {
  // console.log('cache updated', postId, postLikeData);
  const db = await dbPromise;
  await db.put(STORE_NAME, { data: postLikeData, timestamp: now() }, postId);
}

export async function getPostLikeInfo(postId) {
  const db = await dbPromise;
  const entry = await db.get(STORE_NAME, postId);

  if (!entry) return null;

  if (now() - entry.timestamp > MAX_AGE) {
    await db.delete(STORE_NAME, postId);
    return null;
  }

  return entry.data;
}

export async function deletePostLikeInfo(postId) {
  const db = await dbPromise;
  return db.delete(STORE_NAME, postId);
}

// Clear entire DB on load (app reload wipe)
// (async () => {
//   const db = await dbPromise;
//   await db.clear(STORE_NAME);
// })();