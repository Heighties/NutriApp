import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "../context/UserContext";

export default function ProfileSetupScreen() {
  const navigation = useNavigation();
  const { setProfile } = useUserContext();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [goalDuration, setGoalDuration] = useState("");
  const [gender, setGender] = useState("homme");
  const [activityLevel, setActivityLevel] = useState("modere");
  const [goal, setGoal] = useState("maintien");
  const [diet, setDiet] = useState("aucune");

  const calculateCalories = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);

    let bmr = 0;

    if (gender === "homme") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const activityMultipliers = {
      faible: 1.2,
      modere: 1.55,
      eleve: 1.9,
    };

    let calories = bmr * activityMultipliers[activityLevel];

    if (goal === "perte") calories -= 300;
    if (goal === "prise") calories += 300;

    return Math.round(calories);
  };

  const handleSave = async () => {
    const besoinsCaloriques = calculateCalories();

    const profileData = {
      name,
      age,
      height,
      weight,
      goalWeight,
      bodyFat,
      muscleMass,
      goalDuration,
      gender,
      activityLevel,
      goal,
      diet,
      besoinsCaloriques,
    };

    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profileData));
      setProfile(profileData);
      alert("Profil enregistré !");
      navigation.navigate("Home");
    } catch (e) {
      console.error("Erreur de sauvegarde :", e);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Création de Profil</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ton prénom"
      />

      <Text style={styles.label}>Âge</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Taille (cm)</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Poids actuel (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Poids objectif (kg)</Text>
      <TextInput
        style={styles.input}
        value={goalWeight}
        onChangeText={setGoalWeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Masse grasse (%)</Text>
      <TextInput
        style={styles.input}
        value={bodyFat}
        onChangeText={setBodyFat}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Masse musculaire (kg)</Text>
      <TextInput
        style={styles.input}
        value={muscleMass}
        onChangeText={setMuscleMass}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Durée de l’objectif (en semaines)</Text>
      <TextInput
        style={styles.input}
        value={goalDuration}
        onChangeText={setGoalDuration}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Sexe</Text>
      <View style={styles.picker}>
        <Picker selectedValue={gender} onValueChange={setGender}>
          <Picker.Item label="Homme" value="homme" />
          <Picker.Item label="Femme" value="femme" />
        </Picker>
      </View>

      <Text style={styles.label}>Niveau d'activité</Text>
      <View style={styles.picker}>
        <Picker selectedValue={activityLevel} onValueChange={setActivityLevel}>
          <Picker.Item label="Faible (peu d’activité)" value="faible" />
          <Picker.Item label="Modéré (3-5x / semaine)" value="modere" />
          <Picker.Item label="Élevé (6x+ / semaine)" value="eleve" />
        </Picker>
      </View>

      <Text style={styles.label}>Objectif</Text>
      <View style={styles.picker}>
        <Picker selectedValue={goal} onValueChange={setGoal}>
          <Picker.Item label="Maintien" value="maintien" />
          <Picker.Item label="Perte de poids" value="perte" />
          <Picker.Item label="Prise de masse" value="prise" />
        </Picker>
      </View>

      <Text style={styles.label}>Type d’alimentation</Text>
      <View style={styles.picker}>
        <Picker selectedValue={diet} onValueChange={setDiet}>
          <Picker.Item label="Aucune" value="aucune" />
          <Picker.Item label="Végétarien" value="vegetarien" />
          <Picker.Item label="Vegan" value="vegan" />
          <Picker.Item label="Sans gluten" value="sans_gluten" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#f9fafb", flexGrow: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  label: { fontWeight: "600", marginBottom: 8, marginTop: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
