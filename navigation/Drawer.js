import React from 'react';
import {Alert} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector} from 'react-redux';
import { setNotAuthenticated } from '../redux/authSlice'; // Import the action
import { Feather } from '@expo/vector-icons';  // Import Feather icons
import HomePage from "../screens/Home";
import SignUp from "../screens/SignUp";
import SignIn from "../screens/SignIn"

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
   // Get the authentication status from Redux store
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {

      // Clear AsyncStorage (you can remove specific keys as well)
      await AsyncStorage.removeItem('access_token'); // Remove access token from AsyncStorage
      await AsyncStorage.removeItem('user_type');
      dispatch(setNotAuthenticated()); // Dispatch action to update Redux state
      Alert.alert('Logged Out', 'You have been logged out successfully.');

      props.navigation.navigate('Home'); // Replace with Home (instead of HomePage) within the DrawerNavigator
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {/* Logout Button */}
      {/* Conditionally render the Logout button if the user is authenticated */}
      {isAuthenticated && (
        <DrawerItem
          label="Logout"
          onPress={handleLogout}
          icon={() => <Feather name="log-out" size={20} color="red" />}
        />
      )}
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
      {!isAuthenticated && (
        <>
          <Drawer.Screen name="SignUp" component={SignUp} />
          <Drawer.Screen name="SignIn" component={SignIn} />
        </>
      )}
    </Drawer.Navigator>
  );
}
