import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useProductContext } from '../context/ProductContext';

export default function FridgeScreen() {
  const { fridge } = useProductContext();

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
            <View style={styles.item}>
              <Text style={styles.name}>{item.product_name || 'Nom inconnu'}</Text>
              <Text style={styles.brand}>{item.brands || 'Marque inconnue'}</Text>
            </View>
          )}
        />
      )}
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
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  brand: {
    color: '#666',
  },
});