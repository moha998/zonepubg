import { useState, useEffect } from "react";
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, orderBy, where } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { Device, SensitivityRating } from "../types";
import { DEVICES, PRO_PLAYERS } from "../constants";

export function useSensitivity() {
  const [dbDevices, setDbDevices] = useState<Device[]>([]);
  const [dbPlayers, setDbPlayers] = useState<Device[]>([]); // Assuming `Device` is also used for ProPlayer in original code
  const [sensitivityRatings, setSensitivityRatings] = useState<SensitivityRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubDevices = onSnapshot(
      collection(db, "devices"),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Device[];
        setDbDevices(data);
        setLoading(false);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "devices")
    );

    const unsubPlayers = onSnapshot(
      collection(db, "players"),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Device[]; // Use appropriate type if different
        setDbPlayers(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "players")
    );

    const unsubRatings = onSnapshot(
      collection(db, "sensitivityRatings"),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as SensitivityRating[];
        setSensitivityRatings(data);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "sensitivityRatings")
    );

    return () => {
      unsubDevices();
      unsubPlayers();
      unsubRatings();
    };
  }, []);

  const currentDevices = [...DEVICES.filter(d => !dbDevices.find(dbd => dbd.id === d.id)), ...dbDevices];
  const currentPlayers = [...PRO_PLAYERS.filter(p => !dbPlayers.find(dbp => dbp.id === p.id)), ...dbPlayers.filter((p: any) => p.brand === 'Pro Player')];

  const addDevice = async (device: Omit<Device, "id">) => {
    await addDoc(collection(db, "devices"), device);
  };

  const updateDevice = async (id: string, data: Partial<Device>) => {
    await updateDoc(doc(db, "devices", id), data);
  };

  const deleteDevice = async (id: string) => {
    await deleteDoc(doc(db, "devices", id));
  };

  const addPlayer = async (player: Omit<Device, "id">) => { // Replace Device with appropriate type
    await addDoc(collection(db, "players"), player);
  };

  const updatePlayer = async (id: string, data: Partial<Device>) => {
    await updateDoc(doc(db, "players", id), data);
  };

  const deletePlayer = async (id: string) => {
    await deleteDoc(doc(db, "players", id));
  };

  return {
    dbDevices,
    dbPlayers,
    currentDevices,
    currentPlayers,
    sensitivityRatings,
    loading,
    addDevice,
    updateDevice,
    deleteDevice,
    addPlayer,
    updatePlayer,
    deletePlayer
  };
}
