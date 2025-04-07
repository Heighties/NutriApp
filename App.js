import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import FridgeScreen from './screens/FridgeScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import { ProductProvider } from './context/ProductContext';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import RecipesScreen from './screens/RecipesScreen'
import RecipeDetailsScreen from './screens/RecipeDetailsScreen';
import { UserProvider } from './context/UserContext';
import ProfileSetupScreen from './screens/ProfileSetupScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProductProvider>
        <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Scan" component={ScanScreen} />
            <Stack.Screen name="Fridge" component={FridgeScreen} />
            <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Détails du produit' }} />
            <Stack.Screen name="Recipes" component={RecipesScreen} />
            <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        </UserProvider>
      </ProductProvider>
    </GestureHandlerRootView>
  );
}