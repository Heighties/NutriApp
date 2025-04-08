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

  const calculateCalories = () => {
    // Formule de base : Mifflin-St Jeor (sans distinction homme/femme pour l'exemple)
    let base = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age);
    let adjusted = base;

    if (goal === 'perte') adjusted -= 300;
    else if (goal === 'prise') adjusted += 300;

    return Math.round(adjusted);
  };

  const handleSave = async () => {
    if (!name || !age || !height || !weight) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    const besoinsCaloriques = calculateCalories();

    const profileData = {
      name,
      age: parseInt(age),
      height: parseInt(height),
      weight: parseInt(weight),
      goal,
      diet,
      besoinsCaloriques,
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
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Prénom ou pseudo" />

      <Text style={styles.label}>Âge</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

      <Text style={styles.label}>Taille (cm)</Text>
      <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" />

      <Text style={styles.label}>Poids (kg)</Text>
      <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />

      <Text style={styles.label}>🎯 Objectif</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={goal} onValueChange={(val) => setGoal(val)}>
          <Picker.Item label="Maintien" value="maintien" />
          <Picker.Item label="Perte de poids" value="perte" />
          <Picker.Item label="Prise de masse" value="prise" />
        </Picker>
      </View>

      <Text style={styles.label}>🍽️ Type d’alimentation</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={diet} onValueChange={(val) => setDiet(val)}>
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
