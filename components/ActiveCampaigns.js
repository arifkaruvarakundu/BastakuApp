import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from '@react-navigation/native';
import API_BASE_URL from '../config'
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const ActiveGroupDealStory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation('home');

  // You can uncomment and complete this effect to fetch campaigns
  useFocusEffect(
    useCallback(() => {
      const fetchCampaigns = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/campaigns/`);
          
          // Filter out campaigns with 0 participants and 0 quantity
          const filteredCampaigns = response.data.filter((campaign) =>
            !(campaign.has_ended) && !(campaign.current_quantity===0|| campaign.current_participants===0));

          setCampaigns(filteredCampaigns);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchCampaigns();
    }, [])
  );

  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    const firstImage = item.variant?.variant_images?.[0]; // Safely get first image
    const imageUrl = firstImage?.image_url; // Assuming image object has an `image` field
    return (
      <TouchableOpacity 
        style={styles.storyItem} 
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('ShopTab', {
            screen: 'ProductDetails',
            params: { productId: item.product_id },
          })
        }
        >
        <LinearGradient
          colors={["#f0e3d6", "#f6f9f1", "#e2f4e1", "#b6e4af", "#a4daa6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.outerRing}
        >
          <View style={styles.middleRing}>
            <View style={styles.innerRing}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.storyImage} />
            ) : (
              <View style={[styles.storyImage, { backgroundColor: "#ccc" }]} />
            )}
            </View>
          </View>
        </LinearGradient>
        <Text style={styles.storyText} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{t('ongoingCampaigns')}</Text>
      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  storyItem: {
    alignItems: "center",
    marginRight: 15,
  },
  outerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  middleRing: {
    flex: 1,
    borderRadius: 37,
    backgroundColor: "#b6e4af",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    flex: 1,
    borderRadius: 35,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  storyImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  storyText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    maxWidth: 80,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3b614f', // deep green for elegance
    marginLeft: 12,
    marginBottom: 8,
    textTransform: 'capitalize',
    fontFamily: 'System', // You can replace with a custom font if using one
    letterSpacing: 0.5,
  },
  
});

export default ActiveGroupDealStory;
