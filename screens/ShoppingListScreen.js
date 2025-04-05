import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useProductContext } from '../context/ProductContext';

export default function ShoppingListScreen() {
  const { shoppingList, toggleCheck, addToShoppingList } = useProductContext();
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product: item })}>
      <View style={styles.itemContainer}>
        {item.image_front_small_url && (
          <Image source={{ uri: item.image_front_small_url }} style={styles.image} />
        )}
        <CheckBox
          checked={item.checked}
          onPress={() => toggleCheck(item.code)}
          checkedColor="#10b981"
          containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0 }}
        />
        <Text style={styles.itemText}>
          {item.product_name || 'Nom inconnu'} {item.quantity > 1 ? `×${item.quantity}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const openScanner = () => {
    navigation.navigate('Scan', {
      autoAddToShoppingList: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Liste de courses</Text>

      {shoppingList.length === 0 ? (
        <Text style={styles.empty}>Aucun produit pour le moment</Text>
      ) : (
        <FlatList
          data={shoppingList}
          keyExtractor={(item, index) => item.code + index}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity style={styles.floatingBtn} onPress={openScanner}>
        <Text style={styles.floatingBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
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
    gap: 12,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 60,
    borderRadius: 4,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 16,
    flexShrink: 1,
  },
  floatingBtn: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#3b82f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  floatingBtnText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});