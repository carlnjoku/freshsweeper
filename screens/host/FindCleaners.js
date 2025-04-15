
// import React, { useState, useEffect, useCallback, useContext } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, StatusBar } from 'react-native';
// import HeaderWithStatusBar from '../../components/HeaderWithStatusBar';
// import COLORS from '../../constants/colors';
// import { AuthContext } from '../../context/AuthContext';
// import userService from '../../services/userService';
// import GoogleMapAndUsers from '../../components/GoogleMapAndUsers';
// import { Avatar, TextInput, Menu, List, Button, Chip} from 'react-native-paper';
// import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
// import StarRating from '../../components/StarRating';
// import ROUTES from '../../constants/routes';
// import * as Animatable from 'react-native-animatable';
// import { HomeSkeleton } from '../../components/skeleton/HomeSkeleton';
// import moment from 'moment';
// import { useFocusEffect } from '@react-navigation/native';
// import { get_clean_future_schedules } from '../../utils/get_cleaner_future_schedules';
// import { EmptyListingNoButton } from '../../components/EmptyListingNoButton';
// import ScheduleCard from '../../components/ScheduleCard';




// const FindCleaners = ({navigation}) => {

//   const{currentUserId, currentUser} = useContext(AuthContext)

//   const [step, setStep] = useState(1); // Step 1: Apartment, Step 2: Schedule, Step 3: Cleaner
//   const [title, setTitle] = useState("Select an Apartment"); 
//   const [apartments, setApartments] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [cleaners, setCleaners] = useState([]);

//   const [cleaningDate, setCleaningDate] = useState(null);
//   const [cleaningTime, setCleaningTime] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [selectedApartmentId, setSelectedApartmentId] = useState(null);
//   const [apartment_name, setApartmentName] = useState("")
//   const [selectedApartment, setSelectedApartment] = useState(null);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [selectedScheduleId, setSelectedScheduleId] = useState(null);
//   const [errmsg, setErrMsg]= useState(false);


//   const genericArray = new Array(5).fill(null);

//   const fetchApartments =  async() => {
//     await userService.getApartment(currentUserId)
//     .then(response => {
//       const res = response.data
//       setApartments(res)
//       // console.log(res)
      
//   }).catch((err)=> {
//       console.log(err)
//       setErrMsg(true)
//       console.log("error")
//       Alert.alert('Error', "Something went wrong, please try again");
//     })
// }

//   const fetchSchedules = async() => {
//     await userService.getUpcomingSchedulesByHostId(currentUserId)
//     .then(response => {
//         const res = response.data
//         console.log("Dreeeem_______e")
//         // console.log(res)
//         console.log("Dreeeem_______s2")

//         //Filter schedule by apartmentID
//         const filter_result = res.filter(item => item.schedule.apartment_name === apartment_name);
      
//         const future_schedules = get_clean_future_schedules(filter_result)
//         setSchedules(future_schedules)
//         console.log("scheeeeeeeeeeeduley")
//         // console.log(filter_result)
//         console.log("scheeeeeeeeeeedulez")
//     }).catch((err)=> {
//         console.log(err)
//         setErrMsg(true)
//         console.log("error")
//         Alert.alert('Error', "Something went wrong, please try again.");
//       })
//   }

//   useEffect(() => {
//     if (selectedScheduleId) {
//         const fetchCleaners = async () => {
//             setLoading(true);
//             try {
//                 await userService.findCleaners(selectedScheduleId)
//                 .then(response => {
//                   const res = response.data;
//                   setCleaners(res);
//                   console.log("...............t.............")
//                   // console.log(JSON.stringify(res, null, 2))
//                   console.log("............................")
//                 })
                
//             } catch (error) {
//                 console.error('Error fetching cleaners:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCleaners();
//         fetchSchedules()
//     }
// }, [selectedScheduleId, apartment_name]);

//   // Refresh data every time the screen is focused
//   useFocusEffect(
//     useCallback(() => {
//      fetchSchedules()
//      fetchApartments()
     
//    }, [apartment_name])
//  );

//  const renderCleaner = ({item}) => (
        
//   <Animatable.View animation="slideInRight" duration={550}> 
//       <TouchableOpacity style={styles.cleaners_list} 
//         onPress={() => navigation.navigate(ROUTES.cleaner_profile_info, {
//           item:item,
//           selected_schedule:selectedSchedule,
//           selected_scheduleId:selectedScheduleId,
//           hostId:currentUserId,
//           hostFname: currentUser.firstname,
//           hostLname: currentUser.lastname
//         })}
//       >
  
  
//       <View style={{flexDirection: 'row', paddingVertical:5}}>
//           <View style={{flex: 0.12}}>
//               {item.avatar ? 
//                 <Image 
//                     source={{uri:item.avatar}}
//                     style={{height:40, width:40, borderRadius:20, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
//                 />
//                 :

//                 <Avatar.Image
//                     size={40}
//                     source={require('../../assets/default_avatar.png')}
//                     style={{ backgroundColor: COLORS.gray }}
//                 />
//               }
//           </View>
//           <View style={{flex: 0.85}}>
//               <Text bold style={{marginLeft:10, fontSize:15, color:COLORS.secondary, fontWeight:'500'}}>{item.firstname} {item.lastname}</Text>
//               <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.location.city}, {item.location.region} </Text>
//               <Text style={{marginLeft:10, fontSize:12, color:COLORS.gray}}>{item.distance.toFixed(1)} miles away</Text>
//               <View style={{marginLeft:10}}><StarRating /></View>
//           </View>
      
//           {/* {item.label==="Notifications" ? <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}></Text></View> : <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}>  {item.value}</Text></View>} */}
//           <View style={{flex: 0.1, alignItems: 'flex-end'}}><Ionicons name="chevron-forward-outline" color={COLORS.secondary} size={16}></Ionicons></View>
//       </View>
        
//       </TouchableOpacity>
//     </Animatable.View>
//     )


//     const itemSeparator = () => (
      
//       <View style={styles.item_separator}></View>
//     )
    
//     const emptyListing = () => (
//       <View style={styles.empty_listing}><Text>No available cleaners found</Text></View>
//     )

    
//   // Render apartments
//   const renderApartment = ({ item }) => (
//     <TouchableOpacity
//       style={styles.listItem}
//       onPress={() => {
//         setSelectedApartment(item._id);
//         setStep(2);
//         setTitle("Select a Schedule")

//         setSelectedApartmentId(item._id);
//         setSelectedApartment(item);
//         setApartmentName(item.apt_name)
//         setTitle("Select a Schedule")
//         setStep(2);
//       }}
//     >
//       <View style={styles.itemContent}>
//         <View style={{marginRight:10}}>
//           <AntDesign name="home" size={40} color={COLORS.gray}/>
//         </View>
//         <View style={{width:'85%'}}>
//           <Text style={styles.itemText}>{item.apt_name}</Text>
//           <Text style={styles.address}>{item.address}</Text>
//         </View>
//       </View>

//       <View style={styles.room_type_container}>

//         <Chip
//           mode="flat"
//           style={styles.activeChip}
//           textStyle={styles.textChip}
//         >
//           {item.roomDetails[0]['number']} {item.roomDetails[0]['type']}
//         </Chip>
//         <Chip
//           mode="flat"
//           style={styles.activeChip}
//           textStyle={styles.textChip}
//         >
//           {item.roomDetails[1]['number']} {item.roomDetails[1]['type']}
//         </Chip>
//         <Chip
//           mode="flat"
//           style={styles.activeChip}
//           textStyle={styles.textChip}
//         >
//           {item.roomDetails[2]['number']} {item.roomDetails[2]['type']}
//         </Chip>

    
//       </View>
//     </TouchableOpacity>
//   );

//   // Render schedules
//   const renderSchedule = ({ item }) => (
//     <View style={{paddingHorizontal:10}}>
//      {/* <TouchableOpacity
//       style={styles.listItem}
//       onPress={() => {
//         setStep(3);
//         setTitle("Available Cleaners")
//         setSelectedScheduleId(item._id);
//         // setSelectedSchedule(item._id)
//         setSelectedSchedule(item);
//         setCleaningDate(item.schedule.cleaning_date);
//         setCleaningTime(item.schedule.cleaning_time);
//       }}
//     > */}
//      {/* <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>                   
//         <Text style={{marginLeft:0, fontSize:13, color:COLORS.gray}}><AntDesign name="calendar" size={14} color={COLORS.gray}/> {moment(item.schedule?.cleaning_date).format('ddd MMM D')} </Text>
//         <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}><MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.gray} /> {moment(item.schedule?.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
//       </View>
//     </TouchableOpacity> */}
//     <ScheduleCard 
//        onPress={() => {
//         setStep(3);
//         setTitle("Available Cleaners")
//         setSelectedScheduleId(item._id);
//         // setSelectedSchedule(item._id)
//         setSelectedSchedule(item);
//         setCleaningDate(item.schedule.cleaning_date);
//         setCleaningTime(item.schedule.cleaning_time);
//       }}
//         cleaning_date={item.schedule.cleaning_date}
//         cleaning_time={item.schedule.cleaning_time}
//         cleaning_end_time={item.schedule.cleaning_end_time}
//         regular_cleaning={item.schedule.regular_cleaning}
//         extra={item.schedule.extra}
//       />
//     </View>
//   );

//   return (
    
//     <View style={styles.container}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="#ffffff"
//         translucent={false}
//       />
//       <HeaderWithStatusBar title={title} />
//       {step > 1 && (
//         <>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => {
//             if (step === 2) {
//               setTitle("Select Apartment");
//             } else if (step === 3) {
//               setTitle("Select Schedule");
//             } else if (step === 4) {
//               setTitle("Available Cleaners");
//             }
//             setStep(step - 1);
//           }}
//         >
//           <Text style={styles.backButtonText}>Back</Text>
//         </TouchableOpacity>
//         </>
//       )}

//       {step === 1 && (
//         <View style={{ marginVertical:30}}>
//           {/* <Text style={styles.title}></Text> */}
//           <FlatList 
//             data={apartments} 
//             renderItem={renderApartment} 
//             ListEmptyComponent= {<EmptyListingNoButton message="No apartment found" />}
//             keyExtractor={(item) => item.id} 
//           />
//         </View>
//       )}

//       {step === 2 && (
//         <>
//           {/* <Text style={styles.title}></Text> */}
//           <FlatList
//             data={schedules}
//             renderItem={renderSchedule}
//             ListEmptyComponent= {<EmptyListingNoButton message="No new schedule found" />}
//             keyExtractor={(item) => item._id}
//           />
//         </>
//       )}

//       {step === 3 && (
//         <>
//           {loading ? (
            
//             <View>
//               <View>
//                   <HomeSkeleton width="100%" height={300} />
//               </View>
//               {genericArray.map((item, index) => (
//                 <Animatable.View animation="slideInLeft" duration={550}>
                
//                 <View style={{flexDirection: 'row', paddingVertical:5}}>
//                   {<View style={{flex: 0.18}}>
//                     <HomeSkeleton width={50} height={50} variant="circle" />
//                   </View>
//                   }
//                   {<View style={{flex: 0.8}}>
//                     <HomeSkeleton width="80%" height={12} />
//                     <HomeSkeleton width={160} height={10} />
//                     <HomeSkeleton width={120} height={8}  /> 
//                   </View>
//                   }
//                 </View>
//                 </Animatable.View>
//               ))}

//             </View>
//           ) : (
//             <>
//                 {selectedApartment && (
                    
//                       <>
//                       <GoogleMapAndUsers 
//                         users={cleaners}
//                         apartment_name ={selectedApartment.apt_name}
//                         apartment_address={selectedApartment.address}
//                         apartment_latitude={selectedApartment.latitude}
//                         apartment_longitude={selectedApartment.longitude} 
//                       />
                      
//                       <View style={styles.location_calendar_block}>
//                         <View style={styles.calender}>
//                           <Text style={{fontSize:12}}>{moment(cleaningDate).format('ddd MMM DD')}</Text>
//                           <Text style={{fontSize:11}}>{cleaningTime}</Text>
//                         </View>
//                         <View style={styles.addre1}>
//                           <Text style={styles.headline1}>{selectedApartment.apt_name} </Text>
//                           <Text style={styles.tagline1}>{selectedApartment.address}</Text>
//                         </View>
//                       </View>

//                     </>
//                 )}
                  
            
//                   <View style={styles.cleaners_container}>
//                     <FlatList
//                         data={cleaners}
//                         renderItem={renderCleaner}
//                         ItemSeparatorComponent={itemSeparator}
//                         showsVerticalScrollIndicator={false}
//                         ListEmptyComponent= {emptyListing}
//                     />
//                   </View>
                
//             </>
//         )}
//       </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   listItem: {
//     padding: 15,
//     marginVertical: 8,
//     marginHorizontal:10,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   itemText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   itemSubText: {
//     fontSize: 14,
//     color: '#555',
//   },
//   address:{
//     fontSize: 14,
//     color: '#555',
//   },
//   room_type:{
//     fontSize: 12,
//     color: '#555',
//   },
//   // backButton: {
//   //   position: 'absolute',
//   //   top: 20,
//   //   left: 10,
//   //   zIndex: 10,
//   //   paddingVertical: 5,
//   //   paddingHorizontal:10,
//   //   backgroundColor: COLORS.gray,
//   //   borderRadius: 5,
//   // },
//   backButton: {
//     position: 'absolute',
//     top: '8%', // Centers vertically within the header
//     left: 10, // Adjust for horizontal alignment
//     transform: [{ translateY: -12 }], // Fine-tune centering vertically
//     zIndex: 10,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     backgroundColor: COLORS.gray,
//     borderRadius: 5,
//   },
//   backButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   room_type_container:{
//     flexDirection:'row',
//     justifyContent:'space-between',
//     alignItems:'center',
//     marginTop:10,
//     width:'100%'
//   },
//   activeChip: {
//     backgroundColor: COLORS.primary_light_1,
//     borderRadius:50
//     // borderColor:COLORS.black,
//   },
//   itemContent:{
//     flexDirection:'row',
//     alignItems:'center',
//   },
//   location_calendar_block:{
//     flexDirection:'row',
//     justifyContent:'center',
//     height:60,
//     borderRadius:0,
//     borderWidth:0.5,
//     borderColor:COLORS.light_gray,
//     marginBottom:20
//   },
//   addre1:{
//     flex:0.8,
//     paddingHorizontal:10
//   },
//   calender:{
//     flex:0.2,
//     padding:10,
//     backgroundColor:COLORS.light_gray_1,
//     borderBottomLeftRadius:0,
//     borderTopLeftRadius:5,
//     alignItems:'center'
//   },
//   headline1: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 0,
//     marginTop:7,
// },
// tagline1: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 16,
// },
// cleaners_container:{
//   marginHorizontal:10
// },
// empty_listing: {
//   flex:1,
//   justifyContent:'center',
//   alignItems:'center',
//   marginTop:'35%'
// },

// item_separator : {
// marginTop:5,
// marginBottom:5,
// height:1,
// width:"100%",
// backgroundColor:"#E4E4E4",
// },
  
// });

// export default FindCleaners;




// import React, { useState, useEffect, useCallback, useContext } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList,Image, ActivityIndicator, StatusBar } from 'react-native';
// import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
// import { Feather } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import COLORS from '../../constants/colors';
// import moment from 'moment';
// import userService from '../../services/userService';
// import { useFocusEffect } from '@react-navigation/native';

// import { AuthContext } from '../../context/AuthContext';
// import GoogleMapAndUsers from '../../components/GoogleMapAndUsers';
// import { Avatar, TextInput, Menu, List, Button, Chip} from 'react-native-paper';
// import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
// import StarRating from '../../components/StarRating';
// import ROUTES from '../../constants/routes';
// import * as Animatable from 'react-native-animatable';
// import { HomeSkeleton } from '../../components/skeleton/HomeSkeleton';

// // import { useFocusEffect } from '@react-navigation/native';
// import { get_clean_future_schedules } from '../../utils/get_cleaner_future_schedules';
// import CleanerItem from '../../components/cleaner/CleanerItem';
// // import { EmptyListingNoButton } from '../../components/EmptyListingNoButton';
// // import ScheduleCard from '../../components/ScheduleCard';


// const FindCleaners = ({navigation}) => {

//   const{currentUserId, currentUser} = useContext(AuthContext)

//   const genericArray = new Array(5).fill(null);

//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [apartments, setApartments] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [cleaners, setCleaners] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedScheduleId, setSelectedScheduleId] = useState(null);
//   const [apartment_name, setApartmentName] = useState("")
//   const [selectedApartment, setSelectedApartment] = useState(null);
//   const [errmsg, setErrMsg]= useState(false);
  
//   // const navigation = useNavigation();

//   // Mock data
//   const properties = [
//     { id: 1, name: 'Downtownd Apartment', type: 'Apartment', beds: 2, baths: 2 },
//     { id: 2, name: 'Suburban House', type: 'House', beds: 4, baths: 3 }
//   ];

//   // const schedules = [
//   //   { id: 1, date: '2023-08-15', time: '09:00 AM', duration: '3h' },
//   //   { id: 2, date: '2023-08-16', time: '02:00 PM', duration: '4h' }
//   // ];

//     const fetchApartments =  async() => {
//     await userService.getApartment(currentUserId)
//     .then(response => {
//       const res = response.data
//       setApartments(res)
//       // console.log(res)
      
//   }).catch((err)=> {
//       console.log(err)
//       setErrMsg(true)
//       console.log("error")
//       Alert.alert('Error', "Something went wrong, please try agains");
//     })
// }
 
//   const fetchSchedules = async() => {
//     await userService.getUpcomingSchedulesByHostId(currentUserId)
//     .then(response => {
//         const res = response.data
//         console.log("Dreeeem________e")
//         console.log(res)
//         console.log("Dreeeem_______s2")

//         //Filter schedule by apartmentID
//         const filter_result = res.filter(item => item.schedule.apartment_name === selectedProperty?.apt_name);
      
//         const future_schedules = get_clean_future_schedules(filter_result)
//         setSchedules(future_schedules)
//         console.log("scheeeeeeeeeeeduley1")
//         console.log(filter_result)

//         console.log("scheeeeeeeeeeedulez")
//     }).catch((err)=> {
//         console.log(err)
//         setErrMsg(true)
//         console.log("error")
//         Alert.alert('Error', "Something went wrong, please try again..");
//       })
//   }

//   useEffect(() => {
//     if (selectedSchedule?._id) {
//         const fetchCleaners = async () => {
//             setLoading(true);
//             try {
//                 await userService.findCleaners(selectedSchedule?._id)
//                 .then(response => {
//                   const res = response.data;
//                   setCleaners(res);
//                   console.log("...............t............2")
//                   // console.log(JSON.stringify(res, null, 2))
//                   console.log("...........................14")
//                 })
                
//             } catch (error) {
//                 console.error('Error fetching cleaners:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCleaners();
//         fetchSchedules()
//     }
// }, [selectedScheduleId, apartment_name]);

//   // Refresh data every time the screen is focused
//   useFocusEffect(
//     useCallback(() => {
//      fetchSchedules()
//      fetchApartments()
     
//    }, [apartment_name])
//  );

//      const itemSeparator = () => (
      
//       <View style={styles.item_separator}></View>
//     )
    
//     const emptyListing = () => (
//       <View style={styles.empty_listing}><Text>No available cleaners found</Text></View>
//     )

//   const renderCleaner = ({item}) => (
        
//   <Animatable.View animation="slideInRight" duration={550}> 
//    <View style={{margin:10}}>
//       <CleanerItem 
//           item={item}
//           selected_schedule={selectedSchedule}
//           selected_scheduleId={selectedSchedule._id}
//           hostId={currentUserId}
//           hostFname = {currentUser.firstname}
//           hostLname = {currentUser.lastname}
//       />
//       {/* <TouchableOpacity style={styles.cleaners_list} 
//         onPress={() => navigation.navigate(ROUTES.cleaner_profile_info, {
//           item:item,
//           selected_schedule:selectedSchedule,
//           selected_scheduleId:selectedSchedule._id,
//           hostId:currentUserId,
//           hostFname: currentUser.firstname,
//           hostLname: currentUser.lastname
//         })}
//       >
  
  
//       <View style={{flexDirection: 'row', paddingVertical:5}}>
//           <View style={{flex: 0.12}}>
//               {item?.avatar ? 
//                 <Image 
//                     source={{uri:item?.avatar}}
//                     style={{height:40, width:40, borderRadius:20, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
//                 />
//                 :

//                 <Avatar.Image
//                     size={40}
//                     source={require('../../assets/default_avatar.png')}
//                     style={{ backgroundColor: COLORS.gray }}
//                 />
//               }
//           </View>
//           <View style={{flex: 0.85}}>
//               <Text bold style={{marginLeft:10, fontSize:15, color:COLORS.secondary, fontWeight:'500'}}>{item?.firstname} {item?.lastname}</Text>
//               <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item?.location?.city}, {item?.location?.region} </Text>
//               <Text style={{marginLeft:10, fontSize:12, color:COLORS.gray}}>{item?.distance.toFixed(1)} miles away</Text>
//               <View style={{marginLeft:10}}><StarRating /></View>
//           </View>
      
          
//           <View style={{flex: 0.1, alignItems: 'flex-end'}}><Ionicons name="chevron-forward-outline" color={COLORS.secondary} size={16}></Ionicons></View>
//       </View>
        
//       </TouchableOpacity> */}
//       </View>
//     </Animatable.View>
//     )
// // alert(selectedProperty?.latitude)
//   const handleSearch = async () => {
//     setLoading(true);
//     // Simulated API call
//     setTimeout(() => {
//       setCleaners([
//         { 
//           id: 1, 
//           name: 'CleanPro Team', 
//           rating: 4.9, 
//           jobs: 120, 
//           distance: 2.3,
//           image: 'https://example.com/cleaner1.jpg'
//         },
//         // ... more cleaners
//       ]);
//       setLoading(false);
//       setCurrentStep(3);
//     }, 1500);
//   };

//   const StepIndicator = ({ step, current }) => (
//     <View style={[
//       styles.stepCircle,
//       current >= step ? styles.activeStep : styles.inactiveStep
//     ]}>
//       <Text style={styles.stepText}>{step}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => currentStep > 1 ? setCurrentStep(s => s - 1) : navigation.goBack()}>
//           <Feather name="arrow-left" size={24} color="#333" />
//         </TouchableOpacity>
//         <View style={styles.stepsContainer}>
//           {[1, 2, 3].map(step => (
//             <StepIndicator key={step} step={step} current={currentStep} />
//           ))}
//         </View>
//       </View>

//       {/* Content */}
//       <Animated.View style={styles.content}>
//         {currentStep === 1 && (
//           <Animated.View entering={FadeIn} exiting={FadeOut}>
//             <Text style={styles.stepTitle}>Select Property</Text>
//             <ScrollView contentContainerStyle={styles.propertiesContainer}>
//               {apartments.map(property => (
//                 <TouchableOpacity
//                   key={property._id}
//                   style={[
//                     styles.propertyCard,
//                     selectedProperty?._id === property._id && styles.selectedProperty
//                   ]}
//                   onPress={() => setSelectedProperty(property)}
//                 >
//                   <Feather name="home" size={24} color="#4F46E5" />
//                   <Text style={styles.propertyName}>{property.apt_name}</Text>
//                   <Text style={styles.propertyDetails}>
//                     {property.type} • {property?.beds} beds • {property?.baths} baths
//                   </Text>
//                   {selectedProperty?._id === property?._id && (
//                     <View style={styles.checkBadge}>
//                       <Feather name="check" size={16} color="white" />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </Animated.View>
//         )}

//         {currentStep === 2 && (
//           <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
//             <Text style={styles.stepTitle}>Choose Schedule</Text>
//             <ScrollView contentContainerStyle={styles.schedulesContainer}>
//               {schedules.map(schedule => (
//                 <TouchableOpacity
//                   key={schedule._id}
//                   style={[
//                     styles.scheduleCard,
//                     selectedSchedule?._id === schedule.schedule._id && styles.selectedSchedule
//                   ]}
//                   onPress={() => setSelectedSchedule(schedule)}
//                 >
//                   <View style={styles.scheduleIcon}>
//                     <Feather name="calendar" size={24} color="#4F46E5" />
//                   </View>
                  
//                   <View style={styles.scheduleDetails}>
//                     <Text style={styles.scheduleDate}>
//                       {moment(schedule?.schedule?.cleaning_date).format('ddd, MMM D')}
//                     </Text>
//                     {/* <Text style={styles.scheduleTime}>
//                       {schedule?.cleaning_time} • {schedule?.cleaning_time}
//                     </Text> */}
//                   </View>

//                   {selectedSchedule?._id === schedule?._id && (
//                     <View style={styles.checkBadge}>
//                       <Feather name="check" size={16} color="white" />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </Animated.View>
//         )}

//         {currentStep === 3 && (
//           <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
//             {/* <Text style={styles.stepTitle}>Available Cleaners</Text> */}
//             {loading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#4F46E5" />
//                 <Text style={styles.loadingText}>Searching for best matches...</Text>
//               </View>
//             ) : (
//               <>
//               <StatusBar translucent={false} backgroundColor={COLORS.white}  barStyle="dark-content"/>
//               <ScrollView contentContainerStyle={styles.cleanersContainer}>
//                   <View>
//             {/* <View>
//               <HomeSkeleton width="100%" height={300} />
//             </View> */}

//             {/* {genericArray.map((item, index) => (
//               <Animatable.View key={index} animation="slideInLeft" duration={550}>
//                 <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
//                   <View style={{ flex: 0.18 }}>
//                     <HomeSkeleton width={50} height={50} variant="circle" />
//                   </View>
//                   <View style={{ flex: 0.8 }}>
//                     <HomeSkeleton width="80%" height={12} />
//                     <HomeSkeleton width={160} height={10} />
//                     <HomeSkeleton width={120} height={8} />
//                   </View>
//                 </View>
//               </Animatable.View>
//             ))} */}
//           </View>

//           {selectedProperty ? (
//             <>
//               {/* Google Map & Users */}
//               <GoogleMapAndUsers
//                 users={cleaners}
//                 apartment_name={selectedProperty?.apt_name}
//                 apartment_address={selectedProperty?.address}
//                 apartment_latitude={selectedProperty?.latitude}
//                 apartment_longitude={selectedProperty?.longitude}
//               />

//               {/* Location & Calendar Blockss */}
//               <View style={styles.location_calendar_block}>
//                 <View style={styles.calender}>
//                   <Text style={{ fontSize: 12 }}>
//                     {moment(selectedSchedule.schedule.cleaning_date).format('ddd MMM DD')}
//                   </Text>
//                   <Text style={{ fontSize: 11 }}>{selectedSchedule.schedule.cleaning_time}</Text>
//                 </View>

//                 <View style={styles.addre1}>
//                   <Text style={styles.headline1}>{selectedProperty.apt_name}</Text>
//                   <Text style={styles.tagline1}>{selectedProperty.address}</Text>
//                 </View>
//               </View>

//               {/* Cleaners Lists */}
//               <View style={styles.cleaners_container}>
//                 <FlatList
//                   data={cleaners}
//                   renderItem={renderCleaner}
//                   ItemSeparatorComponent={itemSeparator}
//                   showsVerticalScrollIndicator={false}
//                   ListEmptyComponent={emptyListing}
//                 />
//               </View>
//             </>
//           ) : null}
//           </ScrollView>
//           </>
//             )}
//           </Animated.View>
//         )}
//       </Animated.View>

//       {/* Footer */}
//       <View style={styles.footer}>
//         {currentStep < 3 ? (
//           <TouchableOpacity
//             style={[
//               styles.nextButton,
//               (!selectedProperty || (currentStep === 2 && !selectedSchedule)) && styles.disabledButton
//             ]}
//             disabled={!selectedProperty || (currentStep === 2 && !selectedSchedule)}
//             onPress={() => {
//               if (currentStep === 2) handleSearch();
//               setCurrentStep(s => s + 1);
//             }}
//           >
//             <Text style={styles.buttonText}>
//               {currentStep === 1 ? 'Next: Choose Schedules' : 'Find Cleaners'}
//             </Text>
//             <Feather name="arrow-right" size={20} color="white" />
//           </TouchableOpacity>
//           // <TouchableOpacity
//           //   style={[
//           //     styles.nextButton,
//           //     (!selectedSchedule) && styles.disabledButton
//           //   ]}
//           //   disabled={!selectedSchedule}
//           //   onPress={handleSearch}
//           // >
//           //   <Text style={styles.buttonText}>Find Cleaners</Text>
//           //   <Feather name="search" size={20} color="white" />
//           // </TouchableOpacity>
//         ) : null}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   stepsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     justifyContent: 'center',
//     gap: 8,
//   },
//   stepCircle: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   activeStep: {
//     backgroundColor: COLORS.primary,
//   },
//   inactiveStep: {
//     backgroundColor: '#e2e8f0',
//   },
//   stepText: {
//     color: 'white',
//     fontWeight: '500',
//   },
//   content: {
//     flex: 1,
//     padding: 0,
//   },
//   stepTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     marginBottom: 24,
//     color: '#1a1a1a',
//   },
//   propertiesContainer: {
//     gap: 16,
//   },
//   propertyCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   selectedProperty: {
//     borderColor: COLORS.primary,
//     backgroundColor: COLORS.primary_light_2,
//   },
//   checkBadge: {
//     position: 'absolute',
//     top: -8,
//     right: -8,
//     backgroundColor: COLORS.primary,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   schedulesContainer: {
//     gap: 16,
//   },
//   scheduleCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 2,
//     borderColor: 'transparent',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   selectedSchedule: {
//     borderColor: '#4F46E5',
//     backgroundColor: '#eef2ff',
//   },
//   scheduleIcon: {
//     backgroundColor: '#e0e7ff',
//     borderRadius: 8,
//     padding: 12,
//     marginRight: 16,
//   },
//   scheduleDetails: {
//     flex: 1,
//   },
//   scheduleDate: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   scheduleTime: {
//     fontSize: 14,
//     color: '#666',
//   },
//   // Shared check badge
//   checkBadge: {
//     position: 'absolute',
//     top: -8,
//     right: -8,
//     backgroundColor: '#4F46E5',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // Updated footer button
//   nextButton: {
//     backgroundColor: COLORS.deepBlue,
//     borderRadius: 0,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 12,
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   disabledButton: {
//     backgroundColor: '#e2e8f0',
//     shadowColor: 'transparent',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//     location_calendar_block:{
//     flexDirection:'row',
//     justifyContent:'center',
//     height:60,
//     borderRadius:0,
//     borderWidth:0.5,
//     borderColor:COLORS.light_gray,
//     marginBottom:20
//   },
//   addre1:{
//     flex:0.8,
//     paddingHorizontal:10
//   },
//     calender:{
//     flex:0.2,
//     padding:10,
//     backgroundColor:COLORS.light_gray_1,
//     borderBottomLeftRadius:0,
//     borderTopLeftRadius:5,
//     alignItems:'center'
//   },
//     headline1: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 0,
//     marginTop:7,
//   },
//   tagline1: {
//       fontSize: 14,
//       color: '#555',
//       marginBottom: 16,
//   },
// });

// export default FindCleaners;











import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import COLORS from '../../constants/colors';
import CleanerItem from '../../components/cleaner/CleanerItem';
import GoogleMapAndUsers from '../../components/GoogleMapAndUsers';
import { HomeSkeleton } from '../../components/skeleton/HomeSkeleton';
import * as Animatable from 'react-native-animatable';
import { AntDesign } from '@expo/vector-icons';
import { Avatar, TextInput, Menu, List, Button, Chip} from 'react-native-paper';
import ScheduleCard from '../../components/ScheduleCard';
import ROUTES from '../../constants/routes';

const FindCleaners = ({ navigation }) => {
  const { currentUserId, currentUser } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(false);

  const genericArray = new Array(5).fill(null);

  // // Fetch initial data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [apartmentsRes] = await Promise.all([
  //         userService.getApartment(currentUserId),
  //       ]);
  //       setApartments(apartmentsRes.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, [currentUserId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apartmentsRes] = await Promise.all([
          userService.getApartment(currentUserId),
        ]);
        
        if (!apartmentsRes.data || apartmentsRes.data.length === 0) {
          navigation.replace(ROUTES.host_dashboard); // Redirect to dashboard
          return;
        }
  
        setApartments(apartmentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [currentUserId, navigation]);


  // Fetch schedules when property is selected
  useEffect(() => {
    const fetchPropertySchedules = async () => {
      if (!selectedProperty) return;
      
      try {
        const schedulesRes = await userService.getUpcomingSchedulesByHostId(currentUserId);
        const filtered = schedulesRes.data.filter(
          item => item.schedule.apartment_name === selectedProperty.apt_name
        );
        setSchedules(filtered);
        // Clear selected schedule when property changes
        setSelectedSchedule(null);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };
    
    fetchPropertySchedules();
  }, [selectedProperty, currentUserId]);

  // Fetch cleaners when schedule is selected
  useEffect(() => {
    const fetchScheduleCleaners = async () => {
      if (!selectedSchedule) return;
      
      setLoading(true);
      try {
        
        const cleanersRes = await userService.findCleaners(selectedSchedule._id);
        setCleaners(cleanersRes.data);
      } catch (error) {
        console.error('Error fetching cleaners:', error);
      } finally {
        setLoading(false);
      }
    };
    
   
    const timeout = setTimeout(() => {
      fetchScheduleCleaners();
    }, 2000);
  
    return () => clearTimeout(timeout); // Cleanup function tos clear timeout if `selectedSchedule` changes before timeout completes
  }, [selectedSchedule]);

  // Add this cleanup effect
useEffect(() => {
  return () => {
      // Reset state when component unmounts
      setCurrentStep(1);
      setSelectedProperty(null);
      setSelectedSchedule(null);
  };
}, []);

  const handleStepNavigation = () => {
    if (currentStep === 1 && selectedProperty) {
      setCurrentStep(2);
    }
    if (currentStep === 2 && selectedSchedule) {
      setCurrentStep(3);
    }
  };

  

  const renderPropertyItem = ({ item }) => (
    <View style={{marginHorizontal:15}}>
    <TouchableOpacity
      style={[
        styles.card,
        selectedProperty?._id === item._id && styles.selectedCard
      ]}
      onPress={() => setSelectedProperty(item)}
    >
      
      {selectedProperty?._id === item._id && (
        <View style={styles.checkBadge}>
          <Feather name="check" size={16} color="white" />
        </View>
      )}

      <View style={styles.itemContent}>
        <View style={{marginRight:10}}>
          <AntDesign name="home" size={40} color={COLORS.gray}/>
        </View>
        <View style={{width:'85%'}}>
          <Text style={styles.cardTitle}>{item.apt_name}</Text>
          <Text style={styles.address}>{item.address}</Text>
        </View>
      </View>

      <View style={styles.room_type_container}>

        <Chip
          mode="flat"
          style={styles.activeChip}
          textStyle={styles.textChip}
        >
          {item.roomDetails[0]['number']} {item.roomDetails[0]['type']}
        </Chip>
        <Chip
          mode="flat"
          style={styles.activeChip}
          textStyle={styles.textChip}
        >
          {item.roomDetails[1]['number']} {item.roomDetails[1]['type']}
        </Chip>
        <Chip
          mode="flat"
          style={styles.activeChip}
          textStyle={styles.textChip}
        >
          {item.roomDetails[2]['number']} {item.roomDetails[2]['type']}
        </Chip>

    
      </View>
    </TouchableOpacity>
    
    </View>
 
  );

  const renderScheduleItem = ({ item }) => (
    <View style={{marginHorizontal:15}}>
    <TouchableOpacity
      style={[
        styles.card,
        styles.scheduleCard,
        selectedSchedule?._id === item._id && styles.selectedCard
      ]}
      onPress={() => setSelectedSchedule(item)}
    >
      <View style={styles.scheduleDetails}>
        <View style={styles.scheduleIcon}>
          <Feather name="calendar" size={24} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.cardTitle}>
            {moment(item.schedule.cleaning_date).format('ddd, MMM D')}
          </Text>
          <Text style={styles.cardSubtitle}>
            {moment(item.schedule.cleaning_time, 'h:mm:ss A').format('h:mm A')}
          </Text>
        </View>
      </View>
      {selectedSchedule?._id === item._id && (
        <View style={styles.checkBadge}>
          <Feather name="check" size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
    </View>
  );

  const renderCleanerItem = ({ item }) => (
    <View style={{margin:10}}>
    <CleanerItem 
      item={item}
      selected_schedule={selectedSchedule}
      selected_scheduleId={selectedSchedule._id}
      hostId={currentUserId}
      hostFname = {currentUser.firstname}
      hostLname = {currentUser.lastname}
    />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => currentStep > 1 ? setCurrentStep(s => s - 1) : navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <View style={styles.stepIndicatorContainer}>
          {[1, 2, 3].map(step => (
            <View
              key={step}
              style={[
                styles.stepIndicator,
                currentStep >= step && styles.activeStepIndicator
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {currentStep === 1 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text style={styles.sectionTitle}>Select Property</Text>
            <FlatList
              data={apartments}
              renderItem={renderPropertyItem}
              keyExtractor={item => item._id}
              scrollEnabled={false}
            />
          </Animated.View>
        )}

        {currentStep === 2 && (
          <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
            <Text style={styles.sectionTitle}>Choose Schedule</Text>
            {schedules.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="calendar" size={40} color={COLORS.gray} />
                <Text style={styles.emptyText}>No available schedules for this property</Text>
              </View>
            ) : (
              <FlatList
                data={schedules}
                renderItem={renderScheduleItem}
                keyExtractor={item => item._id}
                scrollEnabled={false}
              />
            )}
          </Animated.View>
        )}

        {currentStep === 3 && (
          <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
            <GoogleMapAndUsers
              users={cleaners}
              apartment_name={selectedProperty?.apt_name}
              apartment_address={selectedProperty?.address}
              apartment_latitude={selectedProperty?.latitude}
              apartment_longitude={selectedProperty?.longitude}
            />
            {/* Location & Calendar Blockss */}
               <View style={styles.location_calendar_block}>
                 <View style={styles.calender}>
                   <Text style={{ fontSize: 12 }}>
                     {moment(selectedSchedule.schedule.cleaning_date).format('ddd MMM DD')}
                   </Text>
                   <Text style={{ fontSize: 11 }}>{selectedSchedule.schedule.cleaning_time}</Text>
                 </View>

                 <View style={styles.addre1}>
                   <Text style={styles.headline1}>{selectedProperty.apt_name}</Text>
                   <Text style={styles.tagline1}>{selectedProperty.address}</Text>
                 </View>
               </View>
            {loading ? (
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
              <FlatList
                data={cleaners}
                renderItem={renderCleanerItem}
                keyExtractor={item => item._id}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No available cleaners found</Text>
                }
                scrollEnabled={false}
              />
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Footer Navigation */}
      {currentStep < 3 && (
        <TouchableOpacity
        style={[
          styles.nextButton,
          (currentStep === 1 && !selectedProperty) || 
          (currentStep === 2 && (schedules.length === 0 || !selectedSchedule)) && 
          styles.disabledButton
        ]}
        disabled={
          (currentStep === 1 && !selectedProperty) || 
          (currentStep === 2 && (schedules.length === 0 || !selectedSchedule))
        }
        onPress={handleStepNavigation}
      >
        <Text style={styles.buttonText}>
          {currentStep === 1 ? 'Next: Choose Schedule' : 'Find Cleaners'}
        </Text>
        <Feather name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  stepIndicator: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.lightGray,
  },
  activeStepIndicator: {
    backgroundColor: COLORS.primary,
  },
  content: {
    padding: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    // marginBottom: 24,
    marginHorizontal:15,
    marginVertical:20
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  checkBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  scheduleDetails: {
    marginTop: 8,
    flexDirection:'row'
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.gray,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.gray,
    marginTop: 24,
  },
  location_calendar_block:{
    flexDirection:'row',
    justifyContent:'center',
    height:60,
    borderRadius:0,
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
    borderBottomLeftRadius:0,
    borderTopLeftRadius:5,
    alignItems:'center'
  },
    headline1: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 0,
    marginTop:7,
  },
  tagline1: {
      fontSize: 14,
      color: '#555',
      marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  room_type_container:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:10,
    width:'100%'
  },
  activeChip: {
    backgroundColor: COLORS.light_gray_1,
    borderRadius:50
    // borderColor:COLORS.black,
  },
  textChip: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.gray, // Custom text color
  },
  itemContent:{
    flexDirection:'row',
    alignItems:'center',
  },
  address:{
    fontSize: 13,
    color: '#555',
  },
  scheduleIcon: {
    backgroundColor: COLORS.primary_light_1,
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
  },
});

export default FindCleaners;

