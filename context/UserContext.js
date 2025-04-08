// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);

  // 🔁 Charger automatiquement le profil au démarrage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem('userProfile');
        if (stored) {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
        }
      } catch (e) {
        console.error('Erreur chargement profil :', e);
      }
    };

    loadProfile();
  }, []);

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
