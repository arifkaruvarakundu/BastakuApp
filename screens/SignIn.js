import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import {setAuthenticated} from '../redux/authSlice';
import API_BASE_URL from "../config";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

export default function Login({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const dispatch = useDispatch()

  const {i18n} = useTranslation();
   
  const { t } = useTranslation("SignIn_SignUp");

  const handleLogin = async () => {
    const { email, password } = formData;
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: t("fillFields"),
      });
      return;
    }

    // Validate email format using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: t("invalidEmail"),
      });
      return;
    }

    // Prepare the data to send in the POST request
    

    try {
      // Send the POST request to the login endpoint
      const response = await axios.post(`${API_BASE_URL}/login/`, formData);

      const data = await response.data;
      console.log("data:#########",data)

      if (response.status === 200) {
        dispatch(setAuthenticated())

        await AsyncStorage.setItem('access_token', data.token.access)
        await AsyncStorage.setItem('email', data.email)
        await AsyncStorage.setItem('user_type', JSON.stringify(data.user_type))
        // If login is successful, handle successful login logic
        Toast.show({
          type: 'success',
          text1: t("success"),
        });
        
        // You may want to store the authentication token in AsyncStorage or context
        // await AsyncStorage.setItem('access_token', data.token);

        // Navigate to the Home screen
        navigation.navigate('HomeTab', { screen: 'Home' });
      } else {
        // If login fails, show error message from response
        Alert.alert(t("failed"), data.message || t("invalidCredentials"));
      }
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: t("networkError"),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("title")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t("emailPlaceholder")}
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder={t("passwordPlaceholder")}
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t("button")}</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>{t("footerText")} </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>{t("signupLink")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50', // Matching color from SignUp
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#555',
  },
  linkText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
