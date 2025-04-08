import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ProfileDetailsScreen() {
  const { profile, setProfile } = useUserContext();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setProfile(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Aucun profil enregistré.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Mon Profil</Text>
      <Text style={styles.text}>Nom : {profile.name}</Text>
      <Text style={styles.text}>Âge : {profile.age}</Text>
      <Text style={styles.text}>Sexe : {profile.sex}</Text>
      <Text style={styles.text}>Taille : {profile.height} cm</Text>
      <Text style={styles.text}>Poids : {profile.weight} kg</Text>
      <Text style={styles.text}>Activité : {profile.activityLevel}</Text>
      <Text style={styles.text}>Objectif : {profile.goal}</Text>
      <Text style={styles.text}>Alimentation : {profile.diet}</Text>
      <Text style={styles.text}>
        Besoins caloriques : {profile.besoinsCaloriques} kcal
      </Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0fdf4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
