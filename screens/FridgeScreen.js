import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useProductContext } from '../context/ProductContext';

export default function FridgeScreen() {
  const { fridge, addToFridge, removeOneFromFridge } = useProductContext();

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.image_front_small_url && (
        <Image source={{ uri: item.image_front_small_url }} style={styles.image} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.product_name || 'Produit'}</Text>
        <Text style={styles.quantity}>Quantité : {item.quantity || 1}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => removeOneFromFridge(item.code)} style={styles.actionBtn}>
          <Text style={styles.actionText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addToFridge(item)} style={styles.actionBtn}>
          <Text style={styles.actionText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧊 Mon Frigo</Text>
      {fridge.length === 0 ? (
        <Text style={styles.empty}>Votre frigo est vide</Text>
      ) : (
        <FlatList
          data={fridge}
          keyExtractor={(item, index) => item.code + index}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0fdf4',
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
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantity: {
    marginTop: 4,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    backgroundColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});