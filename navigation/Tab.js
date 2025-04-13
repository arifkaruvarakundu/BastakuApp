// Tab.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './Stack';
// import Profile from '../screens/Profile';
import Account from '../screens/Account';
import SignUp from '../screens/SignUp'
import SignIn from '../screens/SignIn'
import {useSelector} from 'react-redux';
import Shop from '../screens/shop';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {

  const isAuthenticated = useSelector(state=> state.auth.isAuthenticated)

  return (
    
    <Tab.Navigator>
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator}  // <-- use stack here!
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}  
      />

  <Tab.Screen 
    name="Shop" 
    component={Shop} 
    options={{
      headerShown: false,
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="storefront-outline" size={size} color={color} />
      ),
    }}
  />

  {isAuthenticated ? (
    <Tab.Screen 
      name="Account" 
      component={Account} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  ) : (
    <>
      <Tab.Screen 
        name="SignUp" 
        component={SignUp} 
        options={{
          title: 'Sign Up',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="SignIn" 
        component={SignIn} 
        options={{
          title: 'Sign In',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" size={size} color={color} />
          ),
        }} 
      />
    </>
  )}
</Tab.Navigator>

  );
}
