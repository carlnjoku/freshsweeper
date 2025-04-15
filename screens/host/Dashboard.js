import React, { useContext, useEffect,useState, useCallback } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, Linking,TouchableWithoutFeedback, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
// import Card from '../../components/Card';
// import { Card, Title, Paragraph, Button, List } from 'react-native-paper';
import CardColored from '../../components/CardColored';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';
import ROUTES from '../../constants/routes';
import MapView, { Marker } from 'react-native-maps';
import GoogleDirections from '../../components/GoogleDirections';
import { Avatar, TextInput, Title, Card, Paragraph, Menu, List, Button} from 'react-native-paper';
import PaymentForm from '../../components/cleaner/PaymentForm1';

import { CardField, useConfirmSetupIntent, StripeProvider } from '@stripe/stripe-react-native';
import UpcomingScheduleListItem from '../../components/host/ScheduleListItem';

import { useFocusEffect } from '@react-navigation/native';
// import PendingApprovalListItem from '../../components/host/PendingApprovalListItem';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import AvailableSchedules from '../../components/host/AvailableSchedules';
import PendingPaymentItem from '../../components/host/PendingPaymentItem';
import CleaningRequestItem from '../../components/host/CleaningRequestItem';
import CustomCard from '../../components/CustomCard';
import PendingApprovalListItem from '../../components/host/PendingApprovalListItem';
import CircleIconNoLabel from '../../components/CirecleIconNoLabel';
import CardNoPrimary from '../../components/CardNoPrimary';
import UpcomingScheduleItem from '../../components/host/UpcomingScheduleItem';
import EmptyApartmentPlaceholder from '../../components/host/EmptyApartmentPlaceholder';
import TimeRequest from '../../components/host/TimeRequest';
import { RefreshControl } from 'react-native';
import moment from 'moment';
import NewlyPublishedSchedule from '../../components/host/NewlyPublishedSchedule';
import * as Animatable from 'react-native-animatable';



export default function Dashboard({navigation}) {


  const {currentUser, currentUserId, geolocationData} = useContext(AuthContext)

  const[loading, setLoading] = useState(true); // State for loader
  const[firstname, setFirstname] = useState("")
  const[lastname, setLastname] = useState("")
  const[username, setUsername] = useState("")
  const[avatar, setAvatar] = useState("")
  const[userId, setUserId] = useState("")

  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [client_secret, setClienSecret] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [pending_payment, setFilteredPendingPayment] = useState([]);
  const [pending_completion_approval, setFilteredPendingCompletionApprovalSchedules] = useState([]);
  const [upcoming, setUpcomingSchedules] = useState([]);
  const [cleaning_request, setCleaningRequests] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [extraTime, setExtraTime] = useState([]);
  const [pendingCount, setPendingCount] = useState([]);

  // Add refreshing state
  const [refreshing, setRefreshing] = useState(false);
  


// Function to handle refresh
const handleRefresh = async () => {
  setRefreshing(true);
  try {
    await Promise.all([fetchSchedules(), fetchRequests(), fetchApartments(), fetchExtraTime(), fetchUser()]);
  } catch (error) {
    console.error('Error refreshing data:', error);
  } finally {
    setRefreshing(false);
  }
};
  
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

    // Function to handle item selection
    const handleSelect = (value) => {
      // alert(value)
      setSelectedValue(value);
      closeMenu();
  };

  useEffect(()=> {
    const unsubscribe = navigation.addListener('tabPress', () => {
      // Refresh data or reset state here
      
      fetchClientSecret()
      fetchSchedules()
      fetchUser()
  });

  return unsubscribe; // Cleanup subscription
    
  },[navigation])


  // Refresh data every time the screen is focused
  useFocusEffect(
     useCallback(() => {
      fetchSchedules()
      fetchRequests()
      fetchApartments()
      fetchExtraTime()
    }, [])
  );

  // Fetch all required data and set loading to false when done
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchSchedules(), fetchRequests(), fetchApartments(), fetchExtraTime(), fetchUser()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading once all data is fetched
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // fetchSchedules();
      fetchRequests();
      // fetchApartments();
      // fetchExtraTime();
    // }, 10000); // Polling every 10 seconds
    }, 1000000); // Polling every 10 seconds
  
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);
  
  const fetchClientSecret = async() => {
   
    await userService.getClientSecret()
    .then(response => {
      // console.log(response.data)
      const res = response.data
      setClienSecret(res.client_secret)
      console.log(res.client_secret)
      // alert(res.client_secret)
    })
  }

  const fetchRequests = async () => {

    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
    // alert(currentTime)
    try {
      await userService.getHostCleaningRequest(currentUserId,currentTime).then((response) => {
        const res = response.data;
        setPendingCount(res.length)
        // alert(res.length)
        const total_request_sent = res.length
        // getSchedulesByHostId
        // getUpcomingSchedulesByHostId
        // console.log("requests", JSON.stringify(res, null,2))
        console.log("Where the hell is this request")
        const now = new Date();

        // Host Requests
        const pendingRequests = res.filter(
          // (req) => req.status === "pending_acceptance" && new Date(req.cleaning_date_time) >= now 
          (req) => req.status === "pending_acceptance"
      
        );

        const pendingPayment = res.filter(
          (req) => req.status === "pending_payment"
        );

        setCleaningRequests(pendingRequests)
        setFilteredPendingPayment(pendingPayment);
        
        
      });
    } catch (e) {
      console.log(e);
      // setLoading(false); // Ensure loading state is set to false in case of error
    }
  };


    // useEffect(()=> {
    //     fetchSchedules()
    //     fetchUser()
    // },[])

    const handleHostPress = () => {
      // Navigate to the host registration screen
      navigation.navigate('Add Apartment');
  };


    
    const fetchApartments = async () => {
        try {
          const response = await userService.getApartment(currentUserId);
          const data = response.data;
          // console.log(data); // Log the fetched data
          setApartments(data)
          // return data; // Return the fetched data if needed
        } catch (error) {
          console.error('Error fetching jobs:', error);
          throw error; // Rethrow the error to handle it in the calling code
        }
      };

    const fetchExtraTime = async () => {
        try {
          const response = await userService.getExtraTime(currentUserId);
          const data = response.data;
          // console.log(data); // Log the fetched data
          setExtraTime(data)
          // return data; // Return the fetched data if needed
        } catch (error) {
          console.error('Error fetching jobs:', error);
          throw error; // Rethrow the error to handle it in the calling code
        }
      };

    const fetchSchedules = async () => {
      await userService.getSchedulesByHostId(currentUserId)
      .then(response => {
        // alert("seentoouy688")
        // console.log(response.status)
        const res = response.data
        // console.log("my schedules",JSON.stringify(res, null, 2))
        setSchedules(res)
        
        // const pendingPayment = res.filter(
        //   (schedule) => schedule.status === "pending_payment"
        // );
        const pendingCompletionApproval = res.filter(
          (schedule) => schedule.status === "pending_approval"
        );
        const upcomingSchedules = res.filter(
          (schedule) => schedule.status === "upcoming"
        );
        // console.log("My pending schedules", pendingPayment)
        
        setFilteredPendingCompletionApprovalSchedules(pendingCompletionApproval);
        setUpcomingSchedules(upcomingSchedules)
        // setFilteredPendingPayment(pendingPayment);

        

      }).catch((err)=> {
        console.log(err)
      })
    }
      
      const fetchUser = async () => {
        
        try {
          const jsonValue = await AsyncStorage.getItem('@storage_Key')
          
          const userInfo = JSON.parse(jsonValue)
    
          // console.log(userInfo)
          const uid = userInfo.resp._id
          // setLoading(true)
          
      
          await userService.getUser(uid)
          .then(response=> {
            const res = response.data
            setUserId(res._id)
            setUsername(res.username)
            setFirstname(res.firstname)
            setLastname(res.lastname)
          })
      
          
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
          // error reading value
        }
      }

      const renderItemPaymentApproval = ({item}) => (
        <PendingApprovalListItem item={item} />
      )


      const renderItem = ({ item }) => {
        switch (item.type) {

          

          case 'newly_published_schedule':
            return cleaning_request.length <=  0 || apartments.length <= 0  ? null : (
              <>
              <Text style={styles.title}>New Cleaning Requests</Text>
              
              <Animatable.View animation="slideInRight" duration={550}>
                <NewlyPublishedSchedule 
                  schedule={cleaning_request}
                  pendingCount={pendingCount}
                />
              </Animatable.View>
              </>
            );
          case 'cleaning_extra_time_requests':
            if(extraTime.length===0) return null
            return(
              <View style={styles.section}>
                <FlatList 
                  data={extraTime}
                  renderItem = {renderExtratime}
                  ListHeaderComponent={<Text style={styles.title}>Extra Time Request</Text>}
                  ListHeaderComponentStyle={styles.list_header}
                  ListEmptyComponent={<Text>No pending extra time found</Text>}
                  ItemSeparatorComponent={() => <View style={styles.line}></View>}
                  keyExtractor={(item) => item.key}
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                  horizontal={false}
                />
    
              </View>
          )
          case 'pending_payment':
            if (pending_payment.length === 0) return null; // Don't render if no request
            return(
              <View style={styles.section}>
                <FlatList 
                  data={pending_payment}
                  renderItem = {renderPendingPayment}
                  ListHeaderComponent={<Text style={styles.title}>Accepted Requests</Text>}
                  ListHeaderComponentStyle={styles.list_header}
                  ListEmptyComponent={<Text>No pending payment found</Text>}
                  // ItemSeparatorComponent={() => <View style={styles.line}></View>}
                  keyExtractor={(item) => item.key}
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                  horizontal={false}
                />
    
              </View>
          )

          case 'payment_approval':
            if (pending_completion_approval.length === 0) return null; // Don't render if no request
            return(
              <View style={styles.section}>
                <FlatList 
                  data={pending_completion_approval}
                  renderItem = {renderItemPaymentApproval}
                  ListHeaderComponent={<Text style={styles.title}>Task Completed</Text>}
                  ListHeaderComponentStyle={styles.list_header}
                  ListEmptyComponent={<Text>No upcoming schedules found</Text>}
                  ItemSeparatorComponent={() => <View style={styles.line}></View>}
                  keyExtractor={(item) => item.key}
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                  horizontal={false}
                />
    
              </View>
          )

          // case 'cleaning_requests':
          //   if (cleaning_request.length === 0) return null; // Don't render if no request
          //   return(
          //     <View style={styles.section}>
          //        <View>
                   
          //             <FlatList 
          //               data={cleaning_request.slice(0, 4)}
          //               renderItem = {renderRequestItem}
          //               ListHeaderComponent={<Text style={styles.title}>New Cleaning Requests</Text>}
          //               ListHeaderComponentStyle={styles.list_header}
          //               ListEmptyComponent={<Text>No cleaning request found</Text>}
          //               ItemSeparatorComponent={() => <View style={styles.line}></View>}
          //               keyExtractor={(item) => item.key}
          //               numColumns={1}
          //               showsVerticalScrollIndicator={false}
          //               horizontal={false}
          //             />
                    
          //         </View>
                
    
          //     </View>
          // )
        
          case 'upcomingSchedule':
            if (upcoming.length === 0) return null; // Don't render if no upcoming schedules
            return (
              <View style={{marginHorizontal:10}}>
                
                <CardNoPrimary>
              
                <FlatList 
                  data={upcoming}
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
                
              </CardNoPrimary>
            </View>
            );


            case 'properties':
              return (
                <View style={{ marginHorizontal: 0 }}>
                  {apartments.length === 0 ? (
                    // Display the EmptyApartmentPlaceholder when no properties exist
                    <EmptyApartmentPlaceholder onAddApartment={handleHostPress} />
                  ) : (
                    <View style={{marginHorizontal:10}}>
                    <CardNoPrimary>
                      <View style={styles.titleContainer}>
                        <Text bold style={styles.title}>My Properties</Text>
                        <View style={styles.actions}>
                          <CircleIconNoLabel
                            iconName="plus"
                            buttonSize={30}
                            radiusSise={15}
                            iconSize={16}
                            onPress={handleHostPress}
                          />
                        </View>
                      </View>
                      <View style={styles.line}></View>
                      <View style={styles.content}>
                        {apartments.slice(0, 2).map((property) => (
                          <TouchableOpacity
                          onPress={() =>
                            navigation.navigate(ROUTES.host_apt_dashboard, {
                              propertyId: property._id,
                              hostId: currentUserId,
                              property: property,
                            })
                          }
                        >
                          <List.Item
                            key={property._id}
                            title={property?.apt_name}
                            description={
                              <Text style={{ color: COLORS.gray, fontSize: 13 }}>{property?.address}</Text>
                            }
                            left={(props) => <AntDesign name="home" size={20} color={COLORS.gray} />}
                            right={(props) => (
                              <View style={styles.rightContainer}>
                                <CircleIconNoLabel
                                  iconName="chevron-right"
                                  buttonSize={30}
                                  radiusSise={15}
                                  iconSize={16}
                                  onPress={() => navigation.navigate(ROUTES.host_apt_dashboard, { propertyId: property._id, hostId:currentUserId, property:property })}
                                />
                                
                              </View>
                            )}
                          />
                          </TouchableOpacity>
                        ))}

                          {apartments.length > 2 && (
                            <TouchableOpacity 
                              onPress={() => navigation.navigate(ROUTES.host_my_apartment)}
                              style={styles.viewAllContainer}
                            >
                              <Text style={styles.viewAllText}>View All Properties</Text>
                            </TouchableOpacity>
                          )}
                      </View>
                    </CardNoPrimary>
                    </View>
                  )}
                </View>
              );
      }}

      
      const renderRequestItem = (item) => (

        <View style={{marginVertical:0, marginHorizontal:0}}>
          <CleaningRequestItem item={item} />
        </View>
      )
      const renderExtratime = (item) => (

        <View style={{marginVertical:0, marginHorizontal:0}}>
          <TimeRequest item={item} />
        </View>
      )

      const renderPendingPayment = (item) => (
        <View style={{marginVertical:10, marginHorizontal:10}}>
          <PendingPaymentItem item={item} />
          
        </View>
      )

      const singleItem = (item) =>  (
        <View style={{marginTop:20}}>
          <UpcomingScheduleListItem item={item.item} currency={geolocationData.currency.symbol} />
        </View>
      )

      

      
      const data = [
        // { type: 'intro' },
        { type: 'pending_payment' },
        {type:'newly_published_schedule'},
        // { type: 'cleaning_requests' },
        // { type: 'cleaning_extra_time_requests' },
        
        { type: 'payment_approval'},
        { type: 'upcomingSchedule' },
        { type: 'properties' },
        
      ]; 

      // Loader screen
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const sampleSchedule = {
    apartmentName: "Apartment 101",
    cleaning_date: "March 10, 2025",
    cleaning_time: "10:00 AM",
  };
  
  // const pendingCount = 5; // Number of pending requests
  // const acceptedCleaners = [
  //   { name: "Jane Smith", acceptedTime: "2:15 PM" },
  //   { name: "John Doe", acceptedTime: "3:00 PM" },
  // ];
  return (
   
  <SafeAreaView style={{ flex: 1,  backgroundColor: COLORS.white }}>
    
    <StatusBar translucent={false} backgroundColor={COLORS.white}  barStyle="dark-content"/>

          
     
      
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
  
    </SafeAreaView>
  )
  
}


const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  blue_board:{
    height:80,
    backgroundColor:COLORS.primary,
    paddingTop:40
  },
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#ffffff', // Card background color
    borderRadius: 12,           // Rounded corners
    margin: 8,                  // Space around the card
    elevation: 4,               // Shadow on Android
    shadowColor: '#ccc',        // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2,         // Shadow opacity
    shadowRadius: 3,     
  },
  dashCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  section: {
    marginVertical: 16,
    marginHorizontal:0
  },
  listCard: {
    marginBottom: 8,
    backgroundColor:COLORS.primary_light_1
  },
  title:{
    fontSize:16,
    fontWeight:'bold',
    marginHorizontal:10
  },
  button: {
    marginTop: 8,
    backgroundColor:COLORS.deepBlue
  },
  cardContent: {
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',     // Center content horizontally
    paddingVertical: 20,      // Add spacing inside the card
  },
  cardContent1: {
    justifyContent: 'center', // Center content vertically
    paddingVertical: 20,      // Add spacing inside the card
  },
  line:{
    borderBottomWidth:0.8,
    borderColor:COLORS.light_gray_1,
    marginVertical:5,
    height:4
  },
  titleContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:0
  },
  
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    marginRight:-25
  },
  viewAllContainer: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: "flex-end",
  },
  viewAllText: {
    color: COLORS.primary, 
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

})





// import React, { useState } from 'react';
// import { View, ScrollView, StyleSheet } from 'react-native';
// import { Text, Card, Chip, Button, Title, Divider } from 'react-native-paper';
// import COLORS from '../../constants/colors';

// const Dashboard = () => {
//   const [selectedFilter, setSelectedFilter] = useState('All');

//   // Mock data
//   const overviewStats = [
//     { title: 'Total Tasks', value: 12 },
//     { title: 'Upcoming Tasks', value: 5 },
//     { title: 'Pending Actions', value: 2 },
//     { title: 'Completed Tasks', value: 8 },
//   ];

//   const upcomingSchedules = [
//     { id: 1, title: 'Cleaning at Elm Street', date: '2024-11-20', status: 'Assigned - Paid' },
//     { id: 2, title: 'Cleaning at Pine Ave', date: '2024-11-21', status: 'Assigned - Unpaid' },
//   ];

//   const pendingApprovals = [
//     { id: 1, title: 'Cleaning at Oak Street', applicants: 3 },
//   ];

//   const notifications = [
//     { id: 1, message: 'Cleaner applied for Pine Ave task', timestamp: '2 hours ago' },
//     { id: 2, message: 'Payment completed for Elm Street', timestamp: '1 day ago' },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       {/* Overview Section */}
//       <View style={styles.section}>
//         <Title style={styles.sectionTitle}>Overview</Title>
//         <View style={styles.statsGrid}>
//           {overviewStats.map((stat, index) => (
//             <Card key={index} style={styles.statCard}>
//               <Card.Content>
//                 <Text style={styles.statValue}>{stat.value}</Text>
//                 <Text style={styles.statTitle}>{stat.title}</Text>
//               </Card.Content>
//             </Card>
//           ))}
//         </View>
//       </View>

//       <Divider />

//       {/* Upcoming Schedules */}
//       <View style={styles.section}>
//         <Title style={styles.sectionTitle}>Upcoming Schedules</Title>
//         {upcomingSchedules.map((schedule) => (
//           <Card key={schedule.id} style={styles.card}>
//             <Card.Content>
//               <Text style={styles.scheduleTitle}>{schedule.title}</Text>
//               <Text style={styles.scheduleDate}>{schedule.date}</Text>
//               <Chip style={styles.statusChip}>{schedule.status}</Chip>
//             </Card.Content>
//             <Card.Actions>
//               <Button mode="contained" style={styles.actionButton} onPress={() => console.log('View Details')}>
//                 View Details
//               </Button>
//               <Button mode="outlined" style={styles.actionOutlinedButton} onPress={() => console.log('Cancel Task')}>
//                 Cancel
//               </Button>
//             </Card.Actions>
//           </Card>
//         ))}
//       </View>

//       <Divider />

//       {/* Pending Approvals */}
//       <View style={styles.section}>
//         <Title style={styles.sectionTitle}>Pending Approvals</Title>
//         {pendingApprovals.map((approval) => (
//           <Card key={approval.id} style={styles.card}>
//             <Card.Content>
//               <Text style={styles.approvalTitle}>{approval.title}</Text>
//               <Text style={styles.approvalSubTitle}>{approval.applicants} Applicants</Text>
//             </Card.Content>
//             <Card.Actions>
//               <Button mode="contained" style={styles.actionButton} onPress={() => console.log('View Applicants')}>
//                 View Applicants
//               </Button>
//             </Card.Actions>
//           </Card>
//         ))}
//       </View>

//       <Divider />

//       {/* Notifications */}
//       <View style={styles.section}>
//         <Title style={styles.sectionTitle}>Notifications</Title>
//         {notifications.map((notification) => (
//           <Card key={notification.id} style={styles.card}>
//             <Card.Content>
//               <Text style={styles.notificationMessage}>{notification.message}</Text>
//               <Text style={styles.timestamp}>{notification.timestamp}</Text>
//             </Card.Content>
//           </Card>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f9f9f9', // Screen background
//   },
//   section: {
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     color: '#00BFFF', // Primary color
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     width: '48%',
//     backgroundColor: '#ffffff', // Card background
//     padding: 8,
//     marginBottom: 16,
//     borderRadius: 12, // Uniform border radius
//     elevation: 3, // Elevation for shadow
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 2 }, 
//     shadowOpacity: 0.1, 
//     shadowRadius: 4,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1E90FF', // Slightly darker primary
//     textAlign: 'center',
//   },
//   statTitle: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 8,
//     color: '#1E90FF', // Slightly darker primary
//   },
//   card: {
//     marginBottom: 12,
//     backgroundColor: '#ffffff', // White card background
//     borderRadius: 12, // Uniform border radius
//     elevation: 3, // Uniform shadow
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 1.5,
//     shadowRadius: 4,
//   },
//   scheduleTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1E90FF',
//   },
//   scheduleDate: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   // statusChip: {
//   //   marginTop: 8,
//   //   backgroundColor: '#87CEEB', // Primary light shade
//   // },
//   statusChip: {
//     marginTop: 8,
//     backgroundColor: COLORS.primary_light_1,
//     alignSelf: 'flex-start', // Prevents full width
//     paddingVertical: 0, // Adjusts padding for better fit
//     paddingHorizontal: 0, // Adjusts padding for better fit
//     borderRadius:50

//   },
//   actionButton: {
//     backgroundColor: '#00BFFF', // Primary
//     marginRight: 8,
//   },
//   actionOutlinedButton: {
//     borderColor: '#00BFFF', // Primary
//     borderWidth: 1,
//   },
//   approvalTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1E90FF',
//   },
//   approvalSubTitle: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   notificationMessage: {
//     fontSize: 14,
//     color: '#1E90FF',
//   },
//   timestamp: {
//     fontSize: 12,
//     color: 'gray',
//     marginTop: 4,
//   },
// });

// export default Dashboard;













// import React, { useState, useContext } from 'react';
// import { View, ScrollView, StyleSheet } from 'react-native';
// import { Text, Card, Chip, Button, Title, Divider } from 'react-native-paper';
// import COLORS from '../../constants/colors';
// import { AuthContext } from '../../context/AuthContext';

// const Dashboard = () => {
//   const [selectedFilter, setSelectedFilter] = useState('All');

//   const {logout, currentUserId} = useContext(AuthContext)
//   // Mock data
//   const overviewStats = [
//     { title: 'Total Tasks', value: 12 },
//     { title: 'Upcoming Tasks', value: 5 },
//     { title: 'Pending Actions', value: 2 },
//     { title: 'Completed Tasks', value: 8 },
//   ];

//   const upcomingSchedules = [
//     { id: 1, title: 'Cleaning at Elm Street', date: '2024-11-20', status: 'Assigned - Paid' },
//     { id: 2, title: 'Cleaning at Pine Ave', date: '2024-11-21', status: 'Assigned - Unpaid' },
//   ];

//   const pendingApprovals = [
//     { id: 1, title: 'Cleaning at Oak Street', applicants: 3 },
//   ];

//   const notifications = [
//     { id: 1, message: 'Cleaner applied for Pine Ave task', timestamp: '2 hours ago' },
//     { id: 2, message: 'Payment completed for Elm Street', timestamp: '1 day ago' },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       {/* Overview Section */}
//       <View style={styles.section}>
//         <Title style={styles.sectionTitle}>Overview</Title>
//         <View style={styles.statsGrid}>
//           {overviewStats.map((stat, index) => (
//             <Card key={index} style={styles.statCard}>
//               <Card.Content>
//                 <Text style={styles.statValue}>{stat.value}</Text>
//                 <Text style={styles.statTitle}>{stat.title}</Text>
//               </Card.Content>
//             </Card>
//           ))}
//         </View>
//       </View>

//       <Divider />

//       {/* Upcoming Schedules */}
//       <View style={styles.section}>
//         <Title style={styles.sectionTitle}>Upcoming Schedules</Title>
//         {upcomingSchedules.map((schedule) => (
//           <Card key={schedule.id} style={styles.paymentCard}>
//             <Card.Content>
//               <Text style={styles.scheduleTitle}>{schedule.title}</Text>
//               <Text style={styles.scheduleDate}>{schedule.date}</Text>
//               <Chip style={styles.statusChip}>{schedule.status}</Chip>
//             </Card.Content>
//             <Card.Actions>
//               <Button mode="contained" style={styles.actionButton} onPress={() => console.log('View Details')}>
//                 View Details
//               </Button>
//               <Button mode="outlined" style={styles.actionOutlinedButton} onPress={() => console.log('Cancel Task')}>
//                 Cancel
//               </Button>
//             </Card.Actions>
//           </Card>
//         ))}
//       </View>

//       <Divider />

//       {/* Pending Approvals */}
//       <View style={styles.section}>
//         <Title style={styles.sectionTitle}>Pending Approvals</Title>
//         {pendingApprovals.map((approval) => (
//           <Card key={approval.id} style={styles.card}>
//             <Card.Content>
//               <Text style={styles.approvalTitle}>{approval.title}</Text>
//               <Text style={styles.approvalSubTitle}>{approval.applicants} Applicants</Text>
//             </Card.Content>
//             <Card.Actions>
//               <Button mode="contained" style={styles.actionButton} onPress={() => console.log('View Applicants')}>
//                 View Applicants
//               </Button>
//             </Card.Actions>
//           </Card>
//         ))}
//       </View>

//       <Divider />
//       <Text onPress={logout}>Logout</Text>

//       {/* Notifications */}
//       <View style={styles.section}>
//         <Title style={styles.sectionTitle}>Notifications</Title>
//         {notifications.map((notification) => (
//           <Card key={notification.id} style={styles.notificationCard}>
//             <Card.Content>
//               <Text style={styles.notificationMessage}>{notification.message}</Text>
//               <Text style={styles.timestamp}>{notification.timestamp}</Text>
//             </Card.Content>
//           </Card>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9', // Soft background for the whole screen
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     color: '#00BFFF', // Primary color
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 12,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   paymentCard: {
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     borderRadius: 8,
//     marginVertical: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: COLORS.gray,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   statCard: {
//     width: '48%',
//     backgroundColor: '#ffffff',
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   statValue: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#1E90FF', // Primary color
//     textAlign: 'center',
//   },
//   statTitle: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 8,
//     color: '#1E90FF',
//   },
//   scheduleCard: {
//     marginBottom: 20,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   scheduleTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1E90FF',
//   },
//   scheduleDate: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   statusChip: {
//     marginTop: 8,
//     backgroundColor: '#87CEEB', // Primary light shade
//     alignSelf: 'flex-start',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   actionButton: {
//     backgroundColor: '#00BFFF', // Primary color
//     marginRight: 8,
//   },
//   actionOutlinedButton: {
//     borderColor: '#00BFFF', // Primary color
//     borderWidth: 1,
//   },
//   approvalTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1E90FF',
//   },
//   approvalSubTitle: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   notificationCard: {
//     marginBottom: 12,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   notificationMessage: {
//     fontSize: 14,
//     color: '#1E90FF',
//   },
//   timestamp: {
//     fontSize: 12,
//     color: 'gray',
//     marginTop: 4,
//   },
// });

// export default Dashboard;

