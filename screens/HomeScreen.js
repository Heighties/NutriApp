import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    };
    checkProfile();
  }, []);

  const handleProfilePress = () => {
    if (profile) {
      navigation.navigate('ProfileDetails');
    } else {
      navigation.navigate('ProfileSetup');
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton profil */}
      <View style={styles.topRightButton}>
        <TouchableOpacity onPress={handleProfilePress}>
          <Ionicons name="person-circle-outline" size={36} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Titre */}
      <Text style={styles.title}>Bienvenue sur NutriApp 🍽️</Text>

      {/* Bloc résumé calorique */}
      <View style={styles.summaryBox}>
        {profile ? (
          <>
            <Text style={styles.summaryTitle}>Suivi nutritionnel</Text>
            <Text style={styles.summaryText}>
              🔥 Besoins journaliers : {profile.besoinsCaloriques || 0} kcal
            </Text>
            <Text style={styles.summaryText}>🍗 Consommés : 0 kcal</Text>
            <Text style={styles.summaryText}>
              🧮 Restants : {profile.besoinsCaloriques || 0} kcal
            </Text>
          </>
        ) : (
          <Text style={styles.summaryText}>
            Créez votre profil pour suivre vos apports
          </Text>
        )}
      </View>

      {/* Boutons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Fridge')}>
        <Text style={styles.buttonText}>🧊 Mon Frigo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShoppingList')}>
        <Text style={styles.buttonText}>🛒 Ma Liste de Courses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Recipes')}>
        <Text style={styles.buttonText}>🍽️ Voir les Recettes</Text>
      </TouchableOpacity>

      {/* Bouton flottant de scan */}
      <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate('Scan')}>
        <Ionicons name="barcode-outline" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  topRightButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  summaryBox: {
    backgroundColor: '#e0f2fe',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '85%',
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scanButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
});
