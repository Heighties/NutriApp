import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import FridgeScreen from './screens/FridgeScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import { ProductProvider } from './context/ProductContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ProductProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="Fridge" component={FridgeScreen} />
          <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductProvider>
  );
}
