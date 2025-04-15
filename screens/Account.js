import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setNotAuthenticated } from '../redux/authSlice';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Account = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user_type');

      dispatch(setNotAuthenticated());
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      navigation.navigate('Home');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const options = [
    { icon: 'location-outline', label: 'Address', onPress: () => navigation.navigate('Address') },
    { icon: 'receipt-outline', label: 'Orders', onPress: () => navigation.navigate('OrdersScreen') },
    { icon: 'megaphone-outline', label: 'Campaigns', onPress: () => navigation.navigate('CampaignsScreen') },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => navigation.navigate('NotificationsScreen') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Account</Text>

      <View style={styles.cardContainer}>
        {options.map((item, index) => (
          <TouchableOpacity key={index} style={styles.optionCard} onPress={item.onPress}>
            <Ionicons name={item.icon} size={24} color="#555" />
            <Text style={styles.optionText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {isAuthenticated && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    elevation: 2,
    marginBottom: 30,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4d4d',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default Account;
