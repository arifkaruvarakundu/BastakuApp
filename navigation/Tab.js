// Tab.js
import React from 'react';
import {View} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {HomeStackNavigator, ShopStackNavigator} from './Stack';
// import Profile from '../screens/Profile';
import Account from '../screens/Account';
import SignUp from '../screens/SignUp';
import HomePage from '../screens/Home';
import SignIn from '../screens/SignIn'
import {useSelector} from 'react-redux';
import Shop from '../screens/shop';
import { Ionicons } from '@expo/vector-icons';
import ShoppingCart from '../screens/Cart';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {

  const isAuthenticated = useSelector(state=> state.auth.isAuthenticated)

  return (
    
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#a8d5ba',
            // borderTopLeftRadius: 20,
            // borderTopRightRadius: 20,
            height: 60,
            paddingBottom: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
          tabBarActiveTintColor: '#1a3c40',
          tabBarInactiveTintColor: '#4f4f4f',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >

      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#eaf5ec' : 'transparent',
              borderRadius: 25,
              padding: 1,
            }}>
              <Ionicons 
                name="home-outline" 
                size={focused ? size + 2 : size} 
                color={focused ? '#1a3c40' : color} 
              />
            </View>
          ),
        }}  
      />

  <Tab.Screen 
    name="ShopTab" 
    component={ShopStackNavigator} 
    options={{
      headerShown: false,
      title: 'shop',
      tabBarIcon: ({ color, size, focused }) => (
        <View style={{
          backgroundColor: focused ? '#eaf5ec' : 'transparent',
          borderRadius: 25,
          padding: 1,
        }}>
          <Ionicons 
            name="storefront-outline" 
            size={focused ? size + 2 : size} 
            color={focused ? '#1a3c40' : color} 
          />
        </View>
      ),
    }}
  />
  
  <Tab.Screen 
        name="Cart" 
        component={ShoppingCart} 
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#eaf5ec' : 'transparent',
              borderRadius: 25,
              padding: 1,
            }}>
              <Ionicons 
                name="cart-outline" 
                size={focused ? size + 2 : size} 
                color={focused ? '#1a3c40' : color} 
              />
            </View>
          ),
        }} 
      />

  {isAuthenticated ? (
    <Tab.Screen 
      name="Account" 
      component={Account} 
      options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{
            backgroundColor: focused ? '#eaf5ec' : 'transparent',
            borderRadius: 25,
            padding: 1,
          }}>
            <Ionicons 
              name="person-outline" 
              size={focused ? size + 2 : size} 
              color={focused ? '#1a3c40' : color} 
            />
          </View>
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
