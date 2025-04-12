import React,{useState} from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import CategoriesShop from '../components/Categories_shop';
import ProductItem from '../components/ProductItem';
import Header from '../components/Header';
import {useRoute} from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';

const Shop = (navigation) => {

    // const navigation = useNavigation();
    const route = useRoute()
    const { categoryId, categoryName } = route.params || {};
    const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || null);
    const [selectedCategoryName, setSelectedCategoryName] = useState(categoryName || null)

    const handleCategorySelect = (categoryId, categoryName) => {
      setSelectedCategoryId(categoryId);
      setSelectedCategoryName(categoryName);
    };    

  return (
    <>
    <Header/>
    <CategoriesShop 
        navigation = {navigation}
        onCategorySelect = {handleCategorySelect}
    />
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProductItem 
        navigation={navigation} 
        categoryId={selectedCategoryId} 
        categoryName={selectedCategoryName}
        onCategorySelect={handleCategorySelect}
        />
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
