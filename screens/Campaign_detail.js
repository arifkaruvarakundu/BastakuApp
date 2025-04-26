import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import SuccessModalJoin from '../components/Success_alert_join';

const CampaignDetailView = () => {
  const [variant, setVariant] = useState(null);
  const [progress, setProgress] = useState(0);
  const [campaign, setCampaign] = useState(null);
  const [campaignPrice, setCampaignPrice] = useState(0);
  const [additionalQuantity, setAdditionalQuantity] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState('');
  const [isWholesaler, setIsWholesaler] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { t } = useTranslation('CampaignDetail');
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const joinCampaignDetails = JSON.parse(await AsyncStorage.getItem("campaign_details"));
      const storedQuantity = joinCampaignDetails?.quantity || 0;
      const selectedPaymentOption = joinCampaignDetails?.payment_option || "free";

      setAdditionalQuantity(storedQuantity);
      setPaymentOption(selectedPaymentOption);

      axios.get(`${API_BASE_URL}/campaigns/${id}/`)
        .then((res) => {
          const data = res.data;
          setCampaign(data);
          setVariant(data.variant);
          setCurrentQuantity(data.current_quantity);

          let calculatedPrice = (data.variant.price * (100 - data.variant.campaign_discount_percentage)) / 100;
          if (selectedPaymentOption === 'basic') calculatedPrice *= 0.95;
          if (selectedPaymentOption === 'premium') calculatedPrice *= 0.75;

          setCampaignPrice(calculatedPrice);
          const progressPercent = ((data.current_quantity + storedQuantity) / data.variant.minimum_order_quantity_for_offer) * 100;
          setProgress(progressPercent);
        })
        .catch((e) => console.log("Fetch error:", e));
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    AsyncStorage.getItem('user_type').then((type) => {
      if (type === 'wholesaler') setIsWholesaler(true);
    });
  }, []);

  const increaseQuantity = () => {
    const newQty = additionalQuantity + 1;
    setAdditionalQuantity(newQty);
    const totalQty = currentQuantity + newQty;
    setProgress(Math.min((totalQty / variant.minimum_order_quantity_for_offer) * 100, 100));
  };

  const decreaseQuantity = () => {
    if (additionalQuantity > 1) {
      const newQty = additionalQuantity - 1;
      setAdditionalQuantity(newQty);
      const totalQty = currentQuantity + newQty;
      setProgress(Math.min((totalQty / variant.minimum_order_quantity_for_offer) * 100, 100));
    }
  };

  const joinCampaign = async () => {
    if(!isAuthenticated){
      Toast.show({
        type: 'error',
        text1: 'Please login for joining Campaign'
      });
      navigation.navigate("SignIn")
      return;
    }
    setIsLoading(true);
    const token = await AsyncStorage.getItem("access_token");

    const data = {
      variant: campaign.variant.id,
      participant_quantity: additionalQuantity,
      payment_option: paymentOption,
      start_time: new Date().toISOString(),
      end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/campaigns/${id}/join/`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200) {
        setShowSuccessModal(true);
      } else {
        alert(t("failed_join"));
      }
    } catch (err) {
      alert(t("join_error"));
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign) {
    return (
      <View style={styles.centered}>
        <Text>{t("no_campaigns")}</Text>
      </View>
    );
  }

  const totalAmount = (campaignPrice * additionalQuantity).toFixed(2);
  const totalQuantity = currentQuantity + additionalQuantity;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: campaign.variant.variant_images[0].image_url }}
        style={styles.image}
      />
      <Text style={styles.title}>{campaign.title}</Text>
      <Text style={styles.description}>{campaign.description}</Text>

      <Text style={styles.label}>{t("price")}: {campaign.variant.price} KD</Text>
      <Text style={styles.label}>{t("your_price")}: {campaignPrice.toFixed(2)} KD</Text>
      <Text style={styles.label}>{t("minimum_order")}: {variant.minimum_order_quantity_for_offer}</Text>

      <View style={styles.quantityRow}>
        <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity} disabled={additionalQuantity === 0}>
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{additionalQuantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.totalAmount}>{t("total_amount")}: {totalAmount} KD</Text>

      {isLoading && <ActivityIndicator size="large" color="#0aad0a" style={{ marginVertical: 20 }} />}

      <TouchableOpacity
        style={[styles.joinButton, (isLoading || isWholesaler) && styles.disabledButton]}
        onPress={joinCampaign}
        disabled={isLoading || isWholesaler}
      >
        <Text style={styles.joinButtonText}>
          {isLoading
            ? t("joining")
            : paymentOption === 'free'
              ? t("join_free")
              : paymentOption === 'basic'
                ? t("pay_10")
                : t("pay_full")}
        </Text>
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%`, backgroundColor: progress >= 100 ? "#10B981" : progress >= 80 ? "#F59E0B" : "#3B82F6" }]} />
      </View>
      <Text style={styles.progressText}>
        {progress >= 100
          ? t("target_achieved")
          : t("more_to_unlock", {
              amount: (variant.minimum_order_quantity_for_offer - totalQuantity).toFixed(2)
            })}
      </Text>
      <SuccessModalJoin
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onDetails={() => {
          setShowSuccessModal(false);
          navigation.navigate('HomeTab', { screen: 'Home' });
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F0FFF4",
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#065F46",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#059669",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    justifyContent: "center"
  },
  quantityButton: {
    backgroundColor: "#D1FAE5",
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 20,
    color: "#065F46",
  },
  quantityValue: {
    fontSize: 18,
    width: 40,
    textAlign: 'center'
  },
  totalAmount: {
    fontSize: 18,
    color: "#059669",
    textAlign: "center",
    marginVertical: 10,
  },
  joinButton: {
    backgroundColor: "#0aad0a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  progressBarContainer: {
    height: 15,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: "100%",
  },
  progressText: {
    textAlign: "center",
    marginTop: 5,
    color: "#444",
  },
});

export default CampaignDetailView;
