/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { StudentProfile, ActivityRecord, GradeClass } from '../types';

// 1. Initialize Firebase App & Firestore Database instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// 2. Structured Firestore Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', errInfo);
}

// 3. Initial connection probe
async function probeConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is currently offline or unreachable.');
    }
  }
}
probeConnection().catch(() => {});

// 4. Stable Canonical Student ID generator (ngăn ngừa hồ sơ trùng lặp giữa các thiết bị)
export function generateCanonicalStudentId(fullName: string, className: string): string {
  const cleanClass = className.trim().replace('/', '_');
  // Normalize Vietnamese diacritics to clean alphanumeric slug
  const normalizedName = fullName
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  return `std_${cleanClass}_${normalizedName || 'hoc_sinh'}`;
}

// 5. Offline Queue Management for unreliable internet
const OFFLINE_QUEUE_KEY = 'math_adventure_offline_sync_queue_v1';

interface QueuedItem {
  id: string;
  type: 'student' | 'activity';
  data: any;
  timestamp: number;
}

function getOfflineQueue(): QueuedItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOfflineQueue(queue: QueuedItem[]) {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore
  }
}

export type SyncStatus = 'synced' | 'syncing' | 'offline';
let currentSyncStatus: SyncStatus = 'synced';
const syncListeners = new Set<(status: SyncStatus) => void>();

export function getSyncStatus(): SyncStatus {
  return currentSyncStatus;
}

export function onSyncStatusChange(cb: (status: SyncStatus) => void): () => void {
  syncListeners.add(cb);
  cb(currentSyncStatus);
  return () => {
    syncListeners.delete(cb);
  };
}

function setSyncStatus(status: SyncStatus) {
  currentSyncStatus = status;
  syncListeners.forEach((cb) => {
    try {
      cb(status);
    } catch {
      // ignore
    }
  });
}

// Auto-flush queue when back online
async function flushOfflineQueue() {
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    setSyncStatus('synced');
    return;
  }

  setSyncStatus('syncing');
  const remaining: QueuedItem[] = [];

  for (const item of queue) {
    try {
      if (item.type === 'student') {
        await setDoc(doc(db, 'students', item.data.id), item.data, { merge: true });
      } else if (item.type === 'activity') {
        await setDoc(doc(db, 'activities', item.data.id), item.data, { merge: true });
      }
    } catch (err) {
      remaining.push(item);
    }
  }

  saveOfflineQueue(remaining);
  setSyncStatus(remaining.length === 0 ? 'synced' : 'offline');
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushOfflineQueue().catch(() => {});
  });
}

// 6. Core Online Sync APIs
export const FirebaseSyncService = {
  /**
   * Sync student login profile online.
   * Merges data if student has already logged in previously to preserve stars & badges.
   */
  async syncStudentLogin(student: StudentProfile): Promise<StudentProfile> {
    setSyncStatus('syncing');
    const studentDocRef = doc(db, 'students', student.id);

    try {
      const snap = await getDoc(studentDocRef);
      let mergedStudent = { ...student };

      if (snap.exists()) {
        const cloudData = snap.data() as Partial<StudentProfile>;
        // Merge cloud stars & badges so work on other devices is retained
        mergedStudent.totalStars = Math.max(student.totalStars, cloudData.totalStars || 0);
        mergedStudent.badges = Array.from(new Set([...(student.badges || []), ...(cloudData.badges || [])]));
        mergedStudent.collectedCarrots = Math.max(student.collectedCarrots || 0, cloudData.collectedCarrots || 0);
        mergedStudent.collectedCups = Math.max(student.collectedCups || 0, cloudData.collectedCups || 0);
        mergedStudent.collectedFish = Math.max(student.collectedFish || 0, cloudData.collectedFish || 0);
        mergedStudent.collectedChests = Math.max(student.collectedChests || 0, cloudData.collectedChests || 0);
        mergedStudent.createdAt = cloudData.createdAt || student.createdAt;
      }

      mergedStudent.lastLoginAt = new Date().toISOString();

      await setDoc(studentDocRef, mergedStudent, { merge: true });
      setSyncStatus('synced');
      return mergedStudent;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${student.id}`);
      // Fallback: Queue for offline sync
      const queue = getOfflineQueue();
      queue.push({
        id: student.id,
        type: 'student',
        data: student,
        timestamp: Date.now(),
      });
      saveOfflineQueue(queue);
      setSyncStatus('offline');
      return student;
    }
  },

  /**
   * Sync an activity or exam record online.
   */
  async syncActivityRecord(record: ActivityRecord, student: StudentProfile): Promise<void> {
    setSyncStatus('syncing');
    const recordDocRef = doc(db, 'activities', record.id);

    const payload = {
      id: record.id,
      studentId: record.studentId,
      fullName: student.fullName,
      className: student.className,
      type: record.type,
      targetId: String(record.targetId),
      targetName: record.targetName || '',
      score: record.score,
      totalQuestions: record.totalQuestions || 15,
      starsEarned: record.starsEarned || 0,
      timeSpentSeconds: record.timeSpentSeconds || 0,
      completedAt: record.completedAt || new Date().toISOString(),
      status: 'completed',
    };

    try {
      await setDoc(recordDocRef, payload, { merge: true });

      // Also update student total stars online
      const studentDocRef = doc(db, 'students', student.id);
      await setDoc(
        studentDocRef,
        {
          totalStars: student.totalStars,
          badges: student.badges,
          lastLoginAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setSyncStatus('synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `activities/${record.id}`);
      const queue = getOfflineQueue();
      queue.push({
        id: record.id,
        type: 'activity',
        data: payload,
        timestamp: Date.now(),
      });
      saveOfflineQueue(queue);
      setSyncStatus('offline');
    }
  },

  /**
   * Listen in real-time to all students of a specific class (e.g. '1/5')
   */
  subscribeClassStudents(
    className: string,
    onData: (students: StudentProfile[]) => void,
    onError?: (err: any) => void
  ): () => void {
    const colRef = collection(db, 'students');
    const q = className === 'all' ? colRef : query(colRef, where('className', '==', className));

    return onSnapshot(
      q,
      (snapshot) => {
        const students: StudentProfile[] = [];
        snapshot.forEach((d) => {
          students.push(d.data() as StudentProfile);
        });
        // Sort by full name
        students.sort((a, b) => a.fullName.localeCompare(b.fullName, 'vi'));
        onData(students);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'students');
        if (onError) onError(error);
      }
    );
  },

  /**
   * Listen in real-time to all learning & exam activities of a specific class
   */
  subscribeClassActivities(
    className: string,
    onData: (activities: ActivityRecord[]) => void,
    onError?: (err: any) => void
  ): () => void {
    const colRef = collection(db, 'activities');
    const q = className === 'all' ? colRef : query(colRef, where('className', '==', className));

    return onSnapshot(
      q,
      (snapshot) => {
        const activities: ActivityRecord[] = [];
        snapshot.forEach((d) => {
          activities.push(d.data() as ActivityRecord);
        });
        // Sort descending by completion time
        activities.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
        onData(activities);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'activities');
        if (onError) onError(error);
      }
    );
  },

  /**
   * Fetch all registered students count across all 26 classes
   */
  subscribeOverviewStats(
    onData: (stats: { totalStudents: number; totalActivities: number; classCounts: Record<string, number> }) => void
  ): () => void {
    const studentsCol = collection(db, 'students');
    const activitiesCol = collection(db, 'activities');

    let students: StudentProfile[] = [];
    let activities: ActivityRecord[] = [];

    const notify = () => {
      const classCounts: Record<string, number> = {};
      students.forEach((s) => {
        if (s.className) {
          classCounts[s.className] = (classCounts[s.className] || 0) + 1;
        }
      });
      onData({
        totalStudents: students.length,
        totalActivities: activities.length,
        classCounts,
      });
    };

    const unsubStudents = onSnapshot(
      studentsCol,
      (snap) => {
        students = snap.docs.map((d) => d.data() as StudentProfile);
        notify();
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'students')
    );

    const unsubActivities = onSnapshot(
      activitiesCol,
      (snap) => {
        activities = snap.docs.map((d) => d.data() as ActivityRecord);
        notify();
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'activities')
    );

    return () => {
      unsubStudents();
      unsubActivities();
    };
  },
};
