import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../context/UserContext';

export default function ProfileDetailsScreen() {
  const navigation = useNavigation();
  const { profile, setProfile } = useUserContext();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setProfile(null);
      alert('Déconnecté avec succès');
      navigation.navigate('Home');
    } catch (e) {
      console.error('Erreur lors de la déconnexion :', e);
      alert('Impossible de se déconnecter');
    }
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Aucun profil trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nom :</Text>
        <Text style={styles.value}>{profile.name}</Text>

        <Text style={styles.label}>Objectif :</Text>
        <Text style={styles.value}>{profile.goal}</Text>

        <Text style={styles.label}>Alimentation :</Text>
        <Text style={styles.value}>{profile.diet}</Text>

        {profile.besoinsCaloriques && (
          <>
            <Text style={styles.label}>Besoins caloriques :</Text>
            <Text style={styles.value}>{profile.besoinsCaloriques} kcal</Text>
          </>
        )}
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>🚪 Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#111',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
