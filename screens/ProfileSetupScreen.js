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
import { useUserContext } from '../context/UserContext'; // ✅ Import du contexte utilisateur

export default function ProfileSetupScreen() {
  const navigation = useNavigation();
  const { setProfile } = useUserContext(); // ✅ On récupère la fonction de mise à jour

  const [name, setName] = useState('');
  const [goal, setGoal] = useState('maintien');
  const [diet, setDiet] = useState('aucune');

  const handleSave = async () => {
    const profileData = {
      name,
      goal,
      diet,
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      setProfile(profileData); // ✅ Mise à jour du contexte
      alert('Profil enregistré avec succès !');
      navigation.goBack(); // ou navigation.navigate('Home') si tu préfères
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
