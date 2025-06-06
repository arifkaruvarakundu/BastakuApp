import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateCartItemQuantity, addToCart } from '../redux/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const ProductDetailView = ({ route, navigation }) => {
  const { productId, quantity: initialQuantity } = route.params;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const product = cartItems[productId];
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [campaignDetails, setCampaignDetails] = useState(null);

  const { t } = useTranslation('ProductDetails');
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/product_details/${productId}/`);
        const data = response.data;
        // console.log("data@@@@", data)
        setFetchedProduct(data);
        setVariants(data.variants);
        setSelectedVariant(data.variants[0]); // Default to first variant
        setCurrentImageIndex(0);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    dispatch(updateCartItemQuantity({ id: productId, quantity: newQty }));
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      dispatch(updateCartItemQuantity({ id: productId, quantity: newQty }));
    }
  };

  const handleBrandSelect = (brand) => {
    const variant = variants.find((v) => v.brand === brand);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const calculateCampaignPrice = (price, campaign_discount_percentage) => {
    const campaignPrice = price - (price * campaign_discount_percentage / 100)
    return campaignPrice 

  };

  const uniqueBrands = [...new Set(variants.map(v => v.brand))];

  const handleAddToCart = () => {
    console.log("cartItems:@@@",cartItems)
    if (!selectedVariant || !selectedVariant.id || !fetchedProduct?.product_name) {
      Alert.alert(t("error_invalid_product"));
      return;
    }

    // ✅ Check if any item in the cart has the same productId
    const isInCart = Object.values(cartItems).some(
      item => item.productId === fetchedProduct.id
    );

    if (isInCart) {
      Alert.alert("Info", "You have already added this to the cart.");
      return;
    }
  
    const itemToAdd = {
      id: selectedVariant.id,
      productId: fetchedProduct.id,
      name: fetchedProduct.product_name,
      brand: selectedVariant.brand,
      price: selectedVariant.price,
      image: selectedVariant.variant_images?.[0]?.image_url || '',
      quantity: quantity,
      liter: selectedVariant.liter,
      weight: selectedVariant.weight,
    };
  
    try {
      dispatch(addToCart(itemToAdd));
      // Alert.alert("Success", "Item added to cart!");
      Toast.show({
        type: 'success',
        text1: t("success_item_added"),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert(t("error_add_failed"));
    }
  };

  const handleNextImage = () => {
    if (!selectedVariant?.variant_images) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedVariant.variant_images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrevImage = () => {
    if (!selectedVariant?.variant_images) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedVariant.variant_images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (!fetchedProduct || !Array.isArray(fetchedProduct.variants)) return;
    if (!selectedVariant?.id) return;
  
    const campaignVariants = fetchedProduct.variants.filter((variant) => variant.is_in_campaign);
    // console.log("Campaign Variants:", campaignVariants);
  
    if (campaignVariants.length > 0) {
      axios.get(`${API_BASE_URL}/campaigns/`)
        .then((response) => {
          console.log("Campaigns Data from API:", response.data);

          const filteredCampaigns = response.data.filter((campaign) =>
            !(campaign.has_ended) && !(campaign.current_quantity===0|| campaign.current_participants===0));
  
          const relatedCampaign = filteredCampaigns.find(
            (campaign) => parseInt(campaign.variant.id) === selectedVariant.id
          );
  
          // console.log("Related Campaign:", relatedCampaign);
  
          if (relatedCampaign) {
            setCampaignDetails(relatedCampaign);
          }
        })
        .catch((error) => {
          console.error("Error fetching campaigns:", error);
        });
    }
  }, [selectedVariant?.id, fetchedProduct?.variants]);
  
  const handleDealClick = async (dealType, navigation) => {
    // if (!selectedPaymentOption) {
    //   alert("Please select a payment option.");
    //   return;
    // }
    // console.log("deal clicked")
  
    const selectedVariantDetails = selectedVariant;

    // console.log("selectedVariantDetails:",selectedVariantDetails)
  
    // if (!selectedVariantDetails) {
    //   alert("No variant selected.");
    //   return;
    // }
  
    // setSelectedVariant(selectedVariantDetails);
  
    const payload = {
      variant: selectedVariant,
      quantity: quantity,
      // payment_option: selectedPaymentOption,
      payment_option: dealType,
    };
  
    try {
      if (!selectedVariantDetails.is_in_campaign) {
        // Store details in localStorage for starting a campaign
        await AsyncStorage.setItem("start_campaign_details", JSON.stringify(payload));
        
        
        navigation.navigate("StartCampaign");
      }
      else{
      await AsyncStorage.setItem("campaign_details", JSON.stringify(payload));
  
      const campaignId = campaignDetails?.id || fetchedProduct?.id; // fallback if needed
      navigation.navigate("CampaignDetails", {
        id: campaignId,
        deal_type: dealType,
      });
      }
  
    } catch (error) {
      console.error("❌ Error handling deal click:", error);
      alert("Something went wrong. Check the console for details.");
    }
  };

  const currentParticipants = campaignDetails?.current_participants ?? 0;
  const targetQuantity = selectedVariant?.minimum_order_quantity_for_offer ?? 0;
  const currentQuantity = campaignDetails?.current_quantity ?? 0;
  const quantityLeft = Math.max(targetQuantity - currentQuantity, 0);
  const progress = targetQuantity ? (currentQuantity / targetQuantity) * 100 : 0;

  
  if (!fetchedProduct || !selectedVariant) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#228B22" />
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageWrapper}>
  <TouchableOpacity style={styles.arrowLeft} onPress={handlePrevImage}>
    <Text style={styles.arrowText}>‹</Text>
  </TouchableOpacity>

  <Image
    source={{ uri: selectedVariant.variant_images?.[currentImageIndex]?.image_url }}
    style={styles.image}
    resizeMode="cover"
  />

  <TouchableOpacity style={styles.arrowRight} onPress={handleNextImage}>
    <Text style={styles.arrowText}>›</Text>
  </TouchableOpacity>
</View>


      <View style={styles.detailsContainer}>
      <View style={styles.topRow}>
  <View style={styles.leftInfo}>
    <Text style={styles.title}>{i18n.language === "ar" ? fetchedProduct.product_name_ar : fetchedProduct.product_name_en}</Text>
    <Text style={styles.price}>{t("price")}: {selectedVariant.price} {t("kd")}</Text>
    <Text style={styles.price}>{t("campaignPrice")}: {parseFloat(calculateCampaignPrice(selectedVariant.price, selectedVariant.campaign_discount_percentage)).toFixed(3)} {t("kd")}</Text>
  </View>

  <View style={styles.rightInfo}>
    {/* Brand Selection (Now Inline) */}
    <Text style={styles.sectionTitle}>{t("brand")}</Text>
    <View style={styles.brandOptions}>
      {uniqueBrands.map((brand) => (
        <TouchableOpacity
          key={brand}
          style={[
            styles.brandButton,
            selectedVariant.brand === brand && styles.brandButtonActive,
          ]}
          onPress={() => handleBrandSelect(brand)}
          disabled={uniqueBrands.length === 1}
        >
          <Text
            style={[
              styles.brandButtonText,
              selectedVariant.brand === brand && styles.brandButtonTextActive,
            ]}
          >
            {brand}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Volume or Weight */}
    <Text style={styles.volumeText}>
      {selectedVariant.liter
        ? `${selectedVariant.liter} L`
        : selectedVariant.weight
        ? `${selectedVariant.weight} kg`
        : ''}
    </Text>
  </View>
</View>

        {/* Quantity & Add to Cart */}
        <View style={styles.actionRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.qtyButton} onPress={handleDecrease}>
              <Text style={styles.qtyText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyDisplay}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyButton} onPress={handleIncrease}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
            <Text style={styles.cartButtonText}>{t("add_to_cart")}</Text>
          </TouchableOpacity>
        </View>
        {selectedVariant?.is_in_campaign && (
            <View style={styles.groupProgressSection}>
              <View style={styles.groupInfo}>
                <Text style={styles.groupTitle}>{t("group_campaign_active")}</Text>
                <Text style={styles.groupStats}>
                  <Text style={styles.boldText}>{currentParticipants}</Text> {t("participants")} ·{' '}
                  <Text style={styles.boldText}>{quantityLeft}</Text> {t("more_to_unlock")}
                </Text>
              </View>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

              <View style={styles.progressLabels}>
                <Text style={styles.labelText}>{t("current")}: {currentQuantity}</Text>
                <Text style={styles.labelText}>{t("target")}: {targetQuantity}</Text>
              </View>
            </View>
          )}

        <View style={styles.dealRow}>
          <TouchableOpacity
            style={styles.dealBoxFixed}
            onPress={() => handleDealClick("free", navigation)}
          >
            <Text style={styles.dealText}>
              {fetchedProduct?.is_in_campaign ? t("join_free") : t("start_free")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dealBoxFixed}
            onPress={() => handleDealClick("basic", navigation)}
          >
            <Text style={styles.dealText}>{t("early_bird")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dealBoxFixed}
            onPress={() => handleDealClick("premium", navigation)}
          >
            <Text style={styles.dealText}>{t("vip_deal")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t("description")}</Text>
        <Text style={styles.description}>{i18n.language === "ar" ? fetchedProduct.description_ar : fetchedProduct.description_en}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: 340,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  detailsContainer: {
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  leftInfo: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#228B22',
  },
  rightInfo: {
    flexShrink: 1,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  brandOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  brandButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  brandButtonActive: {
    backgroundColor: '#228B22',
  },
  brandButtonText: {
    fontSize: 14,
    color: '#333',
  },
  brandButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  volumeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginTop: 6,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  qtyButton: {
    width: 36,
    height: 36,
    backgroundColor: '#E6F2E6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#228B22',
  },
  qtyDisplay: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  cartButton: {
    flex: 1,
    backgroundColor: '#228B22',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  dealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  groupProgressSection: {
    backgroundColor: '#F3FDF3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#228B22',
  },
  groupInfo: {
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#228B22',
    marginBottom: 4,
  },
  groupStats: {
    fontSize: 14,
    color: '#555',
  },
  boldText: {
    fontWeight: '700',
    color: '#000',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  labelText: {
    fontSize: 12,
    color: '#444',
  },
  
  dealBoxFixed: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#228B22',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dealText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1A1A1A',
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 340,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrowLeft: {
    position: 'absolute',
    left: 10,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  arrowRight: {
    position: 'absolute',
    right: 10,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  arrowText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    marginBottom: 30,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#888',
  },
});


export default ProductDetailView;