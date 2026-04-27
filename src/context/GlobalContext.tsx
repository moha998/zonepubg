import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '../firebase';
import { collection, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface GlobalContextType {
  user: User | null;
  userProfile: any | null;
  isAdmin: boolean;
  competitionSettings: any[];
  showNotification: (msg: string, type: 'success' | 'error') => void;
  notification: { message: string; type: 'success' | 'error' } | null;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [competitionSettings, setCompetitionSettings] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
            setIsAdmin(userDoc.data().role === "admin");
          } else {
            setUserProfile(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Auth fetch error:", error);
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
    });

    const unsubscribeComp = onSnapshot(collection(db, "competitionSettings"), (snapshot) => {
      setCompetitionSettings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeComp();
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ user, userProfile, isAdmin, competitionSettings, showNotification, notification }}>
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
