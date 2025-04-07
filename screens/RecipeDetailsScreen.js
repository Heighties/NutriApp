// RecipeDetailsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useProductContext } from '../context/ProductContext';

export default function RecipeDetailsScreen() {
  const route = useRoute();
  const { recipe } = route.params || {};
  const { fridge, shoppingList, addToShoppingList } = useProductContext();

  const [missingIngredients, setMissingIngredients] = useState([]);

  useEffect(() => {
    if (!recipe || !recipe.extendedIngredients) return;

    const fridgeNames = fridge.map(p =>
      p.product_name?.toLowerCase().trim()
    );

    const missing = recipe.extendedIngredients.filter(ingredient => {
      const name = ingredient.name?.toLowerCase().trim();
      return name && !fridgeNames.includes(name);
    });

    setMissingIngredients(missing);
  }, [recipe, fridge]);

  const isInShoppingList = (ingredientName) =>
    shoppingList.some(p =>
      p.product_name?.toLowerCase().includes(ingredientName.toLowerCase())
    );

  const handleAddMissing = (ingredient) => {
    const formatted = {
      code: ingredient.id?.toString(),
      product_name: ingredient.name,
      brands: '',
      image_front_small_url: ingredient.image || '',
      nutriments: {},
    };
    addToShoppingList(formatted);
  };

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>❌ Aucune recette à afficher.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={styles.title}>{recipe.title}</Text>

      <Text style={styles.sectionTitle}>📝 Ingrédients :</Text>
      {recipe.extendedIngredients?.length > 0 ? (
        recipe.extendedIngredients.map((ing, index) => {
          const missing = missingIngredients.find(i => i.id === ing.id);
          const isAdded = isInShoppingList(ing.name);
          const color = missing ? (isAdded ? '#facc15' : '#ef4444') : '#22c55e';

          return (
            <View key={index} style={styles.ingredientRow}>
              <Text style={[styles.ingredientText, { color }]}>
                • {ing.original}
              </Text>

              {missing && !isAdded && (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => handleAddMissing(ing)}
                >
                  <Text style={styles.addBtnText}>+ Ajouter</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyText}>Aucune information sur les ingrédients.</Text>
      )}

      <Text style={styles.sectionTitle}>👨‍🍳 Instructions :</Text>
      {recipe.analyzedInstructions?.[0]?.steps?.length > 0 ? (
        recipe.analyzedInstructions[0].steps.map((step, i) => (
          <Text key={i} style={styles.stepText}>👉 {step.step}</Text>
        ))
      ) : (
        <Text style={styles.emptyText}>Aucune instruction disponible.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
  },
  stepText: {
    marginBottom: 10,
    fontSize: 15,
  },
  addBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 10,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
