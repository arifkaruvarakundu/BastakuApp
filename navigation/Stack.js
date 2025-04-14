// Stack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/Home';
import Shop from '../screens/shop';
import ProductDetailView from '../screens/Product_details';

const Stack = createNativeStackNavigator();

// Home Stack
export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomePage} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

// Shop Stack
export const ShopStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="shop" 
        component={Shop} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailView} 
      />
    </Stack.Navigator>
  );
};
