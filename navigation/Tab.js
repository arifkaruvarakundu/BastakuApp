// Tab.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/Home';
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

      <Tab.Screen name="Home" 
        component={HomePage} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          
        }}  
      />

      <Tab.Screen name="Shop" 
        component={Shop} 
        options={{headerShown: false}}
      />

      {isAuthenticated ?(
        <Tab.Screen name="Account" 
          component={Account} 
        />
      ):(
      <>
        <Tab.Screen name="SignUp" 
          component={SignUp} 
          options={{ title: 'Sign Up' }} 
        />

        <Tab.Screen name="SignIn" 
          component={SignIn} 
          options={{ title: 'Sign In' }} 
        />

      </>
      )}
    </Tab.Navigator>
  );
}
