import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/Home';
import SignUp from '../screens/SignUp'; // or wherever your signup screen is
// import shop from '../screens/shop'


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
        {/* <Stack.Screen name="shop" component = {Shop} /> */}
        
      </Stack.Navigator>
    );
  };

export default HomeStackNavigator;