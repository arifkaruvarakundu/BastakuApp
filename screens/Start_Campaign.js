import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../config'

const StartCampaignScreen = () => {
  const [variant, setVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [campaignPrice, setCampaignPrice] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState('');
  const [productName, setProductName] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const details = await AsyncStorage.getItem("start_campaign_details");
        console.log("start campaing details",details)
        const productDetails = await AsyncStorage.getItem("productDetails");

        const startDetails = JSON.parse(details);
        // const product = JSON.parse(productDetails);
        // console.log("product: ",product)

        if (startDetails) {
          setVariant(startDetails.variant);
          // setProductName(product.product_name || 'Product');

          // const { price, campaign_discount_percentage } = startDetails.variant;
          let calculatedPrice = (startDetails.variant.price * (100 - startDetails.variant.campaign_discount_percentage)) / 100;
          console.log(calculatedPrice)

          setPaymentOption(startDetails.payment_option);

          if (startDetails.deal_type === 'early_bird') calculatedPrice *= 0.95;
          if (startDetails.deal_type === 'vip_deal') calculatedPrice *= 0.75;
          console.log(calculatedPrice)

          setCampaignPrice(calculatedPrice);
          setQuantity(startDetails.quantity);
          setProgress((startDetails.quantity / startDetails.variant.minimum_order_quantity_for_offer) * 100);
        }
      } catch (err) {
        console.log("Error loading campaign data", err);
      }
    };

    loadData();
  }, []);

  const increaseQuantity = () => {
    if (quantity < variant?.stock) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      setProgress((newQty / variant.minimum_order_quantity_for_offer) * 100);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      setProgress((newQty / variant.minimum_order_quantity_for_offer) * 100);
    }
  };

  const handleStartCampaign = async () => {
    const data = {
      variant: variant.id,
      title: `${variant.brand} ${productName}`,
      discounted_price: campaignPrice,
      payment_option: paymentOption,
      quantity,
      start_time: new Date().toISOString(),
      end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      const response = await axios.post(`${API_BASE_URL}/start_campaign/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Campaign started successfully!");
        navigation.navigate("Home"); // or your homepage screen
      } else {
        Alert.alert("Error", "Failed to start the campaign.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!variant) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Start a New Campaign</Text>

      {variant?.variant_images?.length > 0 && (
        <Image source={{ uri: variant.variant_images[0].image_url }} style={styles.image} />
      )}

      <Text style={styles.label}>Campaign Title</Text>
      <TextInput style={styles.input} value={`${variant.brand} ${productName}`} editable={false} />

      {variant?.liter && (
        <>
          <Text style={styles.label}>Volume (Litre)</Text>
          <TextInput style={styles.input} value={`${variant.liter}`} editable={false} />
        </>
      )}

      {variant?.weight && (
        <>
          <Text style={styles.label}>Weight (Kg)</Text>
          <TextInput style={styles.input} value={`${variant.weight}`} editable={false} />
        </>
      )}

      <Text style={styles.label}>Your Price (in KD)</Text>
      <TextInput style={styles.input} value={campaignPrice.toFixed(3)} editable={false} />

      <Text style={styles.label}>My Quantity</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={decreaseQuantity} disabled={quantity <= 1}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={increaseQuantity} disabled={quantity >= variant.stock}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Progress</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: progress >= 100 ? "#10B981" : progress >= 90 ? "#EF4444" : progress >= 80 ? "#F59E0B" : progress >= 50 ? "#FBBF24" : "#3B82F6",
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {progress >= 100
          ? "Target Achieved!"
          : `${Math.max(0, (variant.minimum_order_quantity_for_offer - quantity).toFixed(2))} more to unlock!`}
      </Text>

      <Text style={styles.label}>Total Amount (in KD)</Text>
      <TextInput style={styles.input} value={(campaignPrice * quantity).toFixed(2)} editable={false} />

      <TouchableOpacity style={styles.startBtn} onPress={handleStartCampaign} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Start Campaign</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default StartCampaignScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F0FFF4",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065F46",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  qtyBtn: {
    padding: 10,
    backgroundColor: "#D1FAE5",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  qtyText: {
    fontSize: 18,
  },
  progressBar: {
    height: 20,
    backgroundColor: "#BBF7D0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
  },
  progressText: {
    textAlign: "center",
    marginBottom: 15,
  },
  startBtn: {
    backgroundColor: "#0aad0a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

