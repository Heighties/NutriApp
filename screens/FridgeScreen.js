import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProductContext } from '../context/ProductContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FridgeScreen() {
  const navigation = useNavigation();
  const { fridge, setFridge } = useProductContext();

  const removeFromFridge = (code) => {
    setFridge((prev) => prev.filter((item) => item.code !== code));
  };

  const renderRightActions = (code) => (
    <RectButton style={styles.deleteButton} onPress={() => removeFromFridge(code)}>
      <Text style={styles.deleteText}>Supprimer</Text>
    </RectButton>
  );

  const goToScanAndAddToFridge = () => {
    navigation.navigate('Scan', { autoAddToFridge: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧊 Mon Frigo</Text>
      {fridge.length === 0 ? (
        <Text style={styles.empty}>Aucun produit dans le frigo.</Text>
      ) : (
        <FlatList
          data={fridge}
          keyExtractor={(item, index) => item.code + index}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.code)}>
              <View style={styles.item}>
                {item.image_front_small_url && (
                  <Image source={{ uri: item.image_front_small_url }} style={styles.image} />
                )}
                <View>
                  <Text style={styles.name}>{item.product_name || 'Nom inconnu'}</Text>
                  <Text style={styles.brand}>{item.brands || 'Marque inconnue'}</Text>
                </View>
              </View>
            </Swipeable>
          )}
        />
      )}

      <TouchableOpacity style={styles.scanButton} onPress={goToScanAndAddToFridge}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 60,
    borderRadius: 4,
    resizeMode: 'contain',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  brand: {
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scanButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#3b82f6',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
