import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context/UserContext';

export default function ProfileSetupScreen() {
  const navigation = useNavigation();
  const { setProfile } = useUserContext();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('maintien');
  const [diet, setDiet] = useState('aucune');
  const [sex, setSex] = useState('homme');
  const [activityLevel, setActivityLevel] = useState('sedentaire');

  const handleSave = async () => {
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!name || !ageNum || !heightNum || !weightNum) {
      alert('Merci de remplir tous les champs correctement.');
      return;
    }

    let bmr =
      sex === 'homme'
        ? 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
        : 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;

    const activityMultipliers = {
      sedentaire: 1.2,
      leger: 1.375,
      modere: 1.55,
      actif: 1.725,
      intense: 1.9,
    };

    const calories = Math.round(bmr * activityMultipliers[activityLevel]);

    const finalCalories =
      goal === 'prise'
        ? calories + 300
        : goal === 'perte'
        ? calories - 300
        : calories;

    const profileData = {
      name,
      age: ageNum,
      height: heightNum,
      weight: weightNum,
      goal,
      diet,
      sex,
      activityLevel,
      besoinsCaloriques: finalCalories,
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      setProfile(profileData);
      alert('Profil enregistré avec succès !');
      navigation.navigate('Home');
    } catch (e) {
      console.error('Erreur de sauvegarde du profil :', e);
      alert('Erreur lors de l’enregistrement.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Création de Profil</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Ton prénom ou pseudo"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Âge</Text>
      <TextInput
        style={styles.input}
        placeholder="Ton âge"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>Taille (cm)</Text>
      <TextInput
        style={styles.input}
        placeholder="Taille en cm"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <Text style={styles.label}>Poids (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="Poids en kg"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>👤 Sexe</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={sex}
          onValueChange={(itemValue) => setSex(itemValue)}
        >
          <Picker.Item label="Homme" value="homme" />
          <Picker.Item label="Femme" value="femme" />
        </Picker>
      </View>

      <Text style={styles.label}>🏃 Niveau d’activité</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={activityLevel}
          onValueChange={(itemValue) => setActivityLevel(itemValue)}
        >
          <Picker.Item label="Sédentaire" value="sedentaire" />
          <Picker.Item label="Légèrement actif" value="leger" />
          <Picker.Item label="Modérément actif" value="modere" />
          <Picker.Item label="Très actif" value="actif" />
          <Picker.Item label="Extrêmement actif" value="intense" />
        </Picker>
      </View>

      <Text style={styles.label}>🎯 Objectif</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={goal}
          onValueChange={(itemValue) => setGoal(itemValue)}
        >
          <Picker.Item label="Maintien" value="maintien" />
          <Picker.Item label="Perte de poids" value="perte" />
          <Picker.Item label="Prise de masse" value="prise" />
        </Picker>
      </View>

      <Text style={styles.label}>🍽️ Type d’alimentation</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={diet}
          onValueChange={(itemValue) => setDiet(itemValue)}
        >
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
  container: {
    padding: 24,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
