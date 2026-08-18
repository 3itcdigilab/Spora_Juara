/**
 * FirestoreSync — In-memory cache backed by Cloud Firestore.
 * 
 * Strategy:
 * - On app start: load all Firestore collections into in-memory maps.
 * - Reads: instant from memory (synchronous).
 * - Writes: update memory immediately + write to Firestore in background (fire-and-forget).
 * - This means the localDB API stays synchronous — no component changes needed!
 */

import { firestore } from './firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

// Collection names
const COLLECTIONS = [
  'users',
  'profiles',
  'students',
  'jobs',
  'applications',
  'notifications',
  'certificates',
  'portfolio',
  'talent_scores',
  'interviews',
  'schools',
  'industries',
] as const;

type CollectionName = (typeof COLLECTIONS)[number];

// In-memory store: collectionName -> array of documents
const memoryStore: Record<string, any[]> = {};

// Initialization flag
let _initialized = false;
let _initPromise: Promise<void> | null = null;

/**
 * Load all Firestore collections into memory.
 * Call this once on app startup and await before rendering.
 */
export async function initFirestoreSync(): Promise<void> {
  if (_initialized) return;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    console.log('[FirestoreSync] Loading all collections from Firestore...');
    
    const loadPromises = COLLECTIONS.map(async (colName) => {
      try {
        const colRef = collection(firestore, colName);
        const snapshot = await getDocs(colRef);
        const docs = snapshot.docs.map((d) => ({ ...d.data(), _docId: d.id }));
        memoryStore[colName] = docs;
        console.log(`[FirestoreSync] Loaded ${docs.length} docs from "${colName}"`);
      } catch (err) {
        console.warn(`[FirestoreSync] Failed to load "${colName}", starting empty:`, err);
        memoryStore[colName] = [];
      }
    });

    await Promise.all(loadPromises);

    // Also load localStorage 'spora_users' into Firestore if Firestore 'users' is empty
    // This handles migration of existing registered accounts
    if (memoryStore['users'].length === 0) {
      try {
        const localUsers = JSON.parse(localStorage.getItem('spora_users') || '[]');
        if (localUsers.length > 0) {
          console.log(`[FirestoreSync] Migrating ${localUsers.length} users from localStorage to Firestore...`);
          for (const user of localUsers) {
            const docId = user.email?.toLowerCase().replace(/[^a-z0-9]/g, '_') || `user-${Date.now()}`;
            await fsSet('users', docId, user);
          }
          memoryStore['users'] = localUsers.map((u: any) => ({
            ...u,
            _docId: u.email?.toLowerCase().replace(/[^a-z0-9]/g, '_')
          }));
          console.log('[FirestoreSync] Migration complete.');
        }
      } catch (e) {
        console.warn('[FirestoreSync] Could not migrate localStorage users:', e);
      }
    }

    _initialized = true;
    console.log('[FirestoreSync] All collections loaded into memory.');
  })();

  return _initPromise;
}

export function isFirestoreReady(): boolean {
  return _initialized;
}

// ---- Low-level Firestore write helpers (fire-and-forget) ----

async function fsSet(colName: string, docId: string, data: any): Promise<void> {
  try {
    const cleanData = { ...data };
    delete cleanData._docId;
    // Remove undefined values
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined) delete cleanData[key];
    });
    await setDoc(doc(firestore, colName, docId), cleanData);
  } catch (err) {
    console.error(`[FirestoreSync] Error writing to ${colName}/${docId}:`, err);
  }
}

async function fsDelete(colName: string, docId: string): Promise<void> {
  try {
    await deleteDoc(doc(firestore, colName, docId));
  } catch (err) {
    console.error(`[FirestoreSync] Error deleting ${colName}/${docId}:`, err);
  }
}

async function fsBatchSet(colName: string, items: any[]): Promise<void> {
  try {
    // Firestore batch limit is 500
    const batchSize = 450;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = writeBatch(firestore);
      const chunk = items.slice(i, i + batchSize);
      chunk.forEach((item) => {
        const docId = item._docId || item.id || `doc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const cleanData = { ...item };
        delete cleanData._docId;
        Object.keys(cleanData).forEach(key => {
          if (cleanData[key] === undefined) delete cleanData[key];
        });
        batch.set(doc(firestore, colName, docId), cleanData);
      });
      await batch.commit();
    }
  } catch (err) {
    console.error(`[FirestoreSync] Error batch writing to ${colName}:`, err);
  }
}

// ---- Public API: Read from memory, write to memory + Firestore ----

/** Get all items in a collection (from memory). */
export function getAll(colName: string): any[] {
  return memoryStore[colName] || [];
}

/** Set the entire collection (memory + Firestore). */
export function setAll(colName: string, items: any[]): void {
  memoryStore[colName] = items;
  // Fire-and-forget Firestore sync
  fsBatchSet(colName, items).catch(() => {});
}

/** Add an item to a collection (memory + Firestore). */
export function addItem(colName: string, item: any): void {
  if (!memoryStore[colName]) memoryStore[colName] = [];
  memoryStore[colName].unshift(item);
  const docId = item.id || item._docId || `doc-${Date.now()}`;
  fsSet(colName, docId, item).catch(() => {});
}

/** Update an item by its `id` field (memory + Firestore). */
export function updateItem(colName: string, itemId: string, updatedData: any): void {
  const arr = memoryStore[colName] || [];
  const idx = arr.findIndex((i: any) => i.id === itemId);
  if (idx >= 0) {
    arr[idx] = { ...arr[idx], ...updatedData };
    const docId = arr[idx]._docId || arr[idx].id || itemId;
    fsSet(colName, docId, arr[idx]).catch(() => {});
  }
}

/** Remove an item by its `id` field (memory + Firestore). */
export function removeItem(colName: string, itemId: string): void {
  const arr = memoryStore[colName] || [];
  const item = arr.find((i: any) => i.id === itemId);
  memoryStore[colName] = arr.filter((i: any) => i.id !== itemId);
  if (item) {
    const docId = item._docId || item.id || itemId;
    fsDelete(colName, docId).catch(() => {});
  }
}

/** Remove items matching a predicate (memory + Firestore). */
export function removeWhere(colName: string, predicate: (item: any) => boolean): void {
  const arr = memoryStore[colName] || [];
  const toRemove = arr.filter(predicate);
  memoryStore[colName] = arr.filter((i) => !predicate(i));
  toRemove.forEach((item) => {
    const docId = item._docId || item.id;
    if (docId) fsDelete(colName, docId).catch(() => {});
  });
}

/** Find one item matching a predicate (from memory). */
export function findOne(colName: string, predicate: (item: any) => boolean): any | null {
  const arr = memoryStore[colName] || [];
  return arr.find(predicate) || null;
}

/** Find all items matching a predicate (from memory). */
export function findMany(colName: string, predicate: (item: any) => boolean): any[] {
  const arr = memoryStore[colName] || [];
  return arr.filter(predicate);
}
