import React,{useState, useEffect, useRef} from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import CategoriesShop from '../components/Categories_shop';
import ProductItem from '../components/ProductItem';
import Header from '../components/Header';
import {useRoute} from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';


const Shop = ({navigation}) => {

    // const navigation = useNavigation();
    const route = useRoute()
    const { categoryId, categoryName } = route.params || {};
    const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || null);
    const [selectedCategoryName, setSelectedCategoryName] = useState(categoryName || null)
    const [categories, setCategories] = useState([]);

    const categoriesFlatListRef = useRef(null); // <--- NEW

    useEffect(() => {
      if (categoryId || categoryName) {
        // console.log("Received in Shop page:", categoryId, categoryName);
        setSelectedCategoryId(categoryId);
        setSelectedCategoryName(categoryName);
    
        // Reset params (optional)
        navigation.setParams({ categoryId: null, categoryName: null });
      }
    }, [categoryId, categoryName]);

    useEffect(() => {
      if (categoriesFlatListRef.current && selectedCategoryId && categories.length > 0) {
        const index = categories.findIndex(cat => cat.id === selectedCategoryId);
        if (index !== -1) {
          categoriesFlatListRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5, // center the item
          });
        }
      }
    }, [selectedCategoryId, categories]);

    const handleCategorySelect = (categoryId, categoryName) => {
      setSelectedCategoryId(categoryId);
      setSelectedCategoryName(categoryName);
    };    

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header/>
        <CategoriesShop
            navigation={navigation}
            onCategorySelect={handleCategorySelect}
            selectedCategoryId={selectedCategoryId}
            categoriesScrollViewRef={categoriesFlatListRef}
            fetchCategories={(fetched) => setCategories(fetched)}
          />
      {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
      <View style={{ flex: 1, paddingBottom: 10 }}>
          <ProductItem 
            navigation = {navigation} 
            categoryId = {selectedCategoryId} 
            categoryName = {selectedCategoryName}
            onCategorySelect = {handleCategorySelect}
          />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    scrollContainer: {
      paddingBottom: 20, // Add some spacing at the bottom
    },
  });

export default Shop;
