import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // ✅ nouveau chemin
import { useNavigation } from '@react-navigation/native';

export default function ProfileSetupScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [goal, setGoal] = useState('maintien');
  const [diet, setDiet] = useState('aucune');

  const handleSave = () => {
    // Simule l'enregistrement pour le moment
    alert('Profil enregistré !');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Création de Profil</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Ton prénom ou pseudo"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Objectif</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={goal}
          onValueChange={setGoal}
        >
          <Picker.Item label="Maintien" value="maintien" />
          <Picker.Item label="Perte de poids" value="perte" />
          <Picker.Item label="Prise de masse" value="prise" />
        </Picker>
      </View>

      <Text style={styles.label}>Régime alimentaire</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={diet}
          onValueChange={setDiet}
        >
          <Picker.Item label="Aucun" value="aucune" />
          <Picker.Item label="Végétarien" value="vegetarien" />
          <Picker.Item label="Vegan" value="vegan" />
          <Picker.Item label="Sans gluten" value="gluten" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
