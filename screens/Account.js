import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setNotAuthenticated } from '../redux/authSlice'; // adjust the path as needed
import { useNavigation } from '@react-navigation/native';

const Account = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  console.log(isAuthenticated)

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user_type');

      dispatch(setNotAuthenticated());
      Alert.alert('Logged Out', 'You have been logged out successfully.');

      navigation.navigate('Home'); // goes to the Home screen
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Account Screen</Text>
      {isAuthenticated && (
        <Button title="Logout" onPress={handleLogout} />
      )}
    </View>
  );
};

export default Account;
