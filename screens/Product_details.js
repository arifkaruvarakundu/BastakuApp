import React from 'react';
import { View, ScrollView, Image, Text, Button } from 'react-native';

const ProductDetailView = (navigation) => {
  return (
    <ScrollView style={styles.container}>
      <Image style={styles.image} source={{ uri: 'https://via.placeholder.com/640x640/228B22' }} />
      <View style={styles.info}>
        <Text style={styles.name}>Product Name</Text>
        <Text style={styles.price}>$99.99</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
      </View>
      <Button title="Add to Cart" onPress={() => {}} />
    </ScrollView>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  info: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
};

export default ProductDetailView;