import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocFromServer,
  serverTimestamp,
  increment,
  setLogLevel,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('TODO')) {
  console.error('Firebase API Key is missing or invalid in firebase-applet-config.json');
}

const app = initializeApp(firebaseConfig);

// Set log level to debug to help catch connection issues if they persist
setLogLevel('debug');

// Use initializeFirestore with auto long polling to bypass proxy issues when needed
const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
console.log(`Initializing Firestore with database ID: ${dbId}`);

// Initialize Firestore with the specific database ID from configuration
export const db = getFirestore(app, dbId);

// Add a connection checker helper
export const checkFirestoreConnection = async () => {
  try {
    const testDoc = doc(db, '_connection_test_', 'ping');
    await getDocFromServer(testDoc);
    console.log('Firestore connection verified');
    return true;
  } catch (error: any) {
    console.error('Firestore connection test failed:', error);
    if (error?.code === 'unavailable') {
      console.warn('Firestore is currently unavailable (offline mode)');
    }
    return false;
  }
};

export const auth = getAuth(app);
auth.languageCode = 'ar'; // ضبط اللغة للعربية لضمان عمل روابط الاستعادة بشكل صحيح
export const googleProvider = new GoogleAuthProvider();

// إضافة scope للحصول على الاسم والصورة
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Error Handling Types
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | null | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  // Ensure we only extract the message to avoid circular structure errors
  const safeError = error instanceof Error ? error.message : String(error);
  
  // Clone values to ensure no hidden getter logic or proxy issues
  const currentUid = auth.currentUser?.uid || null;
  const currentEmail = auth.currentUser?.email || null;
  const currentEmailVerified = auth.currentUser?.emailVerified || false;
  const currentIsAnonymous = auth.currentUser?.isAnonymous || false;

  const errInfo = {
    error: safeError,
    op: operationType,
    path: path,
    uid: currentUid,
    email: currentEmail,
    verified: currentEmailVerified,
    isAnon: currentIsAnonymous
  };

  try {
    const errString = JSON.stringify(errInfo);
    console.error('Firestore Error Summary:', errString);
    throw new Error(errString);
  } catch (jsonErr) {
    const minErr = `{"e": ${JSON.stringify(safeError)}, "o": "${operationType}"}`;
    console.error('CRITICAL: Failed to serialize error details:', safeError);
    throw new Error(minErr);
  }
}

// Connection Test removed as it was causing confusing logs during cold starts.
// Connectivity is handled via real-time listeners and UI feedback in App.tsx.

// تسجيل الدخول عبر Popup فقط — لا يحتاج إضافة الدومين في Firebase Authorized Domains
export const loginWithGoogle = () => {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
  return signInWithPopup(auth, googleProvider);
};

export const loginWithEmail = (email: string, pass: string) =>
  signInWithEmailAndPassword(auth, email, pass);

export const registerWithEmail = (email: string, pass: string) =>
  createUserWithEmailAndPassword(auth, email, pass);

// دالة فارغة للتوافق مع الكود القديم — لا تفعل شيئاً لأننا لا نستخدم Redirect
export const handleGoogleRedirectResult = () => Promise.resolve(null);

export const logout = () => signOut(auth);

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  onAuthStateChanged,
  serverTimestamp,
  increment,
};
export type { User };