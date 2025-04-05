import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ProductDetailsScreen() {
  const route = useRoute();
  const product = route.params?.product;

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Produit non disponible.</Text>
      </View>
    );
  }

  const nutriments = product.nutriments || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {product.image_front_small_url && (
        <Image
          source={{ uri: product.image_front_small_url }}
          style={styles.image}
        />
      )}
      <Text style={styles.title}>{product.product_name || 'Nom inconnu'}</Text>
      <Text style={styles.brand}>Marque : {product.brands || 'N/A'}</Text>

      <View style={styles.nutrition}>
        <Text>🔋 {nutriments['energy-kcal'] || '–'} kcal</Text>
        <Text>💪 {nutriments.proteins || '–'} g protéines</Text>
        <Text>🍞 {nutriments.carbohydrates || '–'} g glucides</Text>
        <Text>🧈 {nutriments.fat || '–'} g lipides</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  brand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  nutrition: {
    width: '100%',
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 10,
    gap: 8,
  },
});