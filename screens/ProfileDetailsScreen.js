import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

export default function ProfileDetailsScreen() {
  const { profile, setProfile } = useUserContext();
  const navigation = useNavigation();

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Aucun profil enregistré.</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userProfile");
      setProfile(null);
      navigation.replace("ProfileSetup");
    } catch (e) {
      Alert.alert("Erreur", "Impossible de se déconnecter.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Mon Profil</Text>

      <Text style={styles.text}>Nom : {profile.name}</Text>
      <Text style={styles.text}>Âge : {profile.age}</Text>
      <Text style={styles.text}>Sexe : {profile.gender}</Text>
      <Text style={styles.text}>Taille : {profile.height} cm</Text>
      <Text style={styles.text}>Poids actuel : {profile.weight} kg</Text>
      <Text style={styles.text}>Poids objectif : {profile.goalWeight} kg</Text>
      <Text style={styles.text}>Masse grasse : {profile.bodyFat || "—"}%</Text>
      <Text style={styles.text}>
        Masse musculaire : {profile.muscleMass || "—"}kg
      </Text>
      <Text style={styles.text}>
        Durée de l’objectif : {profile.goalDuration || "—"} semaines
      </Text>
      <Text style={styles.text}>Objectif : {profile.goal}</Text>
      <Text style={styles.text}>Activité : {profile.activityLevel}</Text>
      <Text style={styles.text}>Alimentation : {profile.diet}</Text>
      <Text style={styles.text}>
        Besoins caloriques : {profile.besoinsCaloriques} kcal
      </Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>🔓 Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0fdf4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
