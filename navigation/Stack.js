import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/Home';
import SignUp from '../screens/SignUp'; // or wherever your signup screen is


const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    return (
      <Stack.Navigator>
        {/* HomePage will have no header because we use the custom header with Drawer Toggle */}
        <Stack.Screen 
          name="Home" 
          component={HomePage} 
          options={{
            headerShown: false, // Hide header for this screen as Header component is used
          }} 
        />
        <Stack.Screen name="SignUp" component={SignUp} />
        
      </Stack.Navigator>
    );
  };

export default HomeStackNavigator;