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

// Set log level to silent to prevent "Could not reach Cloud Firestore backend" in console
setLogLevel('silent');

// Use initializeFirestore with force long polling to bypass proxy issues
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration. ');
    }
  }
}
testConnection();

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
  const actionCodeSettings = {
    // الرابط الذي سيعود إليه المستخدم بعد إعادة التعيين
    url: window.location.origin,
    handleCodeInApp: false,
  };
  return sendPasswordResetEmail(auth, email, actionCodeSettings);
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