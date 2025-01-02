// import React, { useContext, useEffect, useState } from 'react';
// import Text from '../../components/Text';
// import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
// import userService from '../../services/userService';
// import COLORS from '../../constants/colors';
// import { Avatar, TextInput, Menu, List, Button} from 'react-native-paper';
// import { Ionicons } from '@expo/vector-icons';
// import StarRating from '../../components/StarRating';
// import GoogleMapAndUsers from '../../components/GoogleMapAndUsers';
// import ROUTES from '../../constants/routes';
// import { Picker } from '@react-native-picker/picker';
// import { AuthContext } from '../../context/AuthContext';
// import Loader from '../../components/Loader';
// import * as Animatable from 'react-native-animatable';
// import SkeletonLoading from '../../components/SkeletonLoading';
// import { HomeSkeleton } from '../../components/skeleton/HomeSkeleton';
// import calculateDistance from '../../utils/calculateDistance';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Icon from 'react-native-vector-icons/MaterialIcons';


// export default function FindCleaners({navigation, selectedCoordinate}) {

//   const{currentUserId, currentUser} = useContext(AuthContext)

//   const[isLoading, setIsLoading] = useState(true);
//   const[recommended_cleaners, setRecommendedCleaners] = useState([])
//   const[upcoming_schedules, setUpcomingSchedules] = useState([])
//   const[selected_schedule, setSelectedSchedule] = useState("")
//   const[apartments, setApartments] = useState("")
//   const[apartment_name, setApartmentName] = useState("")
//   const[apartment_address, setApartmentAddress] = useState("")
//   const[latitude, setLatitude] = useState(40.759700775146484)
//   const[longitude, setLongitude] = useState(-74.18360137939453)
//   const[selected_scheduleId, setSelectedScheduleId] = useState("")

//   const [center, setCenter] = useState({
//     latitude: 40.759700775146484,
//     longitude: -74.18360137939453,
//     latitudeDelta: 0.008,
//     longitudeDelta: 0.0041,
//   });

//   const[err_msg, setErrMsg] = useState("")

//   const [visible, setVisible] = useState(false);
//   const [selectedValue, setSelectedValue] = useState('');
//   const [isFocused, setIsFocused] = useState('');

//   const openMenu = () => setVisible(true);
//   const closeMenu = () => setVisible(false);

//     // Function to handle item selection
//     const handleSelect = (value) => {
//       setSelectedValue(value.schedule.apartment_name);
//       setSelectedSchedule(value.schedule);
//       console.log("eeeeeeeeeeeeeee_eeeeeeeeke")
//       console.log(value.schedule)
//       console.log("eeeeeeeeeeeeeee_eeeeeeeee")
//       setApartmentName(value.schedule.apartment_name)
//       setApartmentAddress(value.schedule.address)
//       setLatitude(value.schedule.apartment_latitude)
//       setLongitude(value.schedule.apartment_longitude)
//       setSelectedScheduleId(value._id)



//       if(value){
//         // fetch cleaners closer to the apartment
//         fechRecommendedCleaners(value._id)
//       }
//       closeMenu();
//   };

//   const genericArray = new Array(5).fill(null);

//     const fechRecommendedCleaners = (schId) => {
    
      
//         userService.getRecommendedCleaners(schId)
//         .then(response => {
//             const res = response.data
//             console.log("recommmmmmmmmmmmmedd45")
//             console.log(res)
//             console.log("recommmmmmmmmmmmmedd")
//             setRecommendedCleaners(res)
//             // console.log(res)
//             // setIsLoading(false);
            
//         }).catch((err)=> {
//             console.log(err)
//               setErrMsg(true)
//               console.log("error")
//               Alert.alert('Error', "Something went wrong, please try again");
//           })
          
//         // })
        
        
//     }

//     const fetchSchedules = async() => {
//       await userService.getUpcomingSchedulesByHostId(currentUserId)
//         .then(response => {
//             const res = response.data
//             setUpcomingSchedules(res)
//             console.log(res)
//         }).catch((err)=> {
//             console.log(err)
//             setErrMsg(true)
//             console.log("error")
//             Alert.alert('Error', "Something went wrong, please try again");
//           })
//     }

//     const fetchApartment =  async() => {
//       await userService.getApartment(currentUserId)
//       .then(response => {
//         const res = response.data
        
//         if(res === ''){
//           navigation.navigate(ROUTES.host_home_tab)
          
//         }
//         setApartments(res)
//         console.log(res)
//     }).catch((err)=> {
//         console.log(err)
//         setErrMsg(true)
//         console.log("error")
//         Alert.alert('Error', "Something went wrong, please try again");
//       })
//     }

//     useEffect(()=> {
      
//       fetchApartment()
//       fetchSchedules()
        
//     },[selected_schedule])

//     const singleItem = ({item}) => (
        

//       <TouchableOpacity style={styles.categoryBtn} 
//         onPress={() => navigation.navigate(ROUTES.cleaner_profile_info, {
//           item:item,
//           selected_schedule:selected_schedule,
//           selected_scheduleId:selected_scheduleId,
//           hostId:currentUserId,
//           hostFname: currentUser.firstname,
//           hostLname: currentUser.lastname
//         })}
//       >
  
  
//       <View style={{flexDirection: 'row', paddingVertical:5}}>
//           <View style={{flex: 0.15}}>
//               {/* <Image source={{uri:item.avata}} style={styles.icon_url_style} /> */}
//               {item.avatar ? 
//                       <Image 
//                           source={{uri:item.avatar}}
//                           style={{height:50, width:50, borderRadius:25, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
//                       />
//                       :

//                       <Avatar.Image
//                           size={50}
//                           source={require('../../assets/default_avatar.png')}
//                           style={{ backgroundColor: COLORS.gray }}
//                       />
//                   }
          
//           </View>
//           <View style={{flex: 0.8}}>
//               <Text bold style={{marginLeft:10, fontSize:15, color:COLORS.secondary}}>{item.firstname} {item.lastname}</Text>
//               <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.location.city}, {item.location.region} </Text>
//               <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.distance.toFixed(1)} miles away</Text>
//               <StarRating />
//           </View>
      
//           {/* {item.label==="Notifications" ? <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}></Text></View> : <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}>  {item.value}</Text></View>} */}
//           <View style={{flex: 0.1, alignItems: 'flex-end'}}><Ionicons name="chevron-forward-outline" color={COLORS.secondary} size={16}></Ionicons></View>
//       </View>
        
//       </TouchableOpacity>
//     )


//     const itemSeparator = () => (
      
//       <View style={styles.item_separator}></View>
//     )
//     const emptyListing = () => (
//       <View style={styles.empty_listing}><Text>No cleaners found</Text></View>
//     )


//     // Example usage:
//     const lat1 = 40.72420120239258; // Latitude of start point (e.g., New York)
//     const lon1 = -74.0060; // Longitude of start point
//     const lat2 = 40.7119653; // Latitude of end point (e.g., Los Angeles)
//     const lon2 = -74.2087581; // Longitude of end point

//     const distance = calculateDistance(lat1, lon1, lat2, lon2);

    
// console.log(`Distance: ${distance.toFixed(2)} km`);
//   return (
//     <SafeAreaView
//         style={{
//             flex:1,
//             backgroundColor:COLORS.white,
//       }}
//     >
//         <StatusBar translucent backgroundColor="transparent" />
//         {recommended_cleaners.length > 0 && (
//         <GoogleMapAndUsers 
//           users={recommended_cleaners}
//           apartment_name ={apartment_name}
//           apartment_address={apartment_address}
//           apartment_latitude={latitude}
//           apartment_longitude={longitude}
//           // center={center}

//         />
//         )}
//         <View style={styles.container}>
      
      
//       <View style={styles.container1}>
//         {/* TextInput-styled button */}
//         <TouchableWithoutFeedback
//           onPress={openMenu}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//         >
        

//         <View
//           style={[
//             styles.customButton,
//             isFocused && styles.customButtonFocused
//           ]}
//         >
//           <Text style={styles.dropdownLabel}> {selectedValue? selectedValue : 'Select Apartments'}</Text>
//           <Icon 
//             name= {visible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
//             size={24}
//             color="#333"
//           />
//         </View>
//         </TouchableWithoutFeedback>
//         {/* Menu for the dropdown */}
//         <Menu
//             visible={visible}
//             onDismiss={closeMenu}
//             anchor={
//               <Button onPress={openMenu}></Button>
//             }
//             style={styles.menu} // Optional styling for menu
//             contentStyle={styles.menuContent}
//         >
//             <ScrollView>
//               {/* <Menu.Item title="Option 1" onPress={() => handleSelect('Option 1')} /> */}
//               {upcoming_schedules.map((item, index) => (
//               <Menu.Item 
//                 title={item.schedule.apartment_name} 
//                 onPress={() => handleSelect(item)} 
//                 style={styles.menuItem}
//                 titleStyle={styles.menuItemTitle}
                
//                />
//               ))}
//               {/* <Menu.Item title="Option 3" onPress={() => handleSelect('Option 3')} /> */}
//             </ScrollView>
            
//         </Menu>
        
//     </View>
          
       
         
//       {isLoading && recommended_cleaners.length < 1 && (
       
//           <View>
//             {genericArray.map((item, index) => (
//               <Animatable.View animation="slideInLeft" duration={550}>
//               <View style={{flexDirection: 'row', paddingVertical:5}}>
//                 {<View style={{flex: 0.18}}>
//                   <HomeSkeleton width={50} height={50} variant="circle" />
//                 </View>
//                 }
//                 {<View style={{flex: 0.8}}>
//                   <HomeSkeleton width="80%" height={12} />
//                   <HomeSkeleton width={160} height={10} />
//                   <HomeSkeleton width={120} height={8}  /> 
//                 </View>
//                 }
//               </View>
//               </Animatable.View>
//             ))}
            
//           </View>
//        )
//      }
            
//           <Animatable.View animation="slideInRight" duration={550}>
            
//             <FlatList 
//                 data = {recommended_cleaners}
//                 renderItem = {singleItem}
//                 ListHeaderComponent={
//                   <View>
//                     <Text  style={{fontSize:20, marginBottom:0}}>Cleaners nearby</Text>
//                     <Text  style={{fontSize:14, marginBottom:15, color:COLORS.gray}}>Browse to select cleaner near your apartment</Text>
//                   </View>
//                 }
//                 ListHeaderComponentStyle={styles.list_header}
//                 ListEmptyComponent= {emptyListing}
//                 ItemSeparatorComponent={itemSeparator}
//                 keyExtractor={recommended_cleaners=> recommended_cleaners._id}
//                 numColumns={1}
//                 showsVerticalScrollIndicator={false}
//             /> 
//             </Animatable.View>
//         </View>

//     </SafeAreaView>
//   )
// }


// const styles = StyleSheet.create({
//   container:{
//       margin:15
//   },
//   container1:{
//       margin:0
//   },
//   item_separator : {
//       marginTop:5,
//       marginBottom:5,
//       height:1,
//       width:"100%",
//       backgroundColor:"#E4E4E4",
//       },
//     empty_listing: {
//       display:'flex',
//       justifyContent:'center',
//       alignItems:'center',
//       marginTop:'50%'
//     },
//     textInput: {
//       height: 50, // Adjust height to match your design
//       marginBottom:10, 
//       color:COLORS.gray, 
//       fontSize:16, 
//       backgroundColor:"#fff"
//   },
  
//   menuAnchor: {
//       width: 0,
//       height: 0, // Empty view as anchor
//   },
//   menuContent:{
//     backgroundColor:"#f5f5f5",
//   },
//   menu: {
//     width:"80%",
//     marginTop: 10, // Adjust margin if the menu appears offscreen
//   },
//   menuItem:{
//     paddingVertical:1,
//     fontSize:12
//   },
//   menuItemTitle:{
//     fontSize:14,
//   },
//   icon: {
//     marginRight: 10, // Optional styling for the icon
//   },
//   customButton:{
//     backgroundColor:"#FFFFFF",
//     borderWidth:1,
//     borderRadius:5,
//     borderColor:"#ccc",
//     paddingHorizontal:16,
//     paddingVertical:12,
//     flexDirection:'row',
//     justifyContent:'space-between',
//     alignItems:'center'
//   },
//   customButtonFocused:{
//     borderColor:COLORS.primary,
//     borderWidth:2
//   },
//   dropdownLabel:{
//     fontSize:14
//   }
// })



import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image , ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import GoogleMapAndUsers from '../../components/GoogleMapAndUsers';
import COLORS from '../../constants/colors';
import { Avatar, TextInput, Menu, List, Button} from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import StarRating from '../../components/StarRating';
import ROUTES from '../../constants/routes';
import * as Animatable from 'react-native-animatable';
import { HomeSkeleton } from '../../components/skeleton/HomeSkeleton';
import Icon from 'react-native-vector-icons/Ionicons';  // Import Ionicons from react-native-vector-icons
import moment from 'moment';
import CardNoPrimary from '../../components/CardNoPrimary';
import DraggableOverlay from '../../components/DraggableOverlayTest';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const FindCleaners = ({navigation}) => {

  const{currentUserId, currentUser} = useContext(AuthContext)

  const [step, setStep] = useState('selectApartment');
  const [apartments, setApartments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedApartmentId, setSelectedApartmentId] = useState(null);
  const [apartment_name, setApartmentName] = useState("")
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [cleaningDate, setCleaningDate] = useState(null);
  const [cleaningTime, setCleaningTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);



  const genericArray = new Array(5).fill(null);

  useEffect(() => {
      const fetchApartments =  async() => {
          await userService.getApartment(currentUserId)
          .then(response => {
            const res = response.data
            setApartments(res)
            console.log(res)
        }).catch((err)=> {
            console.log(err)
            setErrMsg(true)
            console.log("error")
            Alert.alert('Error', "Something went wrong, please try again");
          })
      }

      const unsubscribe = navigation.addListener('tabPress', () => {
        // Refresh data or reset state here
        fetchApartments();
    });

    return unsubscribe; // Cleanup subscription
      
  }, [navigation]);

  

  console.log("seleeeeeeeeeeeeeeeeeeeeeeeeeeeeecte")
  console.log(selectedApartment)
  console.log(selectedApartmentId)
  console.log("seleeeeeeeeeeeeeeeeeeeeeeeeeeeeected")
  useEffect(() => {
      if (selectedApartmentId) {
          // const fetchSchedules = async () => {
          //     try {
          //         const response = await axios.get(`https://api.example.com/apartments/${selectedApartment}/schedules`);
          //         setSchedules(response.data);
          //     } catch (error) {
          //         console.error('Error fetching schedules:', error);
          //     }
          // };

          const fetchSchedules = async() => {
            await userService.getUpcomingSchedulesByHostId(currentUserId)
              .then(response => {
                  const res = response.data
                  //Filter schedule by apartmentID
                  const filter_result = res.filter(item => item.schedule.apartment_name === apartment_name);
                  setSchedules(filter_result)
                  
                  console.log("scheeeeeeeeeeedule")
                  console.log(res)
                  console.log("scheeeeeeeeeeedule")
              }).catch((err)=> {
                  console.log(err)
                  setErrMsg(true)
                  console.log("error")
                  Alert.alert('Error', "Something went wrong, please try again");
                })
          }

          fetchSchedules();
      }
  }, [selectedApartmentId]);

  useEffect(() => {
      if (selectedScheduleId) {
          const fetchCleaners = async () => {
              setLoading(true);
              try {
                  await userService.getRecommendedCleaners(selectedScheduleId)
                  .then(response => {
                    const res = response.data;
                    setCleaners(res);
                    console.log("...............t.............")
                    console.log(JSON.stringify(res, null, 2))
                    console.log("............................")
                  })
                  
              } catch (error) {
                  console.error('Error fetching cleaners:', error);
              } finally {
                  setLoading(false);
              }
          };

          fetchCleaners();
      }
  }, [selectedScheduleId]);


  const singleItem = ({item}) => (
        
      <Animatable.View animation="slideInRight" duration={550}> 
          <TouchableOpacity style={styles.categoryBtn} 
            onPress={() => navigation.navigate(ROUTES.cleaner_profile_info, {
              item:item,
              selected_schedule:selectedSchedule,
              selected_scheduleId:selectedScheduleId,
              hostId:currentUserId,
              hostFname: currentUser.firstname,
              hostLname: currentUser.lastname
            })}
          >
      
      
          <View style={{flexDirection: 'row', paddingVertical:5}}>
              <View style={{flex: 0.15}}>
                  {/* <Image source={{uri:item.avata}} style={styles.icon_url_style} /> */}
                  {item.avatar ? 
                          <Image 
                              source={{uri:item.avatar}}
                              style={{height:50, width:50, borderRadius:25, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
                          />
                          :
    
                          <Avatar.Image
                              size={50}
                              source={require('../../assets/default_avatar.png')}
                              style={{ backgroundColor: COLORS.gray }}
                          />
                      }
              
              </View>
              <View style={{flex: 0.8}}>
                  <Text bold style={{marginLeft:10, fontSize:15, color:COLORS.secondary}}>{item.firstname} {item.lastname}</Text>
                  <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.location.city}, {item.location.region} </Text>
                  <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.distance.toFixed(1)} miles away</Text>
                  <StarRating />
              </View>
          
              {/* {item.label==="Notifications" ? <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}></Text></View> : <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}>  {item.value}</Text></View>} */}
              <View style={{flex: 0.1, alignItems: 'flex-end'}}><Ionicons name="chevron-forward-outline" color={COLORS.secondary} size={16}></Ionicons></View>
          </View>
            
          </TouchableOpacity>
        </Animatable.View>
        )
    
    
        const itemSeparator = () => (
          
          <View style={styles.item_separator}></View>
        )
        
        const emptyListing = () => (
          <View style={styles.empty_listing}><Text>No available cleaners found</Text></View>
        )
        const emptyApartment = () => (
          <View style={styles.empty_apartment}>
            <Text>No apartment found</Text>
            <TouchableOpacity 
              style={styles.action_button}
              onPress = {() => navigation.navigate(ROUTES.host_add_apt)}
            >
              <Text style={styles.action_button_color}>Create new apartment</Text>
            </TouchableOpacity>
          </View>
        )
        const emptySchedule = () => (
          <View style={styles.empty_schedule}>
            <Text>No upcoming schedule found</Text>
            <TouchableOpacity 
              style={styles.action_button}
              onPress = {() => navigation.navigate(ROUTES.host_new_booking)}
            >
              <Text style={styles.action_button_color}>Book a schedule</Text>
            </TouchableOpacity>
          </View>
        )
    

  const renderStepContent = () => {
      switch (step) {
          case 'selectApartment':
              return (
                  <View style={styles.container}>
                    <View style={styles.navigator}>
                      <Text style={styles.navigatorText}>Find Cleaner</Text>
                    </View>
                      <Text style={styles.headline}>Choose Your Apartment</Text>
                      <Text style={styles.tagline}>Select the apartment you need cleaning services for.</Text>
                      <FlatList
                          data={apartments}
                          keyExtractor={(item) => item._id.toString()}
                          renderItem={({ item }) => (
                              <TouchableOpacity onPress={() => {
                                  setSelectedApartmentId(item._id);
                                  setSelectedApartment(item);
                                  setApartmentName(item.apt_name)
                                  setStep('selectSchedule');
                              }}>
                                <CardNoPrimary>
                                  <Text style={styles.apartmentName}>{item.apt_name}</Text>
                                  <Text style={styles.apartmentDetails}>{item.address}</Text>
                                </CardNoPrimary>
                              </TouchableOpacity>
                          )}
                          ListEmptyComponent= {emptyApartment}
                          
                      />
                  </View>
              );
          case 'selectSchedule':
              return (
                  <View style={styles.container}>
                    <View style={styles.navigator}>
                      <TouchableOpacity style={styles.backButton} onPress={() => setStep('selectApartment')}>
                          <MaterialCommunityIcons name="arrow-back" size={26} color={COLORS.white}/> 
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                      <Text style={styles.headline}>Select Your Cleaning Schedule</Text>
                      
                    </View>

                      
                      <Text style={styles.tagline}>Choose the schedule that works best for you.</Text>
                      
                      <View style={styles.location_block}>
                        <View style={styles.icon}>
                          <AntDesign name="home" size={40} color={COLORS.gray}/> 
                        </View>
                        <View style={styles.addre}>
                          <Text style={styles.headline1}>{selectedApartment.apt_name} </Text>
                          <Text style={styles.tagline1}>{selectedApartment.address}</Text>
                        </View>
                      </View>

                 
                      <Text style={styles.headline2}> Upcoming Schedules</Text>
                      <FlatList
                          data={schedules}
                          keyExtractor={(item) => item._id.toString()}
                          renderItem={({ item }) => (
                              <TouchableOpacity style={styles.scheduleItem} onPress={() => {
                                  setSelectedScheduleId(item._id);
                                  setSelectedSchedule(item);
                                  setStep('showCleaners');
                                  setCleaningDate(item.schedule.cleaning_date)
                                  setCleaningTime(item.schedule.cleaning_time)
                              }}>
                                  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                    <Text style={styles.scheduleDate}>{item.schedule.cleaning_date}</Text>
                                    <Text style={styles.scheduleTime}>{item.schedule.cleaning_time}</Text>
                                  </View>
                                  {/* <Text>Find Available Cleaners</Text> */}
                              </TouchableOpacity>
                          )}
                          ListEmptyComponent= {emptySchedule}
                      />
                  </View>
              );
          case 'showCleaners':
              return (
                  <View style={styles.container}>
                    <View style={styles.navigator}>
                    <TouchableOpacity style={styles.backButton} onPress={() => setStep('selectSchedule')}>
                           <MaterialCommunityIcons name="close" size={26} color={COLORS.white}/> 
                        </TouchableOpacity>
                    </View>
                      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                      <Text style={styles.headline}>Available Cleaners Nearby</Text>
                        
                      </View>
                      
                      <Text style={styles.tagline}>These cleaners are ready to serve you at your selected time.</Text>
                      
                      {loading ? (
                          // <ActivityIndicator size="large" color="#0000ff" />
                          <View>
                            <View>
                                <HomeSkeleton width="100%" height={300} />
                              </View>
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
                                </View>
                                }
                              </View>
                              </Animatable.View>
                            ))}
            
                        </View>
                      ) : (
                          <>
                              {selectedApartment && (
                                  
                                    <>
                                    <GoogleMapAndUsers 
                                      users={cleaners}
                                      apartment_name ={selectedApartment.apt_name}
                                      apartment_address={selectedApartment.address}
                                      apartment_latitude={selectedApartment.latitude}
                                      apartment_longitude={selectedApartment.longitude} 
                                    />
                                    

                                    <View style={styles.location_calendar_block}>
                                      <View style={styles.calender}>
                                        <Text style={{fontSize:12}}>{moment(cleaningDate).format('ddd MMM DD')} </Text>
                                        <Text style={{fontSize:11}}>{cleaningTime}</Text>
                                      </View>
                                      <View style={styles.addre1}>
                                        <Text style={styles.headline1}>{selectedApartment.apt_name} </Text>
                                        <Text style={styles.tagline1}>{selectedApartment.address}</Text>
                                      </View>
                                    </View>

                                  </>
                              )}
                                <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
                                  <View style={{height:20, width:20, backgroundColor:COLORS.primary, borderRadius:10}}>
                                    <Text style={{textAlign:'center', color:'#fff'}}>{cleaners.length}</Text>
                                  </View>
                                  <View><Text style={styles.results}> Cleaners found</Text></View>
                                </View>
                           
                                
                                <FlatList
                                    data={cleaners}
                                    // keyExtractor={(item) => item._id.toString()}
                                    renderItem={singleItem}
                                    ItemSeparatorComponent={itemSeparator}
                                    showsVerticalScrollIndicator={false}
                                    ListEmptyComponent= {emptyListing}
                                />
                              
                          </>
                      )}
                  </View>
              );
          default:
              return null;
      }
  };

  return (

    
      // <View style={styles.container}>
      //     {renderStepContent()}
      // </View>

<GestureHandlerRootView style={{ flex: 1 }}>
<View style={styles.container}>
  {renderStepContent()}

  {/* DraggableOverlay */}
  {isOverlayVisible && (
    <PanGestureHandler>
      <DraggableOverlay
        onClose={() => setIsOverlayVisible(false)}
        style={styles.overlayContainer}
      >
        <View style={styles.overlayContent}>
          <Text>Overlay Content Here</Text>
          <Button onPress={() => setIsOverlayVisible(false)}>Close Overlay</Button>
        </View>
      </DraggableOverlay>
    </PanGestureHandler>
  )}
</View>
</GestureHandlerRootView>

  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 0,
  },
  navigator:{
    marginTop:30,
    marginBottom:30,
    padding:10,
    backgroundColor:COLORS.primary
  },
  navigatorText:{
    fontSize:20,
    fontWeight:'bold',
    color:"white"
  },
  empty_listing: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:'50%'
  },
  empty_apartment: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:'50%'
  },
  empty_schedule: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:'50%'
  },
  headline: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 0,
  },
  headline1: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 0,
      marginTop:2,
      // textAlign:"center",
      // color:COLORS.primary
  },
  headline2: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      marginTop:-5,
      textAlign:"center",
      color:COLORS.primary
  },
  tagline: {
      fontSize: 16,
      color: '#555',
      marginBottom: 16,
  },
  tagline1: {
      fontSize: 14,
      color: '#555',
      marginBottom: 16,
  },
  apartmentItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  apartmentName: {
      fontSize: 18,
  },
  apartmentAddress:{
    fontSize: 14,
    color: '#555',
  },
  scheduleItem: {
      padding: 16,
      backgroundColor: '#f0f0f0',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
  },
  scheduleTime: {
      fontSize: 14,
  },
  scheduleDate: {
      fontSize: 14,
  },
  map: {
      height: 300,
      marginBottom: 16,
  },
  cleanerItem: {
      padding: 16,
      backgroundColor: '#f0f0f0',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
  },
  cleanerName: {
      fontSize: 18,
  },
  cleanerDistance: {
      fontSize: 14,
      color: '#666',
  },
  item_separator : {
      marginTop:5,
      marginBottom:5,
      height:1,
      width:"100%",
      backgroundColor:"#E4E4E4",
      },
  action_button: {
    padding:10, 
    borderRadius:50,
    margin:10,
    backgroundColor:COLORS.primary,
  },
  action_button_color:{
    color:'white'
  },
  location_block:{
    flexDirection:'row',
    justifyContent:'center',
    height:60,
    borderRadius:5,
    borderWidth:0.5,
    borderColor:COLORS.light_gray,
    marginBottom:20
  },

  addre:{
    flex:0.85,
    paddingHorizontal:10
  },
  icon:{
    flex:0.15,
    padding:10,
    backgroundColor:COLORS.light_gray_1,
    borderBottomLeftRadius:5,
    borderTopLeftRadius:5,
    alignItems:'center'
  },
  location_calendar_block:{
    flexDirection:'row',
    justifyContent:'center',
    height:60,
    borderRadius:5,
    borderWidth:0.5,
    borderColor:COLORS.light_gray,
    marginBottom:20
  },
  addre1:{
    flex:0.8,
    paddingHorizontal:10
  },
  calender:{
    flex:0.2,
    padding:10,
    backgroundColor:COLORS.light_gray_1,
    borderBottomLeftRadius:5,
    borderTopLeftRadius:5,
    alignItems:'center'
  },
  results:{
    fontSize:14,
    marginLeft:5,
    marginBottom:10
  }

});

export default FindCleaners;


