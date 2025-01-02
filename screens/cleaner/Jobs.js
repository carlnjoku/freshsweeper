import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, Image, Modal, TouchableOpacity } from 'react-native';
import { Avatar, TextInput, Menu, List, Button} from 'react-native-paper';
import Text from '../../components/Text';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import haversine from 'haversine';
import { haversineDistance } from '../../utils/distanceBtwLocation';
import { AuthContext } from '../../context/AuthContext';
import * as Animatable from 'react-native-animatable';
import { HomeSkeleton } from '../../components/skeleton/HomeSkeleton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CardNoPrimary from '../../components/CardNoPrimary';
import ROUTES from '../../constants/routes';
import ScheduleListItem from '../../components/cleaner/ScheduleListItem';
import EmptyListing from '../../components/EmptyListing';
import FilterExplore from './FilterExplore';
import moment from 'moment';




export default function Jobs({route,navigation}) {

  const {currentUser} = useContext(AuthContext)

  const genericArray = new Array(5).fill(null);

  const [allSchedules, setAllSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false)
  const [query_strings, setQueryString] = useState({})

  // const [filter_strings, setFilterStrings] = useState({
  //   cleaning_fee:'',
  //   cleaning_date:'',
  //   distance:4
  // })


  

  const givenLocation = { latitude: currentUser.location.latitude, longitude: currentUser.location.longitude }; // Cleaner location 

  const maxDistanceKm = 3.9; // Maximum distance in kilometers

  const convertKmToMiles = (km) => km * 0.621371;

  const fetchAllSchedules = async () => {
    try {
      const response = await userService.getAllSchedules();
      const res = response.data;
      console.log("AllJobss...........")
      // console.log(JSON.stringify(res, null, 2))
      console.log("AllJobss...........")
      setLoading(false); // Set loading to false after the delay

      const hostDataWithDistance = res.map(item => {
        const hostLocation = {
          latitude: item.schedule?.apartment_latitude,
          longitude: item.schedule?.apartment_longitude,
        };

        const distanceKm = haversineDistance(givenLocation, hostLocation);
        const distanceMiles = distanceKm * 0.621371; // Convert km to miles

        return {
          ...item.schedule,
          _id:item._id,
          hostId:item.hostInfo._id,
          cleaner_applications:item.cleaner_applications,
          distance: {
            km: distanceKm.toFixed(2),
            miles: distanceMiles.toFixed(2),
          },
        };
      });

      console.log(JSON.stringify(hostDataWithDistance, null, 2));
      console.log("............")
      setAllSchedules(hostDataWithDistance);
    } catch (e) {
      console.log(e);
    }
  };

  // const filterSchedulesByDistance = (location, maxDistanceKm) => {
  //   return allSchedules.filter((schedule) => {
  //     const coord = {
  //       latitude: schedule.apartment_latitude,
  //       longitude: schedule.apartment_longitude,
  //     };

  //     const distanceKm = haversine(location, coord, { unit: 'km' });
  //     console.log(distanceKm);
  //     return distanceKm < maxDistanceKm;
  //   });
    
  // };


  const filterSchedulesByDistance = (location, maxDistanceKm, startDate, endDate, minPrice, maxPrice) => {
  
    return allSchedules.filter((schedule) => {
        const coord = {
            latitude: schedule.apartment_latitude,
            longitude: schedule.apartment_longitude,
        };
       
        const distanceKm = haversine(location, coord, { unit: 'km' });
        const scheduleDate = new Date(schedule.cleaning_date); // Assuming schedule_date is a valid date string
        const isWithinDateRange = scheduleDate >= new Date(startDate) && scheduleDate <= new Date(endDate);

        const isWithinPriceRange = schedule.total_cleaning_fee >= minPrice && schedule.total_cleaning_fee <= maxPrice;

        // return distanceKm < maxDistanceKm && isWithinDateRange && isWithinPriceRange;
        return distanceKm < maxDistanceKm && isWithinPriceRange;
    });
};


  const handleFilters = (a) => {
    //console.log(a)
    setQueryString(a)
    setOpenFilter(false)
  }
  
  // const fetchApplications = async()=>{
  //   const id = "6621daedea1ad279d24a0ad0"
  //   await userService.getAllHostApplications(id).then(response => {
  //       const res = response.data
  //   })
  // }

  useEffect(() => {
    console.log(new Date().toISOString())
    fetchAllSchedules();
    // fetchApplications()
  }, []);


  useEffect(() => {
    
    console.log("Query________")
    console.log(query_strings.highest_cleaning_fee)
    console.log("Query______")
    // const result = filterSchedulesByDistance(givenLocation, maxDistanceKm);
    const filteredSchedules = filterSchedulesByDistance(
      givenLocation,
      // maxDistanceKm,
      query_strings.distance,
      '2024-04-04' , // start date
      '2024-10-21', // end date
      // 30,
      query_strings.lowest_cleaning_fee,
      query_strings.highest_cleaning_fee,
      // 30,  // min price
      // 240  // max price
  );
    setFilteredSchedules(filteredSchedules);
    console.log(filteredSchedules, null, 2)
    console.log("Filtered Schedules:");
    // console.log(JSON.stringify(result, null, 2));
    // console.log(JSON.stringify(currentUser, null, 2)) 
  }, [allSchedules, query_strings]);


  
  
      const singleItem = ({item}) => (
        
        <Animatable.View animation="slideInRight" duration={550}> 
        <CardNoPrimary>
          <ScheduleListItem
            item = {item} 
            currentUser = {currentUser}
          />
        </CardNoPrimary>
      </Animatable.View>
      )
      
      
      const emptyListing = () => (
        // <View style={styles.empty_listing}><Text>No available cleaners found</Text></View>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No Cleaning Jobs Found Nearby</Text>
          <Text style={styles.emptyStateSubtitle}>There are no available cleaning jobs within a 5-mile radius of your location. Try adjusting  your filters or expanding your search radius.</Text>
        </View>
      )

    
      const handleOpenFilter = () => {
        setOpenFilter(true)
      }

      const handleCloseFilter = () => {
        setOpenFilter(false)
      }


      React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <FontAwesome
              name="sliders"
              size={24} 
              color="white" 
              onPress={handleOpenFilter}
              style={{ marginRight: 10 }}
            />
          ),
        });
      }, [navigation]);
    
      
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundColor, marginBottom: 0, marginHorizontal:5 }}>
      
      
      {filteredSchedules.length > 0 ? 
        <>
          <Text style={styles.headerText}>Available Jobs Near You</Text>
          <Text style={styles.subtitleText}>Explore the list of available cleaning jobs within a 5-mile radius of your location.</Text>
        </>
      :

        ""
      }
      
      {loading ? (
          // <ActivityIndicator size="large" color="#0000ff" />
          <View>
            {/* <View>
                <HomeSkeleton width="100%" height={300} />
              </View> */}
            {genericArray.map((item, index) => (
              <Animatable.View animation="slideInLeft" duration={550}>
              
              <View style={{flexDirection: 'row', paddingVertical:5}}>
                {<View style={{flex: 0.18}}>
                  <HomeSkeleton width={50} height={50} variant="circle" />
                </View>
                }
                {<View style={{flex: 0.8}}>
                  <HomeSkeleton width="80%" height={12} />
                  <HomeSkeleton width={160} height={10} />
                  <HomeSkeleton width={120} height={8}  /> 
                  <HomeSkeleton width={120} height={8}  /> 
                  <HomeSkeleton width={120} height={8}  /> 
                </View>
                }
              </View>
              </Animatable.View>
            ))}

        </View>
      ):(
      <FlatList
          data={filteredSchedules}
          // keyExtractor={(item) => item._id.toString()}
          keyExtractor={(item) => item._id}
          renderItem={singleItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent= {
            <EmptyListing
              heading="No Cleaning Jobs Found Nearby"
              subtitle="It seems there are no available cleaning jobs within a 5-mile radius of your location. Check back later or expand your search area."  
            />
          }
      />
      )
    }

        <Modal 
          visible={openFilter}
          animationType="slide" 
          transparent={true}
          // animationType="none" // No animation
          statusBarTranslucent={false}
          // onRequestClose={onClose} // Handle hardware back button on Android
        >
            <FilterExplore 
              filter_strings = {handleFilters}
              close_modal={handleCloseFilter}
            />

        </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
    backgroundColor: "#fff"
  },
  





  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 5,
    marginTop:10
    
  },
  subtitleText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  apartmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.primary,
  },
  distance: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  fee: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  scheduleDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scheduleTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },


  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop:'50%'
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});