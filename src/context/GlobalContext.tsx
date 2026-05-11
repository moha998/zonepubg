import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '../firebase';
import { collection, doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

interface GlobalContextType {
  user: User | null;
  userProfile: any | null;
  setUserProfile: (profile: any) => void;
  isAdmin: boolean;
  isAuthReady: boolean;
  isDataLoading: boolean;
  competitionSettings: any[];
  showNotification: (msg: string, type: 'success' | 'error') => void;
  notification: { message: string; type: 'success' | 'error' } | null;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [competitionSettings, setCompetitionSettings] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      // Clean up previous profile listener if any
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        
        try {
          // Initial fetch to check existence and status
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile(data);
            setIsAdmin(data.role === "admin" || currentUser.email === "eng.moha990@gmail.com");

            // Ban check logic
            if (data.isBanned || data.status === 'suspended') {
              setUserProfile(null);
              setUser(null);
              setIsAdmin(false);
              showNotification("عذراً، تم حظر حسابك من قبل الإدارة.", "error");
              signOut(auth);
              return;
            }
          } else {
            // Create profile if doesn't exist
            const newProfile = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "لاعب ببجي",
              role: currentUser.email === "eng.moha990@gmail.com" ? "admin" : "user",
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              settings: {
                camera: { noScope: 120, redDot: 60, scope2x: 36, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
                ads: { noScope: 120, redDot: 60, scope2x: 36, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
                gyroscope: { noScope: 300, redDot: 300, scope2x: 280, scope3x: 220, scope4x: 200, scope6x: 160, scope8x: 120 },
              },
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
            setIsAdmin(newProfile.role === "admin");
          }

          // Setup real-time listener for ongoing updates
          unsubscribeProfile = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setUserProfile(data);
              setIsAdmin(data.role === "admin" || currentUser.email === "eng.moha990@gmail.com");
            }
          });
        } catch (error) {
          console.error("Profile sync error in GlobalContext:", error);
          // Fallback to basic info
          setUserProfile({ uid: currentUser.uid, email: currentUser.email, role: 'user' });
          setIsAdmin(currentUser.email === "eng.moha990@gmail.com");
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
    });

    const unsubscribeComp = onSnapshot(collection(db, "competitionSettings"), (snapshot) => {
      setCompetitionSettings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsDataLoading(false);
    }, () => {
      setIsDataLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribeComp();
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ 
      user, 
      userProfile, 
      setUserProfile,
      isAdmin, 
      isAuthReady,
      isDataLoading,
      competitionSettings, 
      showNotification, 
      notification 
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}
