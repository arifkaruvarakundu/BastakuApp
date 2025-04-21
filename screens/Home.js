import React,{useCallback} from 'react';
import { FlatList, StatusBar} from 'react-native';
import ActiveCampaigns from "../components/ActiveCampaigns";
import Header from "../components/Header";
import { useNavigation } from '@react-navigation/native';
import CarouselHomePage from "../components/Carousel_home";
import { CaurousalData as data } from "../utils/CarouselData";
import CategoriesHome from "../components/Categories_home";


const HomePage = () => {
  const navigation = useNavigation();
  
  // const [refreshing, setRefreshing] = useState(false);
  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  // }, []);

  return (
    <>
      <Header navigation={navigation} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={[]} // empty because all content is in header
        keyExtractor={() => 'dummy'} // needed to avoid warning
        renderItem={null}
        ListHeaderComponent={
          <>
            <ActiveCampaigns navigation={navigation} />
            <CarouselHomePage data={data} />
            <CategoriesHome navigation={navigation} />
            {/* Add more sections as needed */}
          </>
        }
      />
    </>
  );
};

export default HomePage;
