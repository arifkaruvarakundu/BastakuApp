import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useDispatch } from 'react-redux'; // Use dispatch to trigger actions
import { setAuthenticated } from '../redux/authSlice'; // Ensure correct import path
import API_BASE_URL from '../config'; // Ensure correct API path

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigation = useNavigation(); // Initialize navigation
  const dispatch = useDispatch();

  // Handle form input changes
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const logAsyncStorage = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        if (allKeys && allKeys.length > 0) {
          allKeys.forEach(async (key) => {
            const value = await AsyncStorage.getItem(key);
            console.log(key, value); // Print key-value pair
          });
        } else {
          console.log('No data in AsyncStorage');
        }
      } catch (e) {
        console.error('Error reading AsyncStorage', e);
      }
    };

    logAsyncStorage();
  }, []);

  // Handle form submission and API call
  const handleSignUp = async () => {
    const { first_name, last_name, email, password, confirmPassword } = formData;

    // Validation checks
    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    // Call your sign-up API
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          password2: formData.confirmPassword,
        }),
      });

      const data = await response.json();
      console.log('SignUp Data:', data);

      if (response.ok) {
        dispatch(setAuthenticated());

        await AsyncStorage.setItem('access_token', JSON.stringify(data.token.access)); // Ensure token is stored as a string
        await AsyncStorage.setItem('user_type', JSON.stringify(data.user_type)); // Ensure user_type is stored as a string

        Alert.alert('Success', 'Sign up successful!');
        navigation.navigate('Home'); // Navigate to home after success
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(text) => handleInputChange('first_name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.last_name}
        onChangeText={(text) => handleInputChange('last_name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleInputChange('password', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) => handleInputChange('confirmPassword', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Already Registered Section */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.linkText}>SignIn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
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
    backgroundColor: '#4CAF50',
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

export default SignUp;
