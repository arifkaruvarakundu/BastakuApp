import React from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import CategoriesShop from '../components/Categories_shop';
import ProductItem from '../components/ProductItem';

const Shop = () => {
  return (
    <>
    <CategoriesShop />
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ProductItem /> 
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
    scrollContainer: {
      paddingBottom: 20, // Add some spacing at the bottom
    },
  });

export default Shop;
