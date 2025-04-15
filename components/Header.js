import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../config";

const Header = () => {
  const navigation = useNavigation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState({ products: [], categories: [] });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 4) {
        fetchSearchResults();
      } else {
        setSuggestions({ products: [], categories: [] });
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/?query=${query}`);
      const products = Array.isArray(response.data?.products) ? response.data.products : [];
      const categories = Array.isArray(response.data?.categories) ? response.data.categories : [];

      setSuggestions({ products, categories });
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions({ products: [], categories: [] });
    }
  };

  const renderSuggestions = () => (
    <View style={styles.suggestionBox}>
      <Text style={styles.suggestionTitle}>Products</Text>
      {suggestions.products.map((item, index) => (
        <Text key={`p-${index}`} style={styles.suggestionItem}>{item.name}</Text>
      ))}
      <Text style={styles.suggestionTitle}>Categories</Text>
      {suggestions.categories.map((item, index) => (
        <Text key={`c-${index}`} style={styles.suggestionItem}>{item.name}</Text>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Search Toggle */}
        <TouchableOpacity style={styles.iconContainer} onPress={() => setSearchOpen(!searchOpen)}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>BastaKU</Text>
        </View>
      </View>

      {/* Search Input */}
      {searchOpen && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search products or categories..."
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>
      )}

      {/* Suggestions */}
      {searchOpen && suggestions.products.length + suggestions.categories.length > 0 && renderSuggestions()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#a8d5ba",
  },
  header: {
    height: 60,
    backgroundColor: "#a8d5ba",
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
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  suggestionBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  suggestionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginTop: 10,
    color: "#333",
  },
  suggestionItem: {
    fontSize: 15,
    paddingVertical: 4,
    color: "#555",
  },
});

export default Header;
