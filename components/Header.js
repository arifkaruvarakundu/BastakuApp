import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
// import Signup from "../Screens/SignUp/SignUp";
// import {useRouter} from "expo-router";
import { useNavigation } from '@react-navigation/native';

const Header = () => {

//   const router = useRouter();
const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Left Icon */}
        <TouchableOpacity style={styles.iconContainer}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>

        {/* Center Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>BastaKU</Text>
        </View>
      
            
          {/* Sign Up Button */}
          {/* {isAuthenticated ? (
            <TouchableOpacity onPress={() => console.log("Sign Up Pressed")}>
              <Text style={styles.Signup}>SignUp</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => console.log("Login Pressed")}>
              <Text style={styles.Signup}>Login</Text>
            </TouchableOpacity>
          )} */}
        

        {/* Right Icon */}
        {/* <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.toggleDrawer()} // Toggle drawer on click
      >
        <FontAwesome name="list-ul" size={24} color="black" />
      </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#a8d5ba", // Greenish background
  },
  header: {
    height: 60,
    backgroundColor: "#a8d5ba", // Greenish color theme
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  iconContainer: {
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  Signup: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginRight: 10,
  }
});

export default Header;
