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
import { updateCartItemQuantity, addToCart } from '../redux/cartSlice';

const ProductDetailView = ({ route, navigation }) => {
  const { productId, quantity: initialQuantity } = route.params;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const product = cartItems[productId];
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/product_details/${productId}/`);
        const data = response.data;
        setFetchedProduct(data);
        setVariants(data.variants);
        setSelectedVariant(data.variants[0]); // Default to first variant
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
    if (variant) setSelectedVariant(variant);
  };

  const uniqueBrands = [...new Set(variants.map(v => v.brand))];

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.id || !fetchedProduct?.product_name) {
      Alert.alert("Error", "Invalid product selection.");
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
      Alert.alert("Success", "Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item to cart.");
    }
  };
  
  
  

  if (!fetchedProduct || !selectedVariant) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#228B22" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: selectedVariant.variant_images?.[0]?.image_url }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.detailsContainer}>
      <View style={styles.topRow}>
  <View style={styles.leftInfo}>
    <Text style={styles.title}>{fetchedProduct.product_name}</Text>
    <Text style={styles.price}>${selectedVariant.price}</Text>
  </View>

  <View style={styles.rightInfo}>
    {/* Brand Selection (Now Inline) */}
    <Text style={styles.sectionTitle}>Brand</Text>
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
            <Text style={styles.cartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{fetchedProduct.description}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  leftInfo: {
    flex: 1,
    paddingRight: 10,
  },
  rightInfo: {
    flexShrink: 1,
    alignItems: 'flex-end',
  },
  
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#228B22',
    marginBottom: 16,
  },
  brandSelector: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  brandOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brandButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginRight: 10,
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
    fontSize: 16,
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  qtyButton: {
    width: 40,
    height: 40,
    backgroundColor: '#E6F2E6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 22,
    color: '#228B22',
    fontWeight: '700',
  },
  qtyDisplay: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 30,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cartButton: {
    backgroundColor: '#228B22',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
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
