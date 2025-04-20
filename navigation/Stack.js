// Stack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/Home';
import Shop from '../screens/shop';
import ProductDetailView from '../screens/Product_details';
import AddressScreen from '../screens/Address_screen';
import Account from '../screens/Account';
import CampaignDetailView from '../screens/Campaign_detail';
import StartCampaignView from '../screens/Start_Campaign';
import OrdersScreen from '../screens/Orders_screen';
import AccountCampaigns from '../screens/Campaigns_screen'
import ShoppingCart from '../screens/Cart';
import ShopCheckoutScreen from '../screens/Checkout_screen';

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
      <Stack.Screen 
        name="CampaignDetails" 
        component={CampaignDetailView} 
      />
      <Stack.Screen 
        name="StartCampaign" 
        component={StartCampaignView} 
      />
    </Stack.Navigator>
  );
};

// Accont Stack
export const AccountStackNavigator = () =>{
  return(
    <Stack.Navigator>
      <Stack.Screen
       name="Account"
       component={Account}
       options={{ headerShown: false }} 
       />
      <Stack.Screen
        name = "Address"
        component = {AddressScreen}
      />
      <Stack.Screen
        name = "OrdersScreen"
        component = {OrdersScreen}
      />
      <Stack.Screen
        name = "CampaignsScreen"
        component = {AccountCampaigns}
      />
    </ Stack.Navigator>
  );
};

// Home Stack
export const CartStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Cart" 
        component={ShoppingCart} 
        options={{ headerShown: false }} 
      />
        <Stack.Screen 
        name="Checkout" 
        component={ShopCheckoutScreen} 
      />
    </Stack.Navigator>
  );
};