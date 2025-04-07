import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserContext } from '../context/UserContext';

export default function ProfileDetailsScreen() {
  const { profile } = useUserContext();

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
      <Text style={styles.text}>Taille : {profile.height} cm</Text>
      <Text style={styles.text}>Poids : {profile.weight} kg</Text>
      <Text style={styles.text}>Objectif : {profile.goal}</Text>
      <Text style={styles.text}>Besoins caloriques : {profile.besoinsCaloriques} kcal</Text>
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
});
