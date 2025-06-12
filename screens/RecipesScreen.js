// RecipesScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProductContext } from '../context/ProductContext';

const SPOONACULAR_API_KEY = 'd5a49de52d014f16b20c3020be5a5b7d';

export default function RecipesScreen() {
  const { fridge } = useProductContext();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const ingredients = fridge.map(p => p.product_name).filter(Boolean).join(',');
        const res = await fetch(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&ranking=1&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`
        );
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error('Erreur récupération recettes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (fridge.length > 0) fetchRecipes();
  }, [fridge]);

  const handleSelectRecipe = async (id) => {
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`
      );
      const data = await res.json();
      navigation.navigate('RecipeDetails', { recipe: data });
    } catch (error) {
      console.error('Erreur chargement recette complète :', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectRecipe(item.id)}>
      <View style={styles.recipeItem}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.missing}>{item.missedIngredientCount} ingrédients manquants</Text>
          {item.nutrition?.nutrients && (
            <View style={styles.macrosContainer}>
              <Text style={styles.macroItem}> {item.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || '–'} kcal</Text>
              <Text style={styles.macroItem}> {item.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || '–'} g protéines</Text>
              <Text style={styles.macroItem}> {item.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || '–'} g glucides</Text>
              <Text style={styles.macroItem}> {item.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || '–'} g lipides</Text>
            </View>
          )}
          <Text style={styles.missed}>❌ {item.missedIngredientCount} manquants</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔍 Recettes avec votre frigo</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: '#ecfdf5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  recipeItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  used: {
    color: '#22c55e',
  },
  missed: {
    color: '#ef4444',
  },
  macrosContainer: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 8,
  },
  macroItem: {
    fontSize: 13,
    color: '#6b7280',
  },
});
