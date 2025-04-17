// Tab.js
import React from 'react';
import {View, Text} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {HomeStackNavigator, ShopStackNavigator, AccountStackNavigator} from './Stack';
// import Profile from '../screens/Profile';
import Account from '../screens/Account';
import SignUp from '../screens/SignUp';
import HomePage from '../screens/Home';
import SignIn from '../screens/SignIn'
import {useSelector} from 'react-redux';
import Shop from '../screens/shop';
import { Ionicons } from '@expo/vector-icons';
import ShoppingCart from '../screens/Cart';
import { selectCartCount } from '../redux/cartSlice';
import CartTabIcon from '../components/Cart_tab_Icon';
import { StackActions } from '@react-navigation/native';

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
      title: 'Shop',
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
    listeners={({ navigation, route }) => ({
      tabPress: e => {
        const state = navigation.getState();
        const shopTab = state.routes.find(r => r.name === 'ShopTab');
        const nestedState = shopTab?.state;
      
        if (nestedState && nestedState.index > 0) {
          // We're not at the root of Shop stack — reset it
          navigation.navigate('ShopTab'); // ensure tab is focused
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: nestedState.key, // Reset only the nested navigator
          });
        } else {
          // Already at root or no nested state — navigate explicitly to shop screen
          navigation.navigate('ShopTab', {
            screen: 'shop',
          });
        }
      },
    })}    
  />

<Tab.Screen 
  name="Cart" 
  component={ShoppingCart} 
  options={{
    title: 'Cart',
    tabBarIcon: (props) => <CartTabIcon {...props} />,
  }} 
/>



  {isAuthenticated ? (
    <Tab.Screen 
      name="AccountTab" 
      component={AccountStackNavigator} 
      options={{
        headerShown: false,
        title: 'Account',
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
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#eaf5ec' : 'transparent',
              borderRadius: 25,
              padding: 1,
            }}>
              <Ionicons 
                name="person-add-outline" 
                size={focused ? size + 2 : size} 
                color={focused ? '#1a3c40' : color} 
              />
            </View>
          ),
        }} 
      />
      <Tab.Screen 
        name="SignIn" 
        component={SignIn} 
        options={{
          title: 'Sign In',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#eaf5ec' : 'transparent',
              borderRadius: 25,
              padding: 1,
            }}>
              <Ionicons 
                name="log-in-outline" 
                size={focused ? size + 2 : size} 
                color={focused ? '#1a3c40' : color} 
              />
            </View>
          ),
        }} 
      />
    </>
  )}
</Tab.Navigator>

  );
}
