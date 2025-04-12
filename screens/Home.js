import { ScrollView } from 'react-native';
import ActiveCampaigns from "../components/ActiveCampaigns"
import Header from "../components/Header"
import { useNavigation } from '@react-navigation/native';
import { View, Text, StatusBar } from 'react-native';
import CarouselHomePage from "../components/Carousel_home";
import {CaurousalData as data} from "../utils/CarouselData"
import CategoriesHome from "../components/Categories_home";
// import ProductItem from "../components/ProductItem"

const HomePage = () => {
    const navigation = useNavigation();
    return (
        <>
        <Header navigation={navigation} />
        <ScrollView>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <ActiveCampaigns />
            <CarouselHomePage data={data} />
            <CategoriesHome navigation={navigation} />
            {/* <ProductItem /> */}
        </ScrollView>
        </>
        
    );
};

export default HomePage;