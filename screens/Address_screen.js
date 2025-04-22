import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../config';
import { useTranslation } from 'react-i18next';

const AddressScreen = () => {
  const [address, setAddress] = useState({
    first_name: '',
    last_name: '',
    street_address: '',
    email: '',
    city: '',
    zipcode: '',
    country: '',
    phone_number: '',
  });

  const [loading, setLoading] = useState(true);
  const { t } = useTranslation('Account'); // Use the 'Account' namespace for translations

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      let token = await AsyncStorage.getItem('access_token');
      token = token?.replace(/^"|"$/g, '');

      if (!token) {
        Alert.alert(t("authenticationError"), t("userTokenNotFound"));
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/details/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      setAddress({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        street_address: data.street_address || '',
        email: data.email || '',
        city: data.city || '',
        zipcode: data.zipcode || '',
        country: data.country || '',
        phone_number: data.phone_number || '',
      });
    } catch (error) {
      console.error('Failed to fetch address:', error?.response?.data || error.message);
      Alert.alert(t("errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      let token = await AsyncStorage.getItem('access_token');
      token = token?.replace(/^"|"$/g, '');
  
      if (!token) {
        Alert.alert(t("authenticationError"));
        return;
      }
  
      await axios.patch(`${API_BASE_URL}/profile/update/`, address, {
        headers: {
          Authorization: `Bearer ${token}`,
          email: address.email,
          'Content-Type': 'application/json',
        },
      });
  
      Alert.alert(t("success"), t("addressUpdated"));
    } catch (error) {
      console.error('Error submitting address:', error?.response?.data || error.message);
      Alert.alert(t("error"), error?.response?.data?.error || t("genericError"));
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{t('editAddress')}</Text>

          {Object.entries(address).map(([key, value]) => (
            <View key={key} style={styles.inputWrapper}>
              <Text style={styles.label}>{t(key)}</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => handleChange(key, text)}
                keyboardType={
                  key.includes('email') ? 'email-address' :
                  key.includes('phone') || key.includes('zip') ? 'phone-pad' : 'default'
                }
                autoCapitalize="none"
                placeholder={t(key)}
                placeholderTextColor="#aaa"
              />
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{t('saveChanges')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    padding: 24,
    paddingBottom: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 60,
    alignItems: 'center',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default AddressScreen;
