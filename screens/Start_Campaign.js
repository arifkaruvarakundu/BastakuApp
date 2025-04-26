import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../config'
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import SuccessModal from '../components/Success_alert';

const StartCampaignScreen = () => {
  const [variant, setVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [campaignPrice, setCampaignPrice] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState('');
  const [productName, setProductName] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated)

  const { t } = useTranslation("StartCampaign");

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

          if (startDetails.payment_option === 'basic') calculatedPrice *= 0.95;
          if (startDetails.payment_option === 'premium') calculatedPrice *= 0.75;
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
    if(!isAuthenticated){
      Toast.show({
        type: 'error',
        text1: 'Please login to start a Campaign'
      });
      navigation.navigate("SignIn")
      return;
    }

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
        setShowSuccessModal(true);
      } else {
        Alert.alert(t("error"), t("campaign_failed"));
      }
    } catch (err) {
      Alert.alert(t("error"), t("something_wrong"));
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!variant) {
    return (
      <View style={styles.centered}>
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{t("StartCampaign")}</Text>

      {variant?.variant_images?.length > 0 && (
        <Image source={{ uri: variant.variant_images[0].image_url }} style={styles.image} />
      )}

      <Text style={styles.label}>{t("campaign_title")}</Text>
      <TextInput style={styles.input} value={`${variant.brand} ${productName}`} editable={false} />

      {variant?.liter && (
        <>
          <Text style={styles.label}>{t("volume")}</Text>
          <TextInput style={styles.input} value={`${variant.liter}`} editable={false} />
        </>
      )}

      {variant?.weight && (
        <>
          <Text style={styles.label}>{t("weight")}</Text>
          <TextInput style={styles.input} value={`${variant.weight}`} editable={false} />
        </>
      )}

      <Text style={styles.label}>{t("your_price")}</Text>
      <TextInput style={styles.input} value={campaignPrice.toFixed(3)} editable={false} />

      <Text style={styles.label}>{t("my_quantity")}</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={decreaseQuantity} disabled={quantity <= 1}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={increaseQuantity} disabled={quantity >= variant.stock}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>{t("progress")}</Text>
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
          ? t("target_achieved")
          : t("more_to_unlock", { amount: Math.max(0, (variant.minimum_order_quantity_for_offer - quantity).toFixed(2)) })}
      </Text>

      <Text style={styles.label}>{t("total_amount")} (in KD)</Text>
      <TextInput style={styles.input} value={(campaignPrice * quantity).toFixed(3)} editable={false} />

      <TouchableOpacity style={styles.startBtn} onPress={handleStartCampaign} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{t("start_campaign")}</Text>}
      </TouchableOpacity>
    </ScrollView>
    <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onDetails={() => {
          setShowSuccessModal(false);
          navigation.navigate('HomeTab', { screen: 'Home' });
        }}
      />
    </>
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
