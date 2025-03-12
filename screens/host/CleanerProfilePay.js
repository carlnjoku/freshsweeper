import React, { useContext, useRef, useEffect,useState } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, RefreshControl, Linking,Dimensions,  FlatList, ScrollView, Image, View, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import Button from '../../components/Button';
import {
  get,
  ref,
  set,
  onValue,
  push,
  update,
  snapshot
 } from 'firebase/database'; // Import necessary functions from 'firebase/database'
import { db } from '../../firebase/config';
import { AuthContext } from '../../context/AuthContext';
import COLORS from '../../constants/colors';
import { Avatar } from 'react-native-paper';
// import StarRating from '../../components/StarRating';
// import DraggableOverlay from './DraggableOverlay'; // Import the draggable overlay component
import DraggableOverlay from '../../components/DraggableOverlayTest';
import * as Animatable from 'react-native-animatable';
import AvailabilityDisplay from '../cleaner/AvailabilityDisplay';
import CertificationDisplay from '../cleaner/CertificationDisplay';
import Portfolio from './Portfolio/Portfolio';
import { cleanerPortfolio } from '../../utils/cleanerPortfolio';
import AboutMeDisplay from '../cleaner/AboutMeDisplay';
import userService from '../../services/userService';
import calculateDistance from '../../utils/calculateDistance';
import { SchedulePrice } from '../../components/host/SchedulePrice';
import ROUTES from '../../constants/routes';
import CircularIcon from '../../components/CircularIcon';
import { haversineDistance } from '../../utils/distanceBtwLocation';
import Reviews from '../../components/Reviews';
import Modal from 'react-native-modal';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Entypo'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { calculateOverallRating } from '../../utils/calculate_overall_rating';
import StarRating from 'react-native-star-rating-widget';
import { sendCleaningRequestPushNotification, sendPushNotifications } from '../../utils/sendPushNotification';




const { width, height } = Dimensions.get('window');

const CleanerProfilePay = ({navigation, route}) => {
const{item, selected_schedule, selected_scheduleId, requestId} = route.params

console.log("Iteeeeeeeems", item)
console.log("selected schedule", selected_schedule)
const [visible, setVisible] = React.useState(false);

const {currentUserId, friendsWithLastMessagesUnread, fbaseUser, currentUser, currency} = useContext(AuthContext)
  // const{friendsWithLastMessagesUnread} = useContext(AuthContext)
  // Get distance between host and cleaner location

  const cleanerLocation = { latitude: item?.location.latitude, longitude: item?.location.longitude }; // Cleaner location 
  const scheduleLocation = { latitude: selected_schedule.schedule?.apartment_latitude || selected_schedule?.apartment_latitude, longitude: selected_schedule.schedule?.apartment_longitude || selected_schedule.apartment_longitude }; // schedule location 

  const distanceKm = haversineDistance(cleanerLocation, scheduleLocation);



  const [refreshing, setRefreshing] = useState(false);
  const[selectedUser, setSelectedUser]=useState("")
  const[rating, setRating]=useState("")

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [completed_schedules, setCompletedSchedules] = useState([]);

  const [currentStep, setCurrentStep] = useState(1);
  const [cleaner_chat_reference, setCleanerChatReference] = useState({});
  const [reviews, setReviews] = useState([]);
  const [cleaner_tokens, setCleanerPushTokens] = useState([]);

  

  

  // Function to handle refresh
const handleRefresh = async () => {
  setRefreshing(true);
  try {
    await Promise.all([checkChatroonId(), fetchSelectedUserJobs(), fetchCleanerChatRef(), fetchCleanerFeedbacks(), fetchCleanerPushTokens()]);
  } catch (error) {
    console.error('Error refreshing data:', error);
  } finally {
    setRefreshing(false);
  }
};
  
  useEffect(()=> {
    fetchSelectedUserJobs()
    fetchCleanerChatRef()
    fetchCleanerFeedbacks()

    const filteredData = friendsWithLastMessagesUnread.filter(row => row.schedule === selected_scheduleId && row.userId === item._id);

    // Log or use filteredData as needed
    console.log("L................................l")
    // console.log(filteredData[0]);
    setCleanerChatReference(filteredData[0])
    console.log("L................................l")
    
  },[])

  
  const toggleOverlay = () => {
    setOverlayVisible(prevState => !prevState);
  };

  
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  

  const fetchSelectedUserJobs = async() => {
    const selectedUserId = item._id
    userService.getUserCompletedJobs(selectedUserId)
    .then(response => {
      const res = response.data
      console.log("syyyyyyy")
      // console.log(res)
      setCompletedSchedules(res)
      console.log("syyyyyyy")
    })
  }

  const fetchCleanerChatRef = async() => {
    const cleanerId = item._id
     
    await userService.getCleanerChatReference(cleanerId, selected_scheduleId)
    .then(response => {
      const res = response.data.data
      console.log("syyyyyyy1064")
    //   console.log(res["params"])
      setCleanerChatReference(res["params"])
      console.log("syyyyyyy208")
    })
  }

  const fetchCleanerFeedbacks = async() => {
    const response = await userService.getCleanerFeedbacks(item._id)
    setReviews(response.data.data)
    // console.log(JSON.stringify(response.data.data, null, 2))
  }

  console.log("P..........................son")
  // console.log(cleaner_chat_reference)

  const openExisitingConversation = () => {
    
    navigation.navigate(ROUTES.chat_conversation,{
        selectedUser:cleaner_chat_reference,
        fbaseUser: fbaseUser,
        schedule: selected_schedule.schedule 
    })
  }



  // Example usage:
  const lat1 = 40.7128; // Latitude of start point (e.g., New York)
  const lon1 = -74.0060; // Longitude of start point
  const lat2 = 34.0522; // Latitude of end point (e.g., Los Angeles)
  const lon2 = -118.2437; // Longitude of end point

  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  console.log(`Distance: ${distance.toFixed(2)} km`);


  const openReviews = () => {
    setVisible(true)
  }


  const handleProceedToCheckout = () => {
  
    // console.log(selectedPayments)
    navigation.navigate(ROUTES.host_single_checkout, { 
      cleaning_fee:selected_schedule?.total_cleaning_fee, 
      scheduleId: selected_scheduleId,
      cleanerId: item._id,
      cleaner_stripe_account_id: item.stripe_account_id,
      cleaner_avatar: item.avatar,
      cleaner_firstname: item.firstname,
      cleaner_lastname: item.lastname,
      cleaner_latitude: item.location.latitude,
      cleaner_longitude: item.location.longitude,
      schedule:selected_schedule,
      requestId:requestId
  
    });
  };

 
  
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar translucent backgroundColor={COLORS.primary} />
        <Animatable.View animation="fadeIn" duration={600}>
          <View style={styles.avatar_background}>
            {item.avatar !=="" ? 
            <Avatar.Image
                size={120}
                source={{uri:item.avatar}}
                style={{ backgroundColor: COLORS.gray,  marginBottom:0 }}
            />
            :
            <Avatar.Icon
                size={120}
                icon="account" // Provide a default icon here
                style={styles.avatar}
            />
          }
            <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
            <Text style={styles.location}>{item.location.city}, {item.location.region}</Text>

            <View style={styles.distance}>
            
          </View>
          </View>
        </Animatable.View>

        <View style={styles.address_bar}>
            <View style={styles.addre}>
              <Text style={{color:COLORS.light_gray_1}}>{item?.address || item.contact?.address}</Text>
              {item.distance ? 
                <Text style={{fontSize:13, color:COLORS.light_gray}}>{item.distance.toFixed(1)} Miles away</Text>
                :
                <Text style={{fontSize:13, color:COLORS.light_gray}}>{distanceKm?.toFixed(1)} miles away</Text>
              }
            </View>
        </View>
      <View style={styles.container}>
        {/* Main content of the parent screen */}
        
        <ScrollView style={styles.content}
          refreshControl={ // Step 3: Add RefreshControl
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >

        
        <View style={styles.rating_review}>
            <View>
              <Text bold style={styles.title}>Reviews & Ratings</Text>
              <View style={styles.rating}>
                
                <StarRating
                  rating={calculateOverallRating(reviews, item._id)}
                  onChange={() => {}} // No-op function to disable interaction
                  maxStars={5} // Maximum stars
                  starSize={18} // Size of the stars
                  starStyle={{ marginHorizontal: 0 }} // Customize star spacing
                />
                <Text style={{marginLeft:5}}>{calculateOverallRating(reviews, item._id)}</Text>
              </View>
            </View>
            <View>
              {reviews.length > 0 ? <Text onPress={openReviews} style={{color:COLORS.primary}}>See all {reviews.length} reviews</Text>
              :
              ""}
              
            </View>
        </View>

        <View style={styles.tabsContainer}>
              <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 1 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(1)}>
                {/* <MaterialCommunityIcons name="camera" size={24} color={currentStep === 1 ? COLORS.primary : COLORS.gray} /> */}
                <Text style={styles.tab_text}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 2 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(2)}>
                {/* <MaterialCommunityIcons name="camera" size={24} color={currentStep === 1 ? COLORS.primary : COLORS.gray} /> */}
                <Text style={styles.tab_text}>Availability</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 3 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(3)}>
                {/* <MaterialCommunityIcons name="camera-flip" size={24} color={currentStep === 2 ? COLORS.primary : COLORS.gray} /> */}
                <Text style={styles.tab_text}>License</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 4 ? COLORS.primary :"#f0f0f0"}]} onPress={() => setCurrentStep(4)}>
                {/* <MaterialCommunityIcons name="format-list-checks" size={24} color={currentStep === 3 ? COLORS.primary : COLORS.gray} /> */}
                <Text style={styles.tab_text}>Portfolio</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{padding:0}}>
              {currentStep === 1 && 
              <Animatable.View animation="slideInLeft" duration={600}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                <AboutMeDisplay 
                  mode="display"
                  aboutme={item.aboutme}
                />
                </ScrollView>
                </Animatable.View>
              }
              {currentStep === 2 && 
                <Animatable.View animation="slideInLeft" duration={600}>
                  <AvailabilityDisplay
                    mode="display"
                    availability={item.availability}
                  />
                </Animatable.View>
              }

              {currentStep === 3 && 
              <Animatable.View animation="slideInLeft" duration={600}>
                <CertificationDisplay
                  mode="display"
                  certification={item.certification}
                />
              </Animatable.View>
              }


              {currentStep === 4 &&
              <Animatable.View animation="slideInLeft" duration={600}>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                <Portfolio 
                  portfolio={cleanerPortfolio} 
                  portfolio2={completed_schedules}
                />
                </ScrollView>
              </Animatable.View>
              }

            </View>
        </ScrollView>

        <Modal 
            isVisible={visible} 
            onSwipeComplete={() => setVisible(false)} 
            swipeDirection="down"
            onBackdropPress={() => setVisible(false)}
            style={styles.modal}
            propagateSwipe={false}
            backdropColor="black"       // Set to black or any color
            backdropOpacity={0.1}       // Adjust opacity for transparency
            useNativeDriverForBackdrop={true}
        >
        <View style={styles.modalContent}>

        <View style={styles.modal_header}>
            <View>
              <Text style={styles.header}>Customer Reviews</Text>
              <View style={styles.rating}>
                
                <StarRating
                  rating={calculateOverallRating(reviews, item._id)}
                  onChange={setRating} // Handle rating changes
                  maxStars={5} // Maximum stars
                  starSize={18} // Size of the stars
                  starStyle={{ marginHorizontal: -1 }} // Customize star spacing
                />
                <Text style={{marginLeft:5, color:COLORS.gray}}>{calculateOverallRating(reviews, item._id)}  ({reviews.length} reviews)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeIcon}>
                <MaterialCommunityIcons name="close" size={30} color="gray" />
            </TouchableOpacity>
        </View>
          {openReviews  && (
             <Reviews ratings={reviews} cleanerId={item._id} />
          )}
          
          
        </View>
      </Modal>

      </View>

      <View style={styles.navigation}>
        <View>
        {/* <Text style={{color:COLORS.primary}}>Total Cleaning Fee </Text> */}
        <SchedulePrice 
          currency={currency}
          price={selected_schedule?.total_cleaning_fee}
        />
        </View>
        
        {
                cleaner_chat_reference?.chatroomId ? 
                ""
                :
                <TouchableOpacity 
                  style={{
                    backgroundColor:COLORS.deepBlue,
                    width:120,
                    borderRadius:50,
                    height:40
                  }}
                  title="Pay Now"
                  onPress={handleProceedToCheckout}
                >
                  <Text style={styles.button}>Pay Now</Text>
                </TouchableOpacity>
              }


        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  avatar_background:{
    height:200,
    backgroundColor:COLORS.primary,
    justifyContent:'center',
    alignItems:'center'
  },
  name:{
    marginTop:10,
    fontSize:18,
    color:COLORS.white,
    fontWeight:'bold'
  },
  location:{
    fontSize:14,
    color:"#f8f8f8"
  },
  rating_review:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:10,
    marginHorizontal:10
  },
  rating:{
    flexDirection:'row',
    // justifyContent:'center',
    alignItems:'center'
  },
  location_block:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    height:60,
  },

  addre:{
    flex:0.7,
    padding:10
  },
  distance:{
    flex:0.3,
    padding:10,
    marginBottom:0
   
  },
  tabsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: "#e9e9e9",
    borderLeftColor:"#fff",
    borderRightColor:"#fff",
    marginTop:10
  },
  tab:{
    borderBottomWidth:1,
    borderLeftWidth:0,
    // borderLeftColor:"#fff",
    borderBottomColor: COLORS.primary,
    alignItems:'center',
    marginTop:10,
    paddingHorizontal:26
  },
  tab_text:{
    marginBottom:5,
  },
  communicate:{
    flexDirection:'row',
    justifyContent:'center',

  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end', // Aligns the modal to the bottom
  },
  modalContent: {
    width: width,
    height: height * 0.58, // Makes the modal a half-screen bottom sheet
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalPhoto: {
    width: '100%',
    height: '80%',
  },
  closeIcon: {
    right: 0,
    color:COLORS.light_gray
  },
  modal_header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    paddingBottom:10
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#333',
  },
  address_bar:{
    minHeight:60,
    backgroundColor:COLORS.deepBlue,
    marginTop:-1
  },
  navigation:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:10,
    alignItems:'center',
    backgroundColor:"#fff",
    paddingVertical:15,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 }, // Only top shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3, // Adjust for visibility
  },
  button:{
    alignSelf:'center',
    color:'white',
    paddingTop:10
  },
  avatar: {
    backgroundColor: COLORS.light_gray_1, // Customize background color
  },
});

export default CleanerProfilePay;


// {"cleanerId": undefined, "cleaner_avatar": "https://firebasestorage.googleapis.com/v0/b/fresh-sweeper.appspot.com/o/profile%2Favatar_677f772a223bde045c90c683.jpeg?alt=media&token=91e2d6a9-f9a8-480c-b7d4-db539e884fd7", "cleaner_firstname": "Chinedu", "cleaner_lastname": "Adams", "cleaner_latitude": 40.7325009, "cleaner_longitude": -74.2038853, "cleaner_stripe_account_id": "acct_1QmOuhPiETLEimZj", "cleaning_fee": 147, "requestId": undefined, "schedule": {"address": "819 South 17th Street, Newark, NJ, USA", "apartment_latitude": 40.7273692, "apartment_longitude": -74.212744, "apartment_name": "Luxurious Three Bedrooms Suite ", "aptId": "6789467ab759620d2c153391", "cleaning_date": "2025-03-05", "cleaning_end_time": "15:13:45", "cleaning_time": "11:00:00", "extra": [[Object], [Object], [Object]], "extraTaskTime": 86.25, "regular_cleaning": [[Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object], [Object]], "regular_cleaning_fee": 87, "regular_cleaning_time": 175, "selected_apt_room_type_and_size": [[Object], [Object], [Object]], "selected_extra_fees": 60, "totalPrice": "0", "totalTaskTime": 223.75, "total_cleaning_fee": 147, "total_cleaning_time": 223.75}, "scheduleId": "67c003e3c405dc6c27b97978"}