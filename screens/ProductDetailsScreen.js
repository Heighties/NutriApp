import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ProductDetailsScreen() {
  const route = useRoute();
  const { product } = route.params;
  const [alternatives, setAlternatives] = useState([]);

  const fetchAlternatives = async (productName) => {
    try {
      const searchTerm = encodeURIComponent(productName);
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&search_simple=1&action=process&json=1`
      );

      const text = await res.text();
      try {
        const json = JSON.parse(text);
        return json.products || [];
      } catch (jsonError) {
        console.error('Erreur de parsing JSON :', jsonError);
        console.log('Réponse brute :', text);
        return [];
      }
    } catch (error) {
      console.error('Erreur récupération alternatives :', error);
      return [];
    }
  };

  useEffect(() => {
    const loadAlternatives = async () => {
      const results = await fetchAlternatives(product.product_name);
      setAlternatives(results);
    };

    loadAlternatives();
  }, [product]);

  const nutriments = product.nutriments || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: product.image_front_small_url }}
        style={styles.image}
      />
      <Text style={styles.name}>{product.product_name}</Text>
      <Text style={styles.brand}>{product.brands}</Text>

      <View style={styles.nutrition}>
        <Text>🔋 {nutriments['energy-kcal'] || '–'} kcal</Text>
        <Text>💪 {nutriments.proteins || '–'} g protéines</Text>
        <Text>🍞 {nutriments.carbohydrates || '–'} g glucides</Text>
        <Text>🧈 {nutriments.fat || '–'} g lipides</Text>
      </View>

      {alternatives.length > 0 && (
        <View style={styles.altContainer}>
          <Text style={styles.altTitle}>🔄 Alternatives plus saines :</Text>
          {alternatives.slice(0, 5).map((alt) => (
            <View key={alt.code} style={styles.altItem}>
              {alt.image_front_thumb_url && (
                <Image
                  source={{ uri: alt.image_front_thumb_url }}
                  style={styles.altImage}
                />
              )}
              <Text style={styles.altText}>{alt.product_name || 'Sans nom'}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  brand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  nutrition: {
    gap: 4,
    marginBottom: 20,
  },
  altContainer: {
    marginTop: 20,
    width: '100%',
  },
  altTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  altItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 8,
  },
  altImage: {
    width: 40,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  altText: {
    flexShrink: 1,
  },
});