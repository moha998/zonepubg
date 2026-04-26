import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export function useWeapons() {
  const [weapons, setWeapons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const q = query(collection(db, "weapons"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWeapons(data);
      } catch (error) {
        console.error("Error fetching weapons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeapons();
  }, []);

  return { weapons, loading };
}
