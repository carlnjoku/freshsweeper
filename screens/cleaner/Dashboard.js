// import React, {useRef, useEffect, useContext, useState} from 'react';
// import { SafeAreaView, StatusBar, View, Text, StyleSheet, ActivityIndicator, FlatList, Animated, PanResponder, ScrollView, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import COLORS from '../../constants/colors';
// import { useNavigation } from '@react-navigation/native';
// import ROUTES from '../../constants/routes';
// import UpcomingScheduleListItem from '../../components/cleaner/UpcomingScheduleListItem'
// import CleaningRequestItem from '../../components/cleaner/CleaningRequestItem';
// import CardNoPrimary from '../../components/CardNoPrimary';
// import { AuthContext } from '../../context/AuthContext';
// import userService from '../../services/userService';
// import { useFocusEffect } from '@react-navigation/native';
// import { verification_items } from '../../data';
// import NoScheduleMessage from '../../components/cleaner/NoScheduleMessage';
// import { get_clean_future_requests } from '../../utils/get_cleaner_future_request';
// import ResetPassword from '../auth/ResetPassword';
// import EmptyApartmentPlaceholder from '../../components/host/EmptyApartmentPlaceholder';
// import { EmptyListingNoButton } from '../../components/EmptyListingNoButton';

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


//   const { currentUserId, currentUser, logout } = useContext(AuthContext);

  
  
//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [email, setEmail] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [isOpenImages, setIsOpenImages] = useState(false);
//   const [images, setImages] = React.useState([]);
//   const [upcoming_schedule, setUpcomingSchedule] = React.useState([]);
//   const [cleaning_requests, setCleaningRequests] = React.useState([]);
//   const [pending_payment, setPendingPayment] = React.useState([]);
//   const [all_cleaning_requests, setAllCleaningRequests] = React.useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [accountStatus, setAccountStatus] = useState(null);
//   const [weekly_earning, setWeeklyEarning] = useState(0);
//   const [accountId, setAccountId] = useState(null);
//   const [shouldOnboard, setShouldOnboard] = useState(false);
//   const [loading, setLoading] = useState(true); // Track loading state
//   const [ratings, setCleanerRatings] = useState([]); // Track loading state
//   const [location, setLocation] = useState(""); // Track loading state
  
//   // const handleUpdateProfile = () => Alert.alert('Navigating to Update Profile...');
//   const handleExploreTips = () => Alert.alert('Navigating to Tips...');
//   const handleContactSupport = () => Alert.alert('Opening Contact Support...');

//   // Check if the profile is complete
//   const isProfileComplete = (obj) => Object.keys(obj).length === 0;


//   const handleUpdateProfile = () => {
//     navigation.navigate(ROUTES.cleaner_profile)
//   }

//   useEffect(() => { 
//     // alert(currentUser.white)
//     // navigation.navigate(ROUTES.cleaner_verification);
    
//     // if (!isProfileComplete(cleanerData?.contact)) {
//     //   // Redirect to profile setup screen if profile is incomplete
//     //   navigation.navigate(ROUTES.cleaner_profile);
//     //   // navigation.navigate(ROUTES.cleaner_verification);
//     // }

//   }, [isProfileComplete, navigation]);

//   // useEffect(() => {
//   //   fetchUser();
//   //   fetchAssignTasks();
//   //   fetchRequests();
//   // },[])

//   // Refresh data every time the screen is focused
//   useFocusEffect(
//     React.useCallback(() => {
//       fetchUser();
//       fetchAssignTasks();
//       fetchRequests();
//       fetchallRequests()
//       fetchPendingPayment()
//       fetchWeeklyEarnings()
//       fetchCleanerRatings()
//     }, [])
//   );

  
  
//   const fetchUser = async () => {
//     try {
//       await userService.getUser(currentUserId).then((response) => {
//         const res = response.data;
  
//         setEmail(res.email || "");
//         setFirstname(res.firstname || "");
//         setLastname(res.lastname || "");
//         setAccountStatus(res.stripe_accountStatus || 'not_started');
//         setAccountId(res.stripe_account_id)
//         setLocation(res.location)
//         // Check if onboarding is needed
//         // cleaner_payment
//         setLoading(false); // Set loading to false once data is fetched
        
//         const cleanerData = {
//           email:res.email,
//           location:res.location,
//           stripe_account_id:res.stripe_account_id,
//           stripe_accountStatus:res.stripe_accountStatus,
//           stripe_id_verification:res.id_verification
//         }
    
        
//         // Merging logic
//         const mergedItems = verification_items.map((item) => {
//           let updatedStatus = item.status;
//           // alert(item.type)
//           // Update status based on type
//           if (item.type === "ID_verify") {
//             updatedStatus = cleanerData.stripe_id_verification ? "verified" : "not verified";
//           } else if (item.type === "payment_onboarding") {
//             updatedStatus = cleanerData.stripe_account_id ? "account exists" : "account missing";
//           } else if (item.type === "tax_info") {
//             updatedStatus = cleanerData.stripe_accountStatus === "Onboarded" ? "completed" : "pending";
//           }
        
//           // Return merged item
//           return {
//             ...item,
//             status: updatedStatus,
//             email: cleanerData.email, // Add email if needed
//             location:cleanerData.location,
//             stripe_account_id:cleanerData.stripe_account_id
//           };
//         });
        
        
//         // console.log(mergedItems);
        
    
//         // if (!currentUser.stripe_account_id || currentUser.stripe_accountStatus !== 'Onboarded' || !res.stripe_tax_info){
//         //   navigation.navigate(ROUTES.cleaner_verification,{
//         //     verifyItem:mergedItems
//         //   })
//         // }

//       });
//     } catch (e) {
//       console.log(e);
//       setLoading(false); // Set loading to false once data is fetched
//     }
//   };

//       const fetchRequests = async () => {
//         try {
//           await userService.getMyCleaningRequest(currentUserId).then((response) => {
//             const res = response.data;
//             // console.log("requuueeeeeeeeeeeeeeeeeest")
//             //  console.log(JSON.stringify(res, null,2));
//             // console.log("requuueeeeeeeeeeeeeeeeeest")

//             // Filter new requests
//             setCleaningRequests(res)

//           });
//         } catch (e) {
//           console.log(e);
//           setLoading(false); // Ensure loading state is set to false in case of error
//         }
//       };
//       const fetchPendingPayment = async () => {
//         try {
//           await userService.getMyCleaningPendingPayment(currentUserId).then((response) => {
//             const res = response.data;
//             console.log("requuueeeeeeeeeeeeeeeeeest")
//              console.log(JSON.stringify(res, null,2));
//             console.log("requuueeeeeeeeeeeeeeeeeest")

//             // Filter for when payment is pending 
//             const pendingPay = res.filter(
//               (request) => request.status === "pending_payment"
//             );
            
//             setPendingPayment(pendingPay)
//           });
//         } catch (e) {
//           console.log(e);
//           setLoading(false); // Ensure loading state is set to false in case of error
//         }
//       };
      
//       const fetchallRequests = async () => {
//         try {
//           await userService.getAllCleaningRequest(currentUserId).then((response) => {
//             const res = response.data;
            
//             // Filter new requests
//             const new_request = get_clean_future_requests(res)
          

//             console.log("requuueeeeeeeeeeeeeeeeeestYY")
//             console.log(JSON.stringify(new_request, null,2));
//             console.log("requuueeeeeeeeeeeeeeeeeestYY")
            
//             // alert(new_request.length)
//             setAllCleaningRequests(new_request)
//           });
//         } catch (e) {
//           console.log(e);
//           setLoading(false); // Ensure loading state is set to false in case of error
//         }
//       };

//   const fetchAssignTasks = async () => {
//     try {
//       await userService.getMySchedules(currentUserId).then((response) => {
//         const res = response.data;
//         setUpcomingSchedule(res);
//         console.log("upcomiiiiiiiiiiiiiiiiing")
//         // console.log(JSON.stringify(res, null, 2));
//         console.log("upcomiiiiiiiiiiiiiiiiing")
//       });
//     } catch (e) {
//       console.log(e);
//       setLoading(false); // Ensure loading state is set to false in case of error
//     }
//   };

//   const fetchWeeklyEarnings = async () => {
//     try {
//       await userService.getWeeklyEarningToDate(currentUserId).then((response) => {
//         const res = response.data;
//         // setWeeklyEarning(res);
//         setWeeklyEarning(res.total_earnings)
//         console.log("earning")
//         // console.log(JSON.stringify(res, null, 2));
//         console.log("upcomiiiiiiiiiiiiiiiiing")
//       });
//     } catch (e) {
//       console.log(e);
//       setLoading(false); // Ensure loading state is set to false in case of error
//     }
    
//   }
  
//   const fetchCleanerRatings = async()=> {
//     const response = await userService.getCleanerFeedbacks(currentUserId)
//     const res =response.data
//     setCleanerRatings(response.data.data)
//     // alert(response.data.data)
//     // console.log("clear ratings", JSON.stringify(response.data.data,null,2))
//   }

//   const calculateOverallRating = (ratings, cleanerId) => {
//     const cleanerRatings = ratings.filter(rating => rating.cleanerId === cleanerId);
  
//     if (cleanerRatings.length === 0) {
//       return 0;
//     }
  
//     const totalRating = cleanerRatings.reduce((sum, rating) => sum + rating.averageRating, 0);
//     const averageRating = totalRating / cleanerRatings.length;
    
//     return averageRating.toFixed(1);  // Returning average rating with two decimal places
//   };

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

//   const singleItem = (item) =>  (
//     <UpcomingScheduleListItem item={item} />
//   )
//   const singleItem1 = (item) =>  (
//     <CleaningRequestItem item={item} status={item.item.status}/>
//   )
//   // const singleItem2 = (item) =>  (
//   //   <CleaningRequestItem item={item} status={item.item.status} />
//   // )

 
//   const renderItem = ({ item }) => {
//     switch (item.type) {

//       case 'cleaning_requests':
//         if (cleaning_requests.length === 0) return null; // Don't render if no upcoming schedules
//         return(
//           <View style={styles.section}>
//             <FlatList 
//               data={cleaning_requests.slice(0, 4)}
//               renderItem = {singleItem1}
//               ListHeaderComponent={<Text style={styles.title}>New Cleaning Requests</Text>}
//               ListHeaderComponentStyle={styles.list_header}
//               ListEmptyComponent={<Text>No cleaning request found</Text>}
//               ItemSeparatorComponent={() => <View style={styles.line}></View>}
//               keyExtractor={(item) => item.key}
//               numColumns={1}
//               showsVerticalScrollIndicator={false}
//               horizontal={false}
//             />

//           </View>
//       )
    
//       case 'pending_payment':
//         if (pending_payment.length === 0) return null; // Don't render if no upcoming schedules
//         return(
//           <View style={styles.section}>
//             <FlatList 
//               data={pending_payment.slice(0, 4)}
//               renderItem = {singleItem1}
//               ListHeaderComponent={<Text style={styles.title}>New Cleaning Requests</Text>}
//               ListHeaderComponentStyle={styles.list_header}
//               ListEmptyComponent={<Text>No cleaning request found</Text>}
//               ItemSeparatorComponent={() => <View style={styles.line}></View>}
//               keyExtractor={(item) => item.key}
//               numColumns={1}
//               showsVerticalScrollIndicator={false}
//               horizontal={false}
//             />

//           </View>
//       )
    
//       case 'upcomingSchedule':
//         if (upcoming_schedule.length === 0) return null; // Don't render if no upcoming schedules
//         return (
//           <View style={{marginHorizontal:0}}>
//             {/* <CardNoPrimary> */}
          
//             <FlatList 
//               data={upcoming_schedule}
//               renderItem = {singleItem}
//               ListHeaderComponent={<Text style={styles.title}>Upcoming Schedules</Text>}
//               ListHeaderComponentStyle={styles.list_header}
//               ListEmptyComponent={<Text>No upcoming schedules found</Text>}
//               ItemSeparatorComponent={() => <View style={styles.line}></View>}
//               keyExtractor={(item) => item.key}
//               numColumns={1}
//               showsVerticalScrollIndicator={false}
//               horizontal={false}
//             />
            
//           {/* </CardNoPrimary> */}
//         </View>
//         );
//   }}

//   const data = [
//     // { type: 'earning' },
//     { type: 'cleaning_requests' },
//     { type: 'pending_payment' },
//     { type: 'upcomingSchedule' },
    
//   ];


//   if (
//     upcoming_schedule.length === 0 &&
//     cleaning_requests.length === 0 &&
//     pending_payment.length === 0
//   ) {
//     return (

//       <View style={{flex:2}}>
    
//       <EmptyListingNoButton message="No new job requests at the moment. Stay tuned for updates!" />

      
//       <EmptyListingNoButton 
//         message="No upcoming schedules or requests at the moment."
//         size={42}
//         iconName="calendar-clock"
//       />
     
//       </View>
      
      
//     );
//   }

  
//   return (
//     <SafeAreaView style={{ flex: 1,  backgroundColor: COLORS.white }}>
     
//      <StatusBar translucent={false} backgroundColor={COLORS.primary} barStyle="light-content" />

//      {loading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//           <Text style={styles.loadingText}>Loading...</Text>
//         </View>
//       ) : (
//           <ScrollView>
//           {/* Earnings Snapshot */}
//           <View style={styles.top}>
//           <View style={styles.earningsContainer}>
//             <Text style={styles.earning_title}>Earnings This Week</Text>
//             <Text style={styles.earnings}>${weekly_earning.toFixed(2)}</Text>
//           </View>

//           {/* Metrics Summary */}
//           <View style={styles.metricsContainer}>
//             <View style={styles.metric}>
//               <Icon name="check-circle" size={30} color={COLORS.light_gray_1} />
//               <Text style={styles.metricValue}>{totalJobs}</Text>
//               <Text style={styles.metricLabel}>Completed Jobs</Text>
//             </View>

//             <View style={styles.metric}>
//               <Icon name="star" size={30} color={COLORS.light_gray_1} />
//               {/* <Text style={styles.metricValue}>{averageRating.toFixed(1)}</Text> */}
//               <Text style={styles.metricValue}>{calculateOverallRating(ratings, currentUserId)}</Text>
//               <Text style={styles.metricLabel}>Average Rating</Text>
//             </View>

//             <View style={styles.metric}>
//               <Icon name="calendar" size={30} color={COLORS.light_gray_1} />
//               <Text style={styles.metricValue}>{upcomingJobs.length}</Text>
//               <Text style={styles.metricLabel}>Upcoming Jobs</Text>
//             </View>
//         </View>
//         </View>

    
     
//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//       />
   
//       {all_cleaning_requests.length == 0 && 
//         <View style={styles.section}>
//             {/* <NoScheduleMessage
//               onUpdateProfile={handleUpdateProfile}
//               // onExploreTips={handleExploreTips}
//               // onContactSupport={handleContactSupport}
//             /> */}
//         </View>
//       }
//       </ScrollView>
//     )}
     
//     </SafeAreaView>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: { padding: 20, backgroundColor: '#fff' },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: COLORS.primary,
//   },
//   mainContent: {
//     position: 'absolute',
//     bottom: 0,
//     height: '50%',
//     width: '100%',
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingTop: 20,
//   },
//   header: { marginBottom: 20},
//   greeting: { fontSize: 24, fontWeight: 'bold' },
//   earningsContainer: {
//     backgroundColor:COLORS.primary,
//     padding: 0,
//     borderRadius: 10,
//     marginBottom: 20,
//     marginTop:0,
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
//     marginBottom: 10,
//     backgroundColor:COLORS.primary
//   },
//   top:{
//     backgroundColor:COLORS.primary,
//     marginBottom:20
//   },
//   metric: { alignItems: 'center', flex: 1 },
//   metricValue: { fontSize: 24, fontWeight: 'bold', color:COLORS.white },
//   metricLabel: { fontSize: 13, color:COLORS.light_gray_1 },
//   section: { marginBottom: 20, marginHorizontal:10},
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
//   startButtonText: { 
//     color: '#fff', 
//     fontSize: 16, 
//     fontWeight: 'bold' 
//   },

//   summarySection: { marginBottom: 20 },
//   title: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     marginBottom: 10 
//   },

//   jobCard: { 
//     padding: 15, 
//     backgroundColor: '#f9f9f9', 
//     marginVertical: 5 
//   },
//   requestCard: { 
//     padding: 15, 
//     borderRadius: 12, 
//     backgroundColor: '#e9f5ff', 
//     marginVertical: 5 
//   },
//   actions: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     marginTop: 10 
//   },
//   acceptButton: { 
//     padding: 10, 
//     backgroundColor: '#d4f0d4', 
//     borderRadius: 5 
//   },
//   rejectButton: { 
//     padding: 10, 
//     backgroundColor: '#f8d7da', 
//     borderRadius: 5 
//   },
  
// jobsContainer: { 
//   backgroundColor: "#fff", 
//   padding: 15, borderRadius: 10, 
//   marginBottom: 20, elevation: 2 
// },
// });

// export default CleanerDashboard;





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
import NoScheduleMessage from '../../components/cleaner/NoScheduleMessage';
import { get_clean_future_requests } from '../../utils/get_cleaner_future_request';
import ResetPassword from '../auth/ResetPassword';
import EmptyApartmentPlaceholder from '../../components/host/EmptyApartmentPlaceholder';
import { EmptyListingNoButton } from '../../components/EmptyListingNoButton';



const CleanerDashboard = () => {
  const navigation = useNavigation();
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const { currentUserId } = useContext(AuthContext);

 

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isOpenImages, setIsOpenImages] = useState(false);
  const [images, setImages] = React.useState([]);
  const [upcoming_schedule, setUpcomingSchedule] = React.useState([]);
  const [cleaning_requests, setCleaningRequests] = React.useState([]);
  const [pending_payment, setPendingPayment] = React.useState([]);
  const [all_cleaning_requests, setAllCleaningRequests] = React.useState([]);
  // const [modalVisible, setModalVisible] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [weekly_earning, setWeeklyEarning] = useState(0);
  const [accountId, setAccountId] = useState(null);
  const [shouldOnboard, setShouldOnboard] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const [ratings, setCleanerRatings] = useState([]); // Track loading state
  const [location, setLocation] = useState(""); // Track loading state
  
  
useEffect(() => { 
  // alert(currentUser.white)
  // navigation.navigate(ROUTES.cleaner_verification);
  
  // if (!isProfileComplete(cleanerData?.contact)) {
  //   // Redirect to profile setup screen if profile is incomplete
  //   navigation.navigate(ROUTES.cleaner_profile);
  //   // navigation.navigate(ROUTES.cleaner_verification);
  // }

}, [ navigation]);

const handleUpdateProfile = () => {
  navigation.navigate(ROUTES.cleaner_profile)
}


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
    fetchallRequests()
    fetchPendingPayment()
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
          // console.log("requuueeeeeeeeeeeeeeeeeest")
          //  console.log(JSON.stringify(res, null,2));
          // console.log("requuueeeeeeeeeeeeeeeeeest")

          // Filter new requests
          setCleaningRequests(res)

        });
      } catch (e) {
        console.log(e);
        setLoading(false); // Ensure loading state is set to false in case of error
      }
    };
    const fetchPendingPayment = async () => {
      try {
        await userService.getMyCleaningPendingPayment(currentUserId).then((response) => {
          const res = response.data;
          console.log("requuueeeeeeeeeeeeeeeeeest")
           console.log(JSON.stringify(res, null,2));
          console.log("requuueeeeeeeeeeeeeeeeeest")

          // Filter for when payment is pending 
          const pendingPay = res.filter(
            (request) => request.status === "pending_payment"
          );
          
          setPendingPayment(pendingPay)
        });
      } catch (e) {
        console.log(e);
        setLoading(false); // Ensure loading state is set to false in case of error
      }
    };
    
    const fetchallRequests = async () => {
      try {
        await userService.getAllCleaningRequest(currentUserId).then((response) => {
          const res = response.data;
          
          // Filter new requests
          const new_request = get_clean_future_requests(res)
        

          console.log("requuueeeeeeeeeeeeeeeeeestYY")
          console.log(JSON.stringify(new_request, null,2));
          console.log("requuueeeeeeeeeeeeeeeeeestYY")
          
          // alert(new_request.length)
          setAllCleaningRequests(new_request)
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
  <CleaningRequestItem item={item} status={item.item.status}/>
)
// const singleItem2 = (item) =>  (
//   <CleaningRequestItem item={item} status={item.item.status} />
// )



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
  
    case 'pending_payment':
      if (pending_payment.length === 0) return null; // Don't render if no upcoming schedules
      return(
        <View style={styles.section}>
          <FlatList 
            data={pending_payment.slice(0, 4)}
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
      // { type: 'earning' },
      { type: 'cleaning_requests' },
      { type: 'pending_payment' },
      { type: 'upcomingSchedule' },
      
    ];

 


  return (
      <SafeAreaView style={{ flex: 1,  backgroundColor: COLORS.white }}>
     
      <StatusBar translucent={false} backgroundColor={COLORS.primary} barStyle="light-content" />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <View>
          

          <View style={styles.top}>
           <View style={styles.earningsContainer}>
             <Text style={styles.earning_title}>Your weekly earning</Text>
             <Text style={styles.earnings}>${weekly_earning.toFixed(2)}</Text>
           </View>

           {/* Metrics Summary */}
           <View style={styles.metricsContainer}>
             <View style={styles.metric}>
               <Icon name="check-circle" size={30} color={COLORS.light_gray_1} />
               {/* <Text style={styles.metricValue}>{totalJobs}</Text> */}
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
               {/* <Text style={styles.metricValue}>{upcomingJobs.length}</Text> */}
               <Text style={styles.metricLabel}>Upcoming Jobs</Text>
             </View>
         </View>
         </View>

         <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />

          {upcoming_schedule.length === 0 && cleaning_requests.length === 0 && <NoScheduleMessage onUpdateProfile = {handleUpdateProfile} />}
    
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
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
    backgroundColor:COLORS.primary,
    padding: 0,
    borderRadius: 10,
    marginBottom: 20,
    marginTop:0,
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
    backgroundColor:COLORS.primary
  },
  top:{
    backgroundColor:COLORS.primary,
    marginBottom:20
  },
  metric: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 24, fontWeight: 'bold', color:COLORS.white },
  metricLabel: { fontSize: 13, color:COLORS.light_gray_1 },
  section: { marginBottom: 20, marginHorizontal:10},
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
  startButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },

  summarySection: { marginBottom: 20 },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },

  jobCard: { 
    padding: 15, 
    backgroundColor: '#f9f9f9', 
    marginVertical: 5 
  },
  requestCard: { 
    padding: 15, 
    borderRadius: 12, 
    backgroundColor: '#e9f5ff', 
    marginVertical: 5 
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  acceptButton: { 
    padding: 10, 
    backgroundColor: '#d4f0d4', 
    borderRadius: 5 
  },
  rejectButton: { 
    padding: 10, 
    backgroundColor: '#f8d7da', 
    borderRadius: 5 
  },
  
jobsContainer: { 
  backgroundColor: "#fff", 
  padding: 15, borderRadius: 10, 
  marginBottom: 20, elevation: 2 
},
});

export default CleanerDashboard;
