// import React, { useContext, useEffect,useState } from 'react';
// import Text from '../../components/Text';
// import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
// import COLORS from '../../constants/colors';
// import userService from '../../services/userService';
// import Card from '../../components/Card';
// import CardColored from '../../components/CardColored';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AuthContext } from '../../context/AuthContext';
// import * as ImagePicker from 'expo-image-picker';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Button from '../../components/Button';
// import UpcomingScheduleListItem from '../../components/cleaner/UpcomingScheduleListItem';
// import OfferListItem from '../../components/cleaner/OfferListtem';
// import HorizontalList from '../../components/HorizontalDate';
// import GoogleDirections from '../../components/GoogleDirections';
// import CameraScreen from '../../components/Selfie';


// export default function Dashboard() {

  
//   const {currentUserId, logout} = useContext(AuthContext)

//   const[firstname, setFirstname] = useState("")
//   const[lastname, setLastname] = useState("")
//   const[username, setUsername] = useState("")
//   const[avatar, setAvatar] = useState("")
//   const[isOpenImages, setIsOpenImages] = useState(false);
//   const[images, setImages] = React.useState([])
//   const[upcoming_schedule, setUpcomingSchedule] = React.useState([])


//     useEffect(()=> {
//         fetchUser()
//         fetchAssignTasks()
//         fetchRequests()
//     },[])

//     const onSubmit = async() => {
//       const data = {
//         photo_type:"after_photos",
//         scheduleId:"65fa4a0711524e9fec7c0648",
//         images:images
//       }

//       await userService.uploadTaskPhotos(data)
//       .then(response => {
//         const res = response.data;
//         console.log(res)
//       }).catch((err) => {
//         console.log(err)
//       })
//     }

//     const fetchRequests = async() => {
//       try {
//         await userService.getMyCleaningRequest(currentUserId)
//          .then(response => {
//            const res = response.data
//           //  setUpcomingSchedule(res)
//           console.log("yrequeststtttttttttttiiinnngggtttree")
//            console.log(res)
//            console.log("yrequeststtttttttttttiiinnnggglllyl")
//          })
         
//        } catch(e) {
//          // error reading valuee
//          console.log(e)
//        }
//     }
//     const fetchAssignTasks = async() => {
//       try {
//        await userService.getMySchedules(currentUserId)
//         .then(response => {
//           const res = response.data
//           setUpcomingSchedule(res)
//           console.log(res)
//         })
        
//       } catch(e) {
//         // error reading valuee
//         console.log(e)
//       }
//     }

    
//     const renderThumbnails = ({ item, drag, isActive }) => (
//         <TouchableOpacity
//           disabled={isActive}
//           style={[
//             styles.rowItem,
//             { backgroundColor: isActive ? COLORS.gray : item.backgroundColor },
//           ]}
//         >
          
//           <Image 
//             source={{uri:item.file}} 
//             style={styles.thumbnails} 
//             resizeMode="cover" 
//           />
//         </TouchableOpacity>
      
        
//       )

//     const pickImage = async () => {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection:true,
//         mediaType: 'photo',
//         base64: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
  
//       if (!result.cancelled) {
      
//         let new_results = result.assets
      
//         // console.log(new_results)
//         new_results.forEach((i) => {

//           let imgSrc = "data:image/png;base64," + i.base64;
//           images.push({filename:i.uri.replace('file:///data/user/0/host.exp.exponent/cache/ImagePicker/', ''), file:imgSrc })
          
//         })

//         // setImageErrors("")
//         setIsOpenImages(true)
//       }
//     };
      
//       const fetchUser = async () => {
//         try {
          
//           // setLoading(true)
          
//           await userService.getUser(currentUserId)
//           .then(response=> {
//             const res = response.data
//             console.log("__________________")
//             // alert(res.res)
//             console.log("__________________")
//             alert(res.firstname)
//             console.log(res.firstname)
//             setUsername(res.username)
//             setFirstname(res.firstname)
//             setLastname(res.lastname)
//           })
      
//           // setLoading(false)
    
//         } catch(e) {
//           // error reading value
//           console.log(e)
//         }
//       }
//       const singleItem = (item) =>  (
//         <UpcomingScheduleListItem item={item} />
//       )
//       const emptyListing = () => (
//         <Text>No listings found</Text>
//       )
//       const itemSeparator = () => (
//         <View style={styles.line}></View>
//       )
//   return (
//     <SafeAreaView
//           style={{
//             flex:1,
//             backgroundColor:COLORS.backgroundColor,
//             // justifyContent:"center",
//             // alignItems:"center",
//             marginBottom:0,

//           }}
//         >
//           <ScrollView>
//           <StatusBar translucent backgroundColor="transparent" />
//           <View>
//             <View style={styles.earning}>
//             <Text style={styles.amount}>$ 500.00</Text>
//               <Text style={styles.earning_title}>Current Earning</Text>
//             </View>
            
//           </View>
          
     
//       <View>
        
//         <HorizontalList />
//         <Card>
//             <FlatList 
//               data={upcoming_schedule} // Display only the specified number of items
//               renderItem = {singleItem}
//               ListHeaderComponent={<Text bold style={{fontSize:16}}>Upcoming Schedules</Text>}
//               ListHeaderComponentStyle={styles.list_header}
//               ListEmptyComponent= {emptyListing}
//               ItemSeparatorComponent={itemSeparator}
//               keyExtractor={(item, index)=> item.key}
//               numColumns={1}
//               showsVerticalScrollIndicator={false}
//               horizontal={false}
//             />
//         </Card>
//         {/* <OfferListItem upcoming_schedule={upcoming_schedule} /> */}
//       </View>
      
//     <Card>
//         <View style={styles.container}>
//         <Text onPress={logout}>Logout</Text>
//             <Text bold style={{fontSize:18, color:"#00394c"}}>My Dashboard</Text>
//             <Text>Upcoming Cleaning(Table- Cleaning Type, Date, Time & Property)</Text>
//             <Text>Quick Action Buttons (Accept new Jobs, Update Availability,submit feedback ) </Text>
//             <Text>Earning History</Text>
//             <Text>Performance Metrics {firstname} {lastname}</Text>
//             {/* <Text style={{ fontFamily: 'Roboto-Bold' }}>Hello, world!</Text> */}
//             <Text onPress={logout}>Logout</Text>
           
//         </View>
//     </Card>
//     <CameraScreen />
//     <Text>Camera</Text>
//     <Card>
        
//     </Card>
    
//     <CardColored
//         color="primary"
//     >
//         <View style={styles.container}>
//             <Text bold style={{fontSize:20, fontWeight:'600', color:COLORS.white}}>Current Tasks</Text>
//             <Text style={{color:COLORS.white}}>I have some documents to share with you in the meantime.</Text>
//         </View>
//     </CardColored>
//     </ScrollView>
//     </SafeAreaView>
//   )
// }


// const styles = StyleSheet.create({
//     container:{
//         width:"100%",
//         // backgroundColor:"#fff"
//     },
//     title_container:{
//       marginTop:40,
//       marginLeft:20
//     },
//     title:{
//       fontSize:18,
//     },
//     uploadButton:{
//         width:'100%',
//         alignSelf:'center',
//         marginTop:0,
//         marginBottom:10,
//         padding:20,
//         height:80, 
//         backgroundColor: COLORS.primary_light_1,  
//         borderStyle:'dashed',
//         borderWidth:2,
//         borderColor:COLORS.primary,
//         borderRadius:8, 
//         display: 'flex',
//         alignItems: 'center', 
//         justifyContent: 'center'
//       },
//       thumbnails:{
//         width:80,
//         height:80,
//         borderRadius:5,
//         margin:5
//       },
//       list_header: {
//         fontWeight:'500',
//         marginBottom:10
//       },
//       line:{
//         borderBottomWidth:0.7,
//         borderBottomColor: COLORS.light_gray_1,
//         marginBottom:5
//       },
//       earning:{
//         justifyContent:'center',
//         alignItems:'center',
//         height:180,
//         backgroundColor:COLORS.primary
//       },
//       earning_title:{
//         fontSize:16,
//         color:COLORS.white
//       },
//       amount:{
//         fontSize:34,
//         fontWeight:'bold',
//         color:COLORS.white
//       }
// })






















// import React, { useContext, useEffect, useState } from 'react';
// import Text from '../../components/Text';
// import { SafeAreaView, StyleSheet, StatusBar, FlatList, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
// import COLORS from '../../constants/colors';
// import userService from '../../services/userService';
// import Card from '../../components/Card';
// import CardColored from '../../components/CardColored';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AuthContext } from '../../context/AuthContext';
// import * as ImagePicker from 'expo-image-picker';
// import Button from '../../components/Button';
// import UpcomingScheduleListItem from '../../components/cleaner/UpcomingScheduleListItem';
// import OfferListItem from '../../components/cleaner/OfferListtem';
// import HorizontalList from '../../components/HorizontalDate';
// import GoogleDirections from '../../components/GoogleDirections';
// import CameraScreen from '../../components/Selfie';
// import CleaningRequestItem from '../../components/cleaner/CleaningRequestItem';
// import ROUTES from '../../constants/routes';
// import CardNoPrimary from '../../components/CardNoPrimary';

// export default function Dashboard({navigation}) {
//   const { currentUserId, logout } = useContext(AuthContext);
//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [username, setUsername] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [isOpenImages, setIsOpenImages] = useState(false);
//   const [images, setImages] = React.useState([]);
//   const [upcoming_schedule, setUpcomingSchedule] = React.useState([]);
//   const [cleaning_requests, SetCleaningRequests] = React.useState([]);
//   const [modalVisible, setModalVisible] = useState(false);

//   // const truncatedItems = items.slice(0, 4);
//   useEffect(() => {
//     fetchUser();
//     fetchAssignTasks();
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       await userService.getMyCleaningRequest(currentUserId).then((response) => {
//         const res = response.data;
//         console.log("requuueeeeeeeeeeeeeeeeeest")
//         console.log(JSON.stringify(res, null,2));
//         console.log("requuueeeeeeeeeeeeeeeeeest")
//         SetCleaningRequests(res)
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const fetchAssignTasks = async () => {
//     try {
//       await userService.getMySchedules(currentUserId).then((response) => {
//         const res = response.data;
//         setUpcomingSchedule(res);
//         console.log(res);
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const fetchUser = async () => {
//     try {
//       await userService.getUser(currentUserId).then((response) => {
//         const res = response.data;
//         setUsername(res.username);
//         setFirstname(res.firstname);
//         setLastname(res.lastname);
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };


//   const singleItem = (item) =>  (
//     <UpcomingScheduleListItem item={item} />
//   )
//   const singleItem1 = (item) =>  (
//     <CleaningRequestItem item={item} />
//   )

//   const renderItem = ({ item }) => {
//     switch (item.type) {
//       case 'earning':
//         return (
//           <View style={styles.earning}>
//             <Text style={styles.amount}>$ 500.00</Text>
//             <Text style={styles.earning_title}>Current Earning</Text>
//           </View>
//         );
//       case 'horizontalList':
//         return <HorizontalList />;

//       case 'cleaning_requests':
//       return(
//         <View style={{marginHorizontal:10}}>
//         <CardNoPrimary>
//             <FlatList 
//               data={cleaning_requests.slice(0, 4)}
//               renderItem = {singleItem1}
//               ListHeaderComponent={<Text bold style={{ fontSize: 16 }}>New cleaning requests</Text>}
//               ListHeaderComponentStyle={styles.list_header}
//               ListEmptyComponent={<Text>No listings found</Text>}
//               ItemSeparatorComponent={() => <View style={styles.line}></View>}
//               keyExtractor={(item) => item.key}
//               numColumns={1}
//               showsVerticalScrollIndicator={false}
//               horizontal={false}
//             />
          
//             <View style={styles.see_more}>
//               <View>
                
//               </View>
//               <View style={styles.itemRight}>
//                 <TouchableOpacity onPress={() => navigation.navigate(ROUTES.cleaner_all_requests, { item : cleaning_requests })}>
//                   <Text style={{ color:COLORS.primary, marginTop: 10 }}>View All</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
            
//           </CardNoPrimary>
//         </View>
//       )
//       case 'upcomingSchedule':
//         return (
//           <View style={{marginHorizontal:10}}>
//             <CardNoPrimary>
          
//             <FlatList 
//               data={upcoming_schedule}
//               renderItem = {singleItem}
//               ListHeaderComponent={<Text bold style={{ fontSize: 16 }}>Upcoming Schedules</Text>}
//               ListHeaderComponentStyle={styles.list_header}
//               ListEmptyComponent={<Text>No listings found</Text>}
//               ItemSeparatorComponent={() => <View style={styles.line}></View>}
//               keyExtractor={(item) => item.key}
//               numColumns={1}
//               showsVerticalScrollIndicator={false}
//               horizontal={false}
//             />
            
//           </CardNoPrimary>
//         </View>
//         );
//       case 'logout':
//         return (
//           <View style={{marginHorizontal:10}}>
//           <CardNoPrimary>
//             <View style={styles.container}>
//               <Text onPress={logout}>Logout</Text>
//               <Text bold style={{ fontSize: 18, color: "#00394c" }}>My Dashboard</Text>
//               <Text>Performance Metrics {firstname} {lastname}</Text>
//               <Text onPress={logout}>Logout</Text>
//             </View>
//           </CardNoPrimary>
//           </View>
//         );
//       case 'camera':
//         return <CameraScreen />;
//       case 'coloredCard':
//         return (
//           <View style={{marginHorizontal:10}}>
//           <CardColored color="primary">
//             <View style={styles.container}>
//               <Text bold style={{ fontSize: 20, fontWeight: '600', color: COLORS.white }}>Current Tasks</Text>
//               <Text style={{ color: COLORS.white }}>I have some document to share with you in the meantime.</Text>
//             </View>
//           </CardColored>
//           </View>
//         );
//       default:
//         return null;
//     }
//   };

//   const data = [
//     { type: 'earning' },
//     // { type: 'horizontalList' },
//     { type: 'cleaning_requests' },
//     { type: 'upcomingSchedule' },
//     { type: 'logout' },
//     { type: 'camera' },
//     { type: 'coloredCard' },
//   ];

//   return (
//     <SafeAreaView style={{ flex: 1,  backgroundColor: COLORS.backgroundColor }}>
//       <StatusBar translucent backgroundColor="transparent" />
      
//         <FlatList
//           data={data}
//           renderItem={renderItem}
//           keyExtractor={(item, index) => index.toString()}
//         />
      
      
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//   },
//   rowItem: {
//     flexDirection: 'row',
//     padding: 10,
//   },
//   thumbnails: {
//     width: 80,
//     height: 80,
//     borderRadius: 5,
//     margin: 5,
//   },
//   list_header: {
//     fontWeight: '500',
//     marginBottom: 10,
//   },
//   line: {
//     borderBottomWidth: 0.7,
//     borderBottomColor: COLORS.light_gray_1,
//     marginBottom: 5,
//   },
//   earning: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 180,
//     backgroundColor: COLORS.primary,
//   },
//   earning_title: {
//     fontSize: 16,
//     color: COLORS.white,
//   },
//   amount: {
//     fontSize: 34,
//     fontWeight: 'bold',
//     color: COLORS.white,
//   },
//   see_more: {
//     flex: 1,
//     flexDirection: 'row', // Set the main axis to be horizontal
//     justifyContent: 'space-between', // Align items along the main axis
//     alignItems: 'center', // Align items along the cross axis (center vertically)
//     padding: 0,
//   },
//   itemLeft: {
//     backgroundColor: 'lightgray',
//     // padding: 10,
//   },
//   itemRight: {
//     alignSelf: 'flex-end', // Align this item to the right within the parent view
//   },
// });




import React, {useRef, useEffect, useContext, useState} from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, ActivityIndicator, FlatList, Animated, PanResponder, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../constants/routes';
import UpcomingScheduleListItem from '../../components/cleaner/UpcomingScheduleListItem'
import CleaningRequestItem from '../../components/cleaner/CleaningRequestItem';
import CardNoPrimary from '../../components/CardNoPrimary';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import { useFocusEffect } from '@react-navigation/native';
import { verification_items } from '../../data';
const cleanerData = {
  firstName: "Zuess",
  // Sample weekly earnings in USD
  weeklyEarnings: 260.0, 

  // Total jobs completed by the cleaner
  totalJobs: 12, 

  // Average rating out of 5
  averageRating: 4.6, 

  // Upcoming jobs array
  upcomingJobs: [
    {
      propertyName: "Ocean View Apartment",
      date: "2024-11-02",
      time: "10:00 AM",
      address: "123 Beachfront Ave, Miami, FL",
    },
    {
      propertyName: "City Loft",
      date: "2024-11-04",
      time: "2:00 PM",
      address: "456 Skyline Blvd, New York, NY",
    },
    {
      propertyName: "Mountain Retreat Cabin",
      date: "2024-11-06",
      time: "9:00 AM",
      address: "789 Summit Dr, Denver, CO",
    },
  ],
  jobRequests: [
    {
      requestId: "REQ001",
      hostName: "John Smith",
      propertyName: "Seaside Villa",
      dateRequested: "2024-11-01",
      details: "General cleaning, linen change, and inventory check.",
    },
    {
      requestId: "REQ002",
      hostName: "Alice Johnson",
      propertyName: "Luxury Downtown Condo",
      dateRequested: "2024-11-03",
      details: "Deep cleaning and carpet washing.",
    },
  ],
  contact: {},
  schedule:["Carl"]
};

const CleanerDashboard = () => {
  const { weeklyEarnings, totalJobs, averageRating, upcomingJobs } = cleanerData;
  const navigation = useNavigation();
  
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;


  const { currentUserId, currentUser, logout } = useContext(AuthContext);

  
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isOpenImages, setIsOpenImages] = useState(false);
  const [images, setImages] = React.useState([]);
  const [upcoming_schedule, setUpcomingSchedule] = React.useState([]);
  const [cleaning_requests, SetCleaningRequests] = React.useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [weekly_earning, setWeeklyEarning] = useState(0);
  const [accountId, setAccountId] = useState(null);
  const [shouldOnboard, setShouldOnboard] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const [ratings, setCleanerRatings] = useState([]); // Track loading state
  const [location, setLocation] = useState(""); // Track loading state
  


  // Check if the profile is complete
  const isProfileComplete = (obj) => Object.keys(obj).length === 0;


  useEffect(() => { 
    // alert(currentUser.white)
    // navigation.navigate(ROUTES.cleaner_verification);
    
    // if (!isProfileComplete(cleanerData?.contact)) {
    //   // Redirect to profile setup screen if profile is incomplete
    //   navigation.navigate(ROUTES.cleaner_profile);
    //   // navigation.navigate(ROUTES.cleaner_verification);
    // }

  }, [isProfileComplete, navigation]);

  // useEffect(() => {
  //   fetchUser();
  //   fetchAssignTasks();
  //   fetchRequests();
  // },[])

  // Refresh data every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
      fetchAssignTasks();
      fetchRequests();
      fetchWeeklyEarnings()
      fetchCleanerRatings()
    }, [])
  );

  
  const fetchUser = async () => {
    try {
      await userService.getUser(currentUserId).then((response) => {
        const res = response.data;
        setEmail(res.email || "");
        setFirstname(res.firstname || "");
        setLastname(res.lastname || "");
        setAccountStatus(res.stripe_accountStatus || 'not_started');
        setAccountId(res.stripe_account_id)
        setLocation(res.location)
        // Check if onboarding is needed
        // cleaner_payment
        setLoading(false); // Set loading to false once data is fetched
        
        const cleanerData = {
          email:res.email,
          location:res.location,
          stripe_account_id:res.stripe_account_id,
          stripe_accountStatus:res.stripe_accountStatus,
          stripe_id_verification:res.id_verification
        }
    
        
        // Merging logic
        const mergedItems = verification_items.map((item) => {
          let updatedStatus = item.status;
          // alert(item.type)
          // Update status based on type
          if (item.type === "ID_verify") {
            updatedStatus = cleanerData.stripe_id_verification ? "verified" : "not verified";
          } else if (item.type === "payment_onboarding") {
            updatedStatus = cleanerData.stripe_account_id ? "account exists" : "account missing";
          } else if (item.type === "tax_info") {
            updatedStatus = cleanerData.stripe_accountStatus === "Onboarded" ? "completed" : "pending";
          }
        
          // Return merged item
          return {
            ...item,
            status: updatedStatus,
            email: cleanerData.email, // Add email if needed
            location:cleanerData.location,
            stripe_account_id:cleanerData.stripe_account_id
          };
        });
        
        
        // console.log(mergedItems);
        
    
        // if (!currentUser.stripe_account_id || currentUser.stripe_accountStatus !== 'Onboarded' || !res.stripe_tax_info){
        //   navigation.navigate(ROUTES.cleaner_verification,{
        //     verifyItem:mergedItems
        //   })
        // }

      });
    } catch (e) {
      console.log(e);
      setLoading(false); // Set loading to false once data is fetched
    }
  };

      const fetchRequests = async () => {
        try {
          await userService.getMyCleaningRequest(currentUserId).then((response) => {
            const res = response.data;
            console.log("requuueeeeeeeeeeeeeeeeeest")
            // console.log(JSON.stringify(res, null,2));
            console.log("requuueeeeeeeeeeeeeeeeeest")
            SetCleaningRequests(res)
          });
        } catch (e) {
          console.log(e);
          setLoading(false); // Ensure loading state is set to false in case of error
        }
      };

  const fetchAssignTasks = async () => {
    try {
      await userService.getMySchedules(currentUserId).then((response) => {
        const res = response.data;
        setUpcomingSchedule(res);
        console.log("upcomiiiiiiiiiiiiiiiiing")
        // console.log(JSON.stringify(res, null, 2));
        console.log("upcomiiiiiiiiiiiiiiiiing")
      });
    } catch (e) {
      console.log(e);
      setLoading(false); // Ensure loading state is set to false in case of error
    }
  };

  const fetchWeeklyEarnings = async () => {
    try {
      await userService.getWeeklyEarningToDate(currentUserId).then((response) => {
        const res = response.data;
        // setWeeklyEarning(res);
        setWeeklyEarning(res.total_earnings)
        console.log("earning")
        // console.log(JSON.stringify(res, null, 2));
        console.log("upcomiiiiiiiiiiiiiiiiing")
      });
    } catch (e) {
      console.log(e);
      setLoading(false); // Ensure loading state is set to false in case of error
    }
    
  }
  
  const fetchCleanerRatings = async()=> {
    const response = await userService.getCleanerFeedbacks(currentUserId)
    const res =response.data
    setCleanerRatings(response.data.data)
    // alert(response.data.data)
    // console.log("clear ratings", JSON.stringify(response.data.data,null,2))
  }

  const calculateOverallRating = (ratings, cleanerId) => {
    const cleanerRatings = ratings.filter(rating => rating.cleanerId === cleanerId);
  
    if (cleanerRatings.length === 0) {
      return 0;
    }
  
    const totalRating = cleanerRatings.reduce((sum, rating) => sum + rating.averageRating, 0);
    const averageRating = totalRating / cleanerRatings.length;
    
    return averageRating.toFixed(1);  // Returning average rating with two decimal places
  };

  // PanResponder to handle drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          { dy: pan.y }, // Map only vertical movement
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        // Reset to initial position if dragged less than 100 pixels
        if (gestureState.dy < 100) {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        } else {
          // Allow the panel to stay at the dragged position or snap back
          Animated.spring(pan, { toValue: { x: 0, y: gestureState.dy }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const singleItem = (item) =>  (
    <UpcomingScheduleListItem item={item} />
  )
  const singleItem1 = (item) =>  (
    <CleaningRequestItem item={item} />
  )


  const renderItem = ({ item }) => {
    switch (item.type) {

      case 'cleaning_requests':
        if (cleaning_requests.length === 0) return null; // Don't render if no upcoming schedules
        return(
          <View style={styles.section}>
            <FlatList 
              data={cleaning_requests.slice(0, 4)}
              renderItem = {singleItem1}
              ListHeaderComponent={<Text style={styles.title}>New Cleaning Requests</Text>}
              ListHeaderComponentStyle={styles.list_header}
              ListEmptyComponent={<Text>No cleaning request found</Text>}
              ItemSeparatorComponent={() => <View style={styles.line}></View>}
              keyExtractor={(item) => item.key}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              horizontal={false}
            />

          </View>
      )
    
      case 'upcomingSchedule':
        if (upcoming_schedule.length === 0) return null; // Don't render if no upcoming schedules
        return (
          <View style={{marginHorizontal:0}}>
            {/* <CardNoPrimary> */}
          
            <FlatList 
              data={upcoming_schedule}
              renderItem = {singleItem}
              ListHeaderComponent={<Text style={styles.title}>Upcoming Schedules</Text>}
              ListHeaderComponentStyle={styles.list_header}
              ListEmptyComponent={<Text>No upcoming schedules found</Text>}
              ItemSeparatorComponent={() => <View style={styles.line}></View>}
              keyExtractor={(item) => item.key}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              horizontal={false}
            />
            
          {/* </CardNoPrimary> */}
        </View>
        );
  }}

  const data = [
    { type: 'earning' },
    { type: 'cleaning_requests' },
    { type: 'upcomingSchedule' },
    
  ];

  if (loading) {
    return (
      <SafeAreaView style={{flex:1}}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={{ flex: 1,  backgroundColor: COLORS.primary }}>
     <StatusBar translucent backgroundColor="transparent" />
     
          {/* Earnings Snapshot */}
          <View style={styles.earningsContainer}>
            <Text style={styles.earning_title}>Earnings This Week</Text>
            <Text style={styles.earnings}>${weekly_earning.toFixed(2)}</Text>
          </View>

          {/* Metrics Summary */}
          <View style={styles.metricsContainer}>
            <View style={styles.metric}>
              <Icon name="check-circle" size={30} color={COLORS.light_gray_1} />
              <Text style={styles.metricValue}>{totalJobs}</Text>
              <Text style={styles.metricLabel}>Completed Jobs</Text>
            </View>

            <View style={styles.metric}>
              <Icon name="star" size={30} color={COLORS.light_gray_1} />
              {/* <Text style={styles.metricValue}>{averageRating.toFixed(1)}</Text> */}
              <Text style={styles.metricValue}>{calculateOverallRating(ratings, currentUserId)}</Text>
              <Text style={styles.metricLabel}>Average Rating</Text>
            </View>

            <View style={styles.metric}>
              <Icon name="calendar" size={30} color={COLORS.light_gray_1} />
              <Text style={styles.metricValue}>{upcomingJobs.length}</Text>
              <Text style={styles.metricLabel}>Upcoming Jobs</Text>
            </View>
        </View>

    
     {/* Draggable Main Content Container */}
     {/* <Animated.View
        style={[
          styles.mainContent,
          {
            transform: [{ translateY: pan.y.interpolate({
              inputRange: [-300, 0, 300],
              outputRange: [-300, 0, 300],
              extrapolate: 'clamp',
            }) }]
          }
        ]}
        {...panResponder.panHandlers}
      > */}
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text>Lower</Text>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Text onPress={logout}>Logout</Text>

      

      
      {/* Prompt to Accept First Job */}
      {cleanerData.schedule.length == 0 && 
        <View style={styles.section}>
          <Text style={styles.title}>Ready to Get Started?</Text>
          <Text style={styles.motivationalText}>
            Accept your first job to start earning. Jobs will appear here as you begin!
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.cleaner_jobs)} style={styles.startButton}>
            <Text style={styles.startButtonText}>Find Jobss</Text>
          </TouchableOpacity>
        </View>
      }
    </ScrollView>
    {/* </Animated.View> */}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  mainContent: {
    position: 'absolute',
    bottom: 0,
    height: '50%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  header: { marginBottom: 20},
  greeting: { fontSize: 24, fontWeight: 'bold' },
  earningsContainer: {
    // backgroundColor: '#fff',
    padding: 0,
    borderRadius: 10,
    marginBottom: 20,
    marginTop:60,
    alignItems: 'center',
  },
  earning_title:{
    fontSize: 18, marginBottom: 5, color:COLORS.light_gray_1 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color:COLORS.light_gray_1 },
  earnings: { fontSize: 28, color: '#4CAF50', fontWeight: 'bold', color:COLORS.white },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metric: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 24, fontWeight: 'bold', color:COLORS.white },
  metricLabel: { fontSize: 13, color:COLORS.light_gray_1 },
  section: { marginBottom: 20 },
  jobCard: { 
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  jobText: { fontSize: 14, color: '#333' },

  subGreeting: { fontSize: 16, color: '#777', marginTop: 5 },
  noEarningsText: { fontSize: 20, color: '#B0BEC5', fontWeight: 'bold' },
  motivationalText: { marginVertical:10, fontSize: 16, color: '#555', marginBottom: 10 },
  startButton: {
    backgroundColor: COLORS.deepBlue,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop:20
  },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  summarySection: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  section: { marginBottom: 20 },
  jobCard: { padding: 15, backgroundColor: '#f9f9f9', marginVertical: 5 },
  requestCard: { padding: 15, borderRadius: 12, backgroundColor: '#e9f5ff', marginVertical: 5 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  acceptButton: { padding: 10, backgroundColor: '#d4f0d4', borderRadius: 5 },
  rejectButton: { padding: 10, backgroundColor: '#f8d7da', borderRadius: 5 },
});

export default CleanerDashboard;








// import React, {useRef, useEffect} from 'react';
// import { SafeAreaView, StatusBar, View, Text, StyleSheet, Animated, PanResponder, ScrollView, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import COLORS from '../../constants/colors';
// import { useNavigation } from '@react-navigation/native';
// import ROUTES from '../../constants/routes';

// const cleanerData = {
//   firstName: "Zuess",
//   // Sample weekly earnings in USD
//   weeklyEarnings: 260.0, 

//   // Total jobs completed by the cleaner
//   totalJobs: 12, 

//   // Average rating out of 5
//   averageRating: 4.6, 

//   // Upcoming jobs array
//   upcomingJobs: [
//     {
//       propertyName: "Ocean View Apartment",
//       date: "2024-11-02",
//       time: "10:00 AM",
//       address: "123 Beachfront Ave, Miami, FL",
//     },
//     {
//       propertyName: "City Loft",
//       date: "2024-11-04",
//       time: "2:00 PM",
//       address: "456 Skyline Blvd, New York, NY",
//     },
//     {
//       propertyName: "Mountain Retreat Cabin",
//       date: "2024-11-06",
//       time: "9:00 AM",
//       address: "789 Summit Dr, Denver, CO",
//     },
//   ],
//   jobRequests: [
//     {
//       requestId: "REQ001",
//       hostName: "John Smith",
//       propertyName: "Seaside Villa",
//       dateRequested: "2024-11-01",
//       details: "General cleaning, linen change, and inventory check.",
//     },
//     {
//       requestId: "REQ002",
//       hostName: "Alice Johnson",
//       propertyName: "Luxury Downtown Condo",
//       dateRequested: "2024-11-03",
//       details: "Deep cleaning and carpet washing.",
//     },
//   ],
//   contact: {},
//   schedule:["Carl"]
// };
// const CleanerDashboard = () => {
//   const { weeklyEarnings, totalJobs, averageRating, upcomingJobs } = cleanerData;
//   const navigation = useNavigation();
//   const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

//   // Check if the profile is complete
//   // const isProfileComplete = cleanerData?.profileComplete; 
//   const isProfileComplete = (obj) => Object.keys(obj).length === 0;


//   useEffect(() => {
//     if (!isProfileComplete(cleanerData?.contact)) {
//       // Redirect to profile setup screen if profile is incomplete
//       navigation.navigate(ROUTES.cleaner_profile);
//     }
//   }, [isProfileComplete, navigation]);
//   // PanResponder to handle drag gestures
//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: Animated.event(
//         [
//           null,
//           { dy: pan.y }, // Map only vertical movement
//         ],
//         { useNativeDriver: false }
//       ),
//       onPanResponderRelease: (e, gestureState) => {
//         // Reset to initial position if dragged less than 100 pixels
//         if (gestureState.dy < 100) {
//           Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
//         } else {
//           // Allow the panel to stay at the dragged position or snap back
//           Animated.spring(pan, { toValue: { x: 0, y: gestureState.dy }, useNativeDriver: false }).start();
//         }
//       },
//     })
//   ).current;

//   const data = [
//     { type: 'earning' },
//     // { type: 'horizontalList' },
//     { type: 'cleaning_requests' },
//     { type: 'upcomingSchedule' },
//     { type: 'logout' },
//     { type: 'camera' },
//     { type: 'coloredCard' },
//   ];
  
//   return (
//     <SafeAreaView style={{ flex: 1,  backgroundColor: COLORS.primary }}>
//      <StatusBar translucent backgroundColor="transparent" />

//      {/* Earnings Snapshot */}
//      <View style={styles.earningsContainer}>
//         <Text style={styles.earning_title}>Earnings This Week</Text>
//         <Text style={styles.earnings}>${weeklyEarnings.toFixed(2)}</Text>
//       </View>

//       {/* Metrics Summary */}
//       <View style={styles.metricsContainer}>
//         <View style={styles.metric}>
//           <Icon name="check-circle" size={30} color={COLORS.light_gray_1} />
//           <Text style={styles.metricValue}>{totalJobs}</Text>
//           <Text style={styles.metricLabel}>Completed Jobs</Text>
//         </View>

//         <View style={styles.metric}>
//           <Icon name="star" size={30} color={COLORS.light_gray_1} />
//           <Text style={styles.metricValue}>{averageRating.toFixed(1)}</Text>
//           <Text style={styles.metricLabel}>Average Rating</Text>
//         </View>

//         <View style={styles.metric}>
//           <Icon name="calendar" size={30} color={COLORS.light_gray_1} />
//           <Text style={styles.metricValue}>{upcomingJobs.length}</Text>
//           <Text style={styles.metricLabel}>Upcoming Jobs</Text>
//         </View>
//       </View>

//      {/* Draggable Main Content Container */}
//      <Animated.View
//         style={[
//           styles.mainContent,
//           {
//             transform: [{ translateY: pan.y.interpolate({
//               inputRange: [-300, 0, 300],
//               outputRange: [-300, 0, 300],
//               extrapolate: 'clamp',
//             }) }]
//           }
//         ]}
//         {...panResponder.panHandlers}
//       >
//     <ScrollView contentContainerStyle={styles.container}>
      
      
     

//       {/* Upcoming Jobs */}
//       {cleanerData.schedule.length > 0 &&
//       <View style={styles.section}>
//         <Text style={styles.title}>Upcoming Jobs</Text>
//         {upcomingJobs.map((job, index) => (
//           <TouchableOpacity key={index} style={styles.jobCard}>
//             <Text style={styles.jobText}>Property: {job.propertyName}</Text>
//             <Text style={styles.jobText}>Date: {job.date}</Text>
//             <Text style={styles.jobText}>Time: {job.time}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       }

//       {/* Job Requests */}
//       {cleanerData.schedule.length > 0 &&
//       // <View style={styles.section}>
//       //   <Text style={styles.title}>New Job Requests</Text>
//       //   {cleanerData.jobRequests.map((request, index) => (
//       //     <View key={index} style={styles.requestCard}>
//       //       <Text>Host: {request.hostName}</Text>
//       //       <Text>Property: {request.propertyName}</Text>
//       //       <Text>Requested on: {request.dateRequested}</Text>
//       //       <Text>Details: {request.details}</Text>
//       //       <View style={styles.actions}>
//       //         <TouchableOpacity style={styles.acceptButton}>
//       //           <Text>Accept</Text>
//       //         </TouchableOpacity>
//       //         <TouchableOpacity style={styles.rejectButton}>
//       //           <Text>Reject</Text>
//       //         </TouchableOpacity>
//       //       </View>
//       //     </View>
//       //   ))}
//       // </View>
//           <View style={styles.section}>
//             <Text style={styles.title}>New Job Requests</Text>
//             {cleanerData.jobRequests.map((request, index) => (
//               <TouchableOpacity>
//               <View key={index} style={styles.requestCard}>
//                 <View style={styles.requestHeader}>
//                   <Text style={styles.hostName}>{request.hostName}</Text>
//                   <Text style={styles.propertyName}>{request.propertyName}</Text>
//                 </View>
                
//                 <Text style={styles.requestDate}>{request.dateRequested}</Text>
//                 <Text style={styles.requestDetails}>{request.details}</Text>

//                 {/* <View style={styles.actions}>
//                   <TouchableOpacity style={styles.acceptButton}>
//                     <Text style={styles.acceptButtonText}>Accept</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.rejectButton}>
//                     <Text style={styles.rejectButtonText}>Reject</Text>
//                   </TouchableOpacity>
//                 </View> */}
//               </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//       }
      

      

//       {/* Prompt to Accept First Job */}
//       {cleanerData.schedule.length == 0 && 
//         <View style={styles.section}>
//           <Text style={styles.title}>Ready to Get Started?</Text>
//           <Text style={styles.motivationalText}>
//             Accept your first job to start earning. Jobs will appear here as you begin!
//           </Text>
//           <TouchableOpacity onPress={() => navigation.navigate(ROUTES.cleaner_jobs)} style={styles.startButton}>
//             <Text style={styles.startButtonText}>Find Jobs</Text>
//           </TouchableOpacity>
//         </View>
//       }
//     </ScrollView>
//     </Animated.View>
//     </SafeAreaView>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: { padding: 20, backgroundColor: '#fff' },
//   mainContent: {
//     position: 'absolute',
//     bottom: 0,
//     height: '65%',
//     width: '100%',
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingTop: 20,
//   },
//   header: { marginBottom: 20},
//   greeting: { fontSize: 24, fontWeight: 'bold' },
//   earningsContainer: {
//     // backgroundColor: '#fff',
//     padding: 0,
//     borderRadius: 10,
//     marginBottom: 20,
//     marginTop:60,
//     alignItems: 'center',
//   },
//   earning_title:{
//     fontSize: 18, marginBottom: 5, color:COLORS.light_gray_1 
//   },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color:COLORS.light_gray_1 },
//   earnings: { fontSize: 28, color: '#4CAF50', fontWeight: 'bold', color:COLORS.white },
//   metricsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 0,
//   },
//   metric: { alignItems: 'center', flex: 1 },
//   metricValue: { fontSize: 24, fontWeight: 'bold', color:COLORS.white },
//   metricLabel: { fontSize: 14, color:COLORS.light_gray_1 },
//   section: { marginBottom: 20 },
//   jobCard: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   jobText: { fontSize: 14, color: '#333' },

//   subGreeting: { fontSize: 16, color: '#777', marginTop: 5 },
//   noEarningsText: { fontSize: 20, color: '#B0BEC5', fontWeight: 'bold' },
//   motivationalText: { marginVertical:10, fontSize: 16, color: '#555', marginBottom: 10 },
//   startButton: {
//     backgroundColor: COLORS.deepBlue,
//     padding: 15,
//     borderRadius: 50,
//     alignItems: 'center',
//     marginTop:20
//   },
//   startButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

//   summarySection: { marginBottom: 20 },
//   title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   section: { marginBottom: 20 },
//   jobCard: { padding: 15, backgroundColor: '#f9f9f9', marginVertical: 5 },
//   requestCard: { padding: 15, borderRadius: 12, backgroundColor: '#e9f5ff', marginVertical: 5 },
//   actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
//   acceptButton: { padding: 10, backgroundColor: '#d4f0d4', borderRadius: 5 },
//   rejectButton: { padding: 10, backgroundColor: '#f8d7da', borderRadius: 5 },
// });

// export default CleanerDashboard;






