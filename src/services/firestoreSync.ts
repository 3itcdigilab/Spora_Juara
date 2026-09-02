/**
 * FirestoreSync — Unified Cloud Firestore sync layer.
 * 
 * Strategy:
 * - On app startup: load all Firestore collections into memory for lightning-fast sub-millisecond reads.
 * - Writes: immediately update memory + asynchronously write/update/delete in Cloud Firestore.
 * - Auto-seeding: seamlessly seeds all 100 students, 12 schools, 12 industries, 20 questions, assessments, and AI reports to Cloud Firestore.
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
import { mockStudents } from '../data/students';
import { mockSchools } from '../data/schools';
import { mockIndustries } from '../data/industries';
import { mockJobs } from '../data/jobs';
import { mockAllUsers } from '../data/users';
import { mockAssessments } from '../data/assessments';
import { defaultQuestionBank } from '../data/psychometricBank';

// All collections managed in Firestore
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
  'assessments',
  'questions',
  'ai_reports'
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
    console.log('[FirestoreSync] Initializing & loading all collections from Cloud Firestore...');
    
    const loadPromises = COLLECTIONS.map(async (colName) => {
      try {
        const colRef = collection(firestore, colName);
        const snapshot = await getDocs(colRef);
        const docs = snapshot.docs.map((d) => ({ ...d.data(), _docId: d.id }));
        memoryStore[colName] = docs;
        console.log(`[FirestoreSync] Loaded ${docs.length} docs from Firestore "${colName}"`);
      } catch (err) {
        console.warn(`[FirestoreSync] Failed to load "${colName}", starting empty:`, err);
        memoryStore[colName] = [];
      }
    });

    await Promise.all(loadPromises);

    // 1. Ensure Admin Account in Firestore
    const adminUser = (memoryStore['users'] || []).find(
      (u: any) => u.email?.toLowerCase() === 'sporaadmin@spora.id' || u.email?.toLowerCase() === 'sporaadmin'
    );
    if (!adminUser) {
      try {
        const adminDoc = {
          id: 'user-sporaadmin',
          name: 'Spora Admin',
          email: 'sporaadmin@spora.id',
          password: 'sporagreenenergy',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        await fsSet('users', 'sporaadmin_spora_id', adminDoc);
        if (!memoryStore['users']) memoryStore['users'] = [];
        memoryStore['users'].unshift({ ...adminDoc, _docId: 'sporaadmin_spora_id' });
        console.log('[FirestoreSync] Seeded admin account sporaadmin@spora.id to Cloud Firestore.');
      } catch (e) {
        console.warn('[FirestoreSync] Could not seed admin user:', e);
      }
    } else if (adminUser.email !== 'sporaadmin@spora.id' || adminUser.password !== 'sporagreenenergy') {
      adminUser.email = 'sporaadmin@spora.id';
      adminUser.password = 'sporagreenenergy';
      adminUser.role = 'admin';
      adminUser.status = 'active';
      const docId = adminUser._docId || adminUser.id || 'sporaadmin_spora_id';
      await fsSet('users', docId, adminUser);
    }

    // 2. Auto-seed 12 Partner Schools if empty
    if ((memoryStore['schools'] || []).length < mockSchools.length) {
      console.log(`[FirestoreSync] Seeding ${mockSchools.length} partner schools to Firestore...`);
      memoryStore['schools'] = [...mockSchools];
      fsBatchSet('schools', mockSchools).catch(() => {});
    }

    // 3. Auto-seed Partner Industries if empty
    if ((memoryStore['industries'] || []).length < mockIndustries.length) {
      console.log(`[FirestoreSync] Seeding ${mockIndustries.length} EV industries to Firestore...`);
      memoryStore['industries'] = [...mockIndustries];
      fsBatchSet('industries', mockIndustries).catch(() => {});
    }

    // 4. Auto-seed All 117 Vocational Students
    if ((memoryStore['students'] || []).length < mockStudents.length) {
      console.log(`[FirestoreSync] Seeding ${mockStudents.length} vocational students to Firestore...`);
      memoryStore['students'] = [...mockStudents];
      fsBatchSet('students', mockStudents).catch(() => {});
    }

    // 5. Auto-seed All User Accounts (117 students, 12 schools, 12 industries, admin)
    if ((memoryStore['users'] || []).length < mockAllUsers.length) {
      console.log(`[FirestoreSync] Seeding ${mockAllUsers.length} user accounts to Firestore...`);
      memoryStore['users'] = [...mockAllUsers];
      fsBatchSet('users', mockAllUsers).catch(() => {});
    }

    // 6. Auto-seed EV Job Vacancies
    if ((memoryStore['jobs'] || []).length === 0) {
      console.log(`[FirestoreSync] Seeding ${mockJobs.length} EV jobs to Firestore...`);
      memoryStore['jobs'] = [...mockJobs];
      fsBatchSet('jobs', mockJobs).catch(() => {});
    }

    // 7. Auto-seed Assessments & Question Bank
    if ((memoryStore['assessments'] || []).length === 0) {
      console.log(`[FirestoreSync] Seeding ${mockAssessments.length} assessment modules to Firestore...`);
      memoryStore['assessments'] = [...mockAssessments];
      fsBatchSet('assessments', mockAssessments).catch(() => {});
    }

    if ((memoryStore['questions'] || []).length < defaultQuestionBank.length) {
      console.log(`[FirestoreSync] Seeding ${defaultQuestionBank.length} question bank items to Firestore...`);
      memoryStore['questions'] = [...defaultQuestionBank];
      fsBatchSet('questions', defaultQuestionBank).catch(() => {});
    }

    // 8. Auto-seed Talent Scores & Profiles for all 117 students
    if ((memoryStore['talent_scores'] || []).length < mockStudents.length) {
      const generatedScores = mockStudents.map(st => ({
        id: `score-${st.id}`,
        studentId: st.email.toLowerCase().trim(),
        overall: st.score,
        dimensions: [
          { key: 'technical', label: 'Technical & Green Energy', score: Math.min(100, st.score + 2), weight: 0.25, source: 'Induction Assessment', description: 'Penguasaan konsep powertrain EV dan Green Energy', color: '#10B981' },
          { key: 'safety', label: 'High Voltage Safety', score: Math.min(100, st.score + 4), weight: 0.25, source: 'Induction Assessment', description: 'Kepatuhan K3 & prosedur isolasi tegangan tinggi', color: '#0099B8' },
          { key: 'psychometric', label: 'Work Style & 5S', score: Math.max(70, st.score - 2), weight: 0.20, source: 'Induction Assessment', description: 'Ketelitian torsi dan etos kerja industri', color: '#8B5CF6' },
          { key: 'learningAgility', label: 'Learning Agility', score: Math.min(98, st.score + 1), weight: 0.15, source: 'Induction Assessment', description: 'Kecepatan adaptasi teknologi baru', color: '#F59E0B' },
          { key: 'communication', label: 'Communication & Teamwork', score: Math.max(68, st.score - 4), weight: 0.15, source: 'Induction Assessment', description: 'Kolaborasi dan pemecahan masalah tim', color: '#3B82F6' }
        ],
        calculatedAt: new Date().toISOString(),
        configVersion: 'v2.0'
      }));
      memoryStore['talent_scores'] = generatedScores;
      fsBatchSet('talent_scores', generatedScores).catch(() => {});
    }

    // 9. Auto-seed Profiles for all 117 students
    if ((memoryStore['profiles'] || []).length < mockStudents.length) {
      const generatedProfiles = mockStudents.map(st => ({
        id: `prof-${st.id}`,
        studentId: st.id,
        email: st.email,
        fullName: st.name,
        school: st.schoolName,
        major: st.major,
        graduationYear: st.graduationYear,
        province: st.province,
        city: st.city,
        nisn: st.nisn,
        phone: st.phone || '081234567890',
        bio: `Lulusan vokasi ${st.major} dari ${st.schoolName} dengan kompetensi teruji di perakitan EV dan standar K3 High Voltage.`,
        skills: st.skills || ['EV Battery Assembly', 'High Voltage Safety', 'Quality Control', 'BMS Diagnostics'],
        status: st.status || 'active'
      }));
      memoryStore['profiles'] = generatedProfiles;
      fsBatchSet('profiles', generatedProfiles).catch(() => {});
    }

    // 10. Auto-seed AI Psychological Reports in Firestore
    if ((memoryStore['ai_reports'] || []).length < 15) {
      const initialReports: any[] = mockStudents.slice(0, 15).map((st, idx) => ({
        id: `ai-rep-seed-${st.id}`,
        studentId: st.email.toLowerCase().trim(),
        studentName: st.name,
        nisn: st.nisn,
        schoolName: st.schoolName,
        major: st.major,
        score: st.score,
        generatedAt: new Date(Date.now() - idx * 3600000).toISOString(),
        modelUsed: 'OpenRouter (deepseek/deepseek-chat)',
        archetype: idx % 3 === 0 ? 'The High-Voltage Safety Champion' : idx % 3 === 1 ? 'The Precision EV Battery Specialist' : 'The Agile Powertrain Troubleshooter',
        summary: `Kandidat ${st.name} memiliki kecerdasan logika elektrikal yang solid dengan skor K3 ${88 + (idx % 8)}%. Memiliki etos kerja manufaktur teruji dan disiplin 5S tinggi.`,
        bigFiveTraits: {
          conscientiousness: { score: 92 - (idx % 6), analysis: 'Sangat disiplin SOP dan presisi kalibrasi torsi' },
          emotionalStability: { score: 89 - (idx % 5), analysis: 'Tenang dalam penanganan darurat thermal runaway' },
          extraversion: { score: 82 + (idx % 8), analysis: 'Komunikatif dalam serah terima shift (handover)' },
          agreeableness: { score: 88, analysis: 'Kooperatif dalam tim manufaktur baterai' },
          openness: { score: 94 - (idx % 7), analysis: 'Adaptif terhadap teknologi BMS dan converter baru' }
        },
        safetyMindsetIndex: 88 + (idx % 8),
        workplaceStrengths: [
          'Kepatuhan ketat terhadap SOP LOTO (Lockout/Tagout) dan isolasi tegangan tinggi.',
          'Pemahaman mendalam mengenai sirkuit baterai pack EV dan balancing cell.',
          'Disiplin 5S dan budaya pencegahan cacat perakitan (Poka-Yoke).'
        ],
        operationalRisks: [
          'Perlu supervisi berkala saat pertama kali menangani pack baterai di atas 800V DC.',
          'Pastikan terus memperbarui wawasan standar protokol DC Fast Charging.'
        ],
        developmentRecommendations: [
          'Ikuti sertifikasi BNSP Teknisi Otomotif Listrik Level 3.',
          'Pelajari protokol komunikasi telemetri IoT baterai.'
        ],
        recommendedEVRoles: [
          'EV Battery Assembly & QC Inspector',
          'High-Voltage Maintenance Specialist',
          'SPKLU Charging Infrastructure Tech',
          'Powertrain Retrofit Specialist'
        ]
      }));

      memoryStore['ai_reports'] = initialReports;
      fsBatchSet('ai_reports', initialReports).catch(() => {});
    }

    _initialized = true;
    console.log('[FirestoreSync] All collections successfully synchronized to Cloud Firestore.');
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
    const batchSize = 450;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = writeBatch(firestore);
      const chunk = items.slice(i, i + batchSize);
      chunk.forEach((item) => {
        const rawId = item.id || item.email || `doc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const docId = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '_');
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
  fsBatchSet(colName, items).catch(() => {});
}

/** Add a single item to collection (memory + Firestore). */
export function addItem(colName: string, item: any): void {
  if (!memoryStore[colName]) memoryStore[colName] = [];
  const rawId = item.id || item.email || `doc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const docId = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const storedItem = { ...item, _docId: docId };
  
  memoryStore[colName].unshift(storedItem);
  fsSet(colName, docId, item).catch(() => {});
}

/** Update an item in a collection by its id or _docId. */
export function updateItem(colName: string, id: string, updates: any): void {
  const items = memoryStore[colName] || [];
  const idx = items.findIndex((it) => it.id === id || it._docId === id || it.email === id);
  if (idx >= 0) {
    const updated = { ...items[idx], ...updates };
    items[idx] = updated;
    const docId = items[idx]._docId || items[idx].id || String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
    fsSet(colName, docId, updated).catch(() => {});
  }
}

/** Remove an item from a collection by id or _docId. */
export function removeItem(colName: string, id: string): void {
  const items = memoryStore[colName] || [];
  const target = items.find((it) => it.id === id || it._docId === id || it.email === id);
  const docId = target?._docId || target?.id || String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
  
  memoryStore[colName] = items.filter((it) => it.id !== id && it._docId !== id && it.email !== id);
  fsDelete(colName, docId).catch(() => {});
}

/** Remove items matching a predicate function. */
export function removeWhere(colName: string, predicate: (item: any) => boolean): void {
  const items = memoryStore[colName] || [];
  const toDelete = items.filter(predicate);
  memoryStore[colName] = items.filter((it) => !predicate(it));

  toDelete.forEach((it) => {
    const docId = it._docId || it.id || String(it.email || '').replace(/[^a-zA-Z0-9_-]/g, '_');
    if (docId) {
      fsDelete(colName, docId).catch(() => {});
    }
  });
}

/** Find one item matching a predicate. */
export function findOne(colName: string, predicate: (item: any) => boolean): any | null {
  return (memoryStore[colName] || []).find(predicate) || null;
}

/** Find all items matching a predicate. */
export function findMany(colName: string, predicate: (item: any) => boolean): any[] {
  return (memoryStore[colName] || []).filter(predicate);
}
