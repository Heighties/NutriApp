import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // <- à ajouter

export default function HomeScreen() {
  const navigation = useNavigation(); // <- à ajouter

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur NutriApp 🍽️</Text>

      <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate('Scan')}>
        <Ionicons name="barcode-outline" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
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
  },
});
