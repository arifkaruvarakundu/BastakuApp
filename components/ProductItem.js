import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import API_BASE_URL from "../config";
// import {useSelector, useDispatch} from 'react-redux';
import { addToCart, removeFromCart, updateCartItemQuantity } from '../redux/cartSlice';

const { width } = Dimensions.get("window");

const ProductItem = ({ navigation, categoryId, categoryName }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  // const [cartItems, setCartItems] = useState({});
  const [localQuantities, setLocalQuantities] = useState({});
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [renderCount, setRenderCount] = useState(5); // initial batch size
  const BATCH_SIZE = 5;



  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/products/`);
        // console.log("Fetched products:", response.data);
        setProducts(response.data);
        setFilteredProducts(response.data); 
        setError(null);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (filteredProducts.length) {
      setVisibleProducts(filteredProducts.slice(0, renderCount));
    }
  }, [filteredProducts, renderCount]);

  const handleLoadMore = () => {
    if (renderCount < filteredProducts.length) {
      setRenderCount(prev => prev + BATCH_SIZE);
    }
  };
  

  // const handleAddToCart = (product) => {
  //   dispatch(addToCart({ ...product, quantity: 1 }));
  // };

  const handleIncrease = (productId) => {
    setLocalQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1
    }));
  };
  
  const handleDecrease = (productId) => {
    setLocalQuantities(prev => {
      const currentQty = prev[productId] || 1;
      if (currentQty > 1) {
        return {
          ...prev,
          [productId]: currentQty - 1
        };
      } else {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
    });
  };
  
  useEffect(() => {
    if (categoryId || categoryName) {
      console.log("Received from Shop page:", categoryId, categoryName);
    } else {
      console.log("No category received from Shop page");
    }
  }, [categoryId, categoryName]);

  useEffect(() => {
    if (!products.length) return;
    if (categoryId) {
      // console.log("category name:#########:",categoryName)
      const filtered = products.filter((p) => Number(p.category) === Number(categoryId));
      setFilteredProducts(filtered);
      setShowAll(false)
    } else {
      setFilteredProducts(products);
      // console.log("filtered Products:", filteredProducts)
    }
  }, [categoryId, products]);

  const handleViewAll = () => {
    const filtered = [...products]
    setFilteredProducts(filtered)
    setShowAll(true);
  };

  const handleProductPress = (product) => {
    const quantity = localQuantities[product.id] || 1;
    navigation.navigate('ProductDetails', {
      productId: product.id,
      quantity,
    });
  };

  // const handleJoinGroup = (id) => {
  //   // Placeholder: implement join logic
  //   console.log("Joining group with ID:", id);
  // };

  // const calculateProgress = (current, target) => {
  //   return (current / target) * 100;
  // };

  const calculateCampaignPrice = (price, campaign_discount_percentage) => {
    const campaignPrice = price - (price * campaign_discount_percentage / 100)
    return campaignPrice 

  };

  const formatTime = (dateString) => {
    const expiryDate = new Date(dateString);
    const now = new Date();
    const diffTime = expiryDate - now;

    if (diffTime <= 0) return "Expired";

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return diffDays > 0 ? `${diffDays}d ${diffHours}h left` : `${diffHours}h left`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dealContainer}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.variants[0].variant_images[0].image_url }}
          style={styles.dealImage}
          resizeMode="cover"
        />
        <View style={styles.discountBadge}>
        <Text style={styles.discountText}>
          {item.variants[0].campaign_discount_percentage}% OFF
        </Text>
        </View>
      </View>

      {!localQuantities[item.id] ? (
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleIncrease(item.id)}
        >
          <AntDesign name="pluscircle" size={24} color="#499c5d" />
        </TouchableOpacity>
      ) : (
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => handleDecrease(item.id)}>
            <AntDesign name="minuscircleo" size={24} color="#499c5d" />
          </TouchableOpacity>
          <Text style={{
            marginHorizontal: 10,
            fontSize: 16,
            fontWeight: "bold",
            color: "#333",
            minWidth: 20,
            textAlign: "center"
          }}>
            {localQuantities[item.id]}
          </Text>
          <TouchableOpacity onPress={() => handleIncrease(item.id)}>
            <AntDesign name="pluscircleo" size={24} color="#499c5d" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.campaignPrice}>KD: {parseFloat(item.variants[0].price).toFixed(3)}</Text>
          {/* <Text style={styles.actualPrice}></Text> */}
        </View>

        {/* <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${calculateProgress(
                    item.currentQuantity,
                    item.targetQuantity
                  )}%`,
                },
              ]}
            />
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>
              {item.currentQuantity}/{item.targetQuantity} joined
            </Text>
            <Text style={styles.timeLeftText}>
              {formatTime(item.expiryDate)}
            </Text>
          </View>
        </View> */}

        <Text style={styles.minOrderText}>
          Campaign Price:{parseFloat(calculateCampaignPrice(item.variants[0].price, item.variants[0].campaign_discount_percentage)).toFixed(3)} KD
        </Text>

        {/* <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinGroup(item.id)}
        >
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const numColumns = 2;
  // const limitedProducts = products.slice(0, 8); // Show first 8

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
        {categoryId && !showAll ? categoryName : "All Products"}
      </Text>

      <TouchableOpacity
          onPress={handleViewAll}
          disabled={showAll}
          style={[styles.viewAllButton, showAll && { opacity: 0.5 }]}
        >
        <Text style={styles.viewAllText}>
          View All
        </Text>

          <AntDesign name="right" size={16} color="#0066CC" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={visibleProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        contentContainerStyle={styles.gridContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Adjust threshold based on performance
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // all styles remain the same as you had
  container: {
    marginVertical: 15,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#499c5d",
    marginRight: 5,
  },
  gridContent: {
    paddingBottom: 10,
  },
  dealContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    maxWidth: (width - 40) / 2,
  },
  imageContainer: {
    height: 120,
    position: "relative",
  },
  dealImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FF4757",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  discountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
  },
  detailsContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    height: 38,
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  campaignPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4757",
    marginRight: 8,
  },
  actualPrice: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through",
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CD964",
    borderRadius: 3,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    fontSize: 11,
    color: "#666",
  },
  timeLeftText: {
    fontSize: 11,
    color: "#FF9500",
  },
  minOrderText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: "#499c5d",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  joinButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 15,
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  addToCartButton: {
    position: "absolute",
    top: 80,
    right: 5,
    backgroundColor: "#a8d5ba",
    borderRadius: 12,
    padding: 2,
    zIndex: 5,
  },
  quantityControl: {
    position: "absolute",
    top: 80,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6   
    
    ,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 5,
    width: 110, // adjust for spacing if needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },  
  
  cartSummary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
  },
  
  cartText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  
  viewCartButton: {
    backgroundColor: "#499c5d",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  viewCartText: {
    color: "#fff",
    fontWeight: "bold",
  },
  
});

export default ProductItem;