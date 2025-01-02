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
import PendingApprovalListItem from '../../components/host/PendingApprovalListItem';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import AvailableSchedules from '../../components/host/AvailableSchedules';
import PendingPaymentItem from '../../components/host/PendingPaymentItem';
import CleaningRequestItem from '../../components/host/CleaningRequestItem';
import CustomCard from '../../components/CustomCard';




export default function Dashboard({navigation}) {

  // Example data (replace with API or state data)
  const properties = [
    { id: 1, name: 'Downtown Apartment', bedrooms: 2, bathrooms: 1, status: 'Upcoming Cleaning' },
    { id: 2, name: 'Beachside Villa', bedrooms: 4, bathrooms: 3, status: 'No Cleaning Scheduled' },
  ];

  const upcomingCleanings = [
    { id: 1, property: 'Downtown Apartment', date: '2024-11-18', cleaner: 'John Doe' },
    { id: 2, property: 'Beachside Villa', date: '2024-11-20', cleaner: 'Jane Smith' },
  ];

  const outstandingPayments = 120;







  const {logout, currentUserId} = useContext(AuthContext)

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
  const [cleaning_request, SetCleaningRequests] = useState([]);
  const [apartments, SetApartments] = useState([]);
  



  const mockSchedules = [
    {
      id: 1,
      propertyName: "Beachside Apartment",
      cleaningDate: "2024-11-20",
      cleaningTime: "10:00 AM",
      location: "Miami, FL",
      status: "Open",
    },
    {
      id: 2,
      propertyName: "Urban Loft",
      cleaningDate: "2024-11-22",
      cleaningTime: "2:00 PM",
      location: "New York, NY",
      status: "Open",
    },
  ];

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

    // Function to handle item selection
    const handleSelect = (value) => {
      alert(value)
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
      
    }, [])
  );

  
  const fetchClientSecret = async() => {
   
    await userService.getClientSecret()
    .then(response => {
      console.log(response.data)
      const res = response.data
      setClienSecret(res.client_secret)
      console.log(res.client_secret)
      // alert(res.client_secret)
    })
  }

  const fetchRequests = async () => {
    try {
      await userService.getHostCleaningRequest(currentUserId).then((response) => {
        const res = response.data;
     
        console.log("requests", JSON.stringify(res, null,2))
        const now = new Date();

        // Host Requests
        const pendingRequests = res.filter(
          // (req) => req.status === "pending_acceptance" && new Date(req.cleaning_date_time) >= now 
          (req) => req.status === "pending_acceptance"
      
        );

        const pendingPayment = res.filter(
          (req) => req.status === "pending_payment"
        );

        // const pendingPayment = res.filter(
        //   (schedule) => schedule.status === "pending_payment"
        // );
        alert(pendingRequests)
        console.log("requuueeeeeeeeeeeeeeeeeest1234")
        console.log(JSON.stringify(pendingRequests, null,2));
        // console.log(pendingRequests)
        
        console.log("requuueeeeeeeeeeeeeeeeeest2")
        SetCleaningRequests(pendingRequests)
        setFilteredPendingPayment(pendingPayment);
        
      });
    } catch (e) {
      console.log(e);
      setLoading(false); // Ensure loading state is set to false in case of error
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


    // const fetchJobs = () => {
    //     userService.getJobs()
    //     .then(response => {
    //         const res = response.data
    //         console.log(deta)
    //     })
    // }

    const fetchApartments = async () => {
        try {
          const response = await userService.getApartment(currentUserId);
          const data = response.data;
          console.log(data); // Log the fetched data
          SetApartments(data)
          // return data; // Return the fetched data if needed
        } catch (error) {
          console.error('Error fetching jobs:', error);
          throw error; // Rethrow the error to handle it in the calling code
        }
      };

    // const fetchUser = async () => {
    //   try {

    //     setLoading(true)
    //     const jsonValue = await AsyncStorage.getItem('@storage_Key')
    //     console.log("________________6666666666_______________________")
    //     const userInfo = JSON.parse(jsonValue)
    //     console.log(userInfo)
        
    //     setUserId(userInfo._id)
    //     // setUserName(userInfo.username)
    //     // setUserAvatar(userInfo.avatar)
    //     // setUserCreatedAt(userInfo.created_at)
       
        
    //     // setCurrency("₦")
    //     console.log(userInfo._id)
    //     const id = userInfo._id
        
    //       userService.getUser(id)
    //       .then(response => {
    //           const res = response.data
    //           setUserPhone(res.phone)
    //           setAddress(res.address)
    //           setFullName(res.firstname + " "+ res.lastname)

    //           setLoading(false)
      
    //       })
      
    //     console.log("________________6666666666_______________________")
    //     return jsonValue != null ? JSON.parse(jsonValue) : null;
    //   } catch(e) {
    //     // error reading value
    //   }
    // }

    const fetchSchedules = async () => {
      await userService.getSchedulesByHostId(currentUserId)
      .then(response => {
        // alert("seentoouy688")
        console.log(response.status)
        const res = response.data
        // console.log("my schedules",res)
        setSchedules(res)
        
        // const pendingPayment = res.filter(
        //   (schedule) => schedule.status === "pending_payment"
        // );
        const pendingCompletionApproval = res.filter(
          (schedule) => schedule.status === "pending_approval"
        );
        const upcomingSchedules = res.filter(
          (schedule) => schedule.verificationStatus === "upcoming"
        );
        // console.log("My pending schedules", pendingPayment)
        
        setFilteredPendingCompletionApprovalSchedules(pendingCompletionApproval);
        setUpcomingSchedules(upcomingSchedules)
        setFilteredPendingPayment(pendingPayment);

        

      }).catch((err)=> {
        console.log(err)
      })
    }
      
      const fetchUser = async () => {
        
        try {
          const jsonValue = await AsyncStorage.getItem('@storage_Key')
          
          const userInfo = JSON.parse(jsonValue)
          console.log("Speeeeeeeeeeeeed")
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



      const renderItem = ({ item }) => {
        switch (item.type) {
    
          case 'outstanding_payment':
            if (cleaning_request.length === 0) return null; // Don't render if no request
            return(
              <View style={styles.section}>
                <FlatList 
                  data={pending_payment}
                  renderItem = {renderPendingPayment}
                  ListHeaderComponent={<Text style={styles.title}>Pending Payment</Text>}
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

          case 'cleaning_requests':
            if (cleaning_request.length === 0) return null; // Don't render if no request
            return(
              <View style={styles.section}>
                <FlatList 
                  data={cleaning_request.slice(0, 4)}
                  renderItem = {renderRequestItem}
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
            if (cleaning_request.length === 0) return null; // Don't render if no upcoming schedules
            return (
              <View style={{marginHorizontal:0}}>
                {/* <CardNoPrimary> */}
              
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
                
              {/* </CardNoPrimary> */}
            </View>
            );


          case 'properties':
            if (cleaning_request.length === 0) return null; // Don't render if no upcoming schedules
            return (
              <View style={{marginHorizontal:0}}>
                {/* <CardNoPrimary> */}
              
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
                
              {/* </CardNoPrimary> */}
            </View>
            );
      }}

      
      const renderRequestItem = (item) => (

        <View style={{marginVertical:0, marginHorizontal:0}}>
          <CleaningRequestItem item={item} />
        </View>
      )

      const renderPendingPayment = (item) => (
        <View style={{marginVertical:10, marginHorizontal:10}}>
          <PendingPaymentItem item={item} />
        </View>
      )

      const singleItem = (item) =>  (
        <View style={{marginTop:260}}>
          <PendingApprovalListItem item={item} />
        </View>
      )


      const handleClaimSchedule = (scheduleId) => {
        console.log(`Schedule with ID ${scheduleId} has been claimed.`);
        // Implement logic to update the status in your backend
      };
    
      const data = [
        { type: 'cleaning_requests' },
        { type: 'outstanding_payment' },
        { type: 'upcomingSchedule' },
        { type: 'properties' },
        
      ]; 
  return (
    // <SafeAreaView
    //       style={{
    //         // flex:1,
    //         backgroundColor:COLORS.white,
    //         // justifyContent:"center",
    //         // alignItems:"center",
    //         marginBottom:0,
    //         paddingTop:0

    //       }}
    //     >

<SafeAreaView style={{ flex: 1,  backgroundColor: COLORS.white }}>
     <StatusBar translucent backgroundColor="transparent" />

          
    <View style={styles.blue_board} />
    
   
     
      
        <ScrollView>

          {/* Overview Cards */}
      <View style={styles.overview}>
        {/* <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={{fontSize:16}}>Active Properties</Text>
            <Paragraph>2</Paragraph>
          </Card.Content>
        </Card> */}
        {/* <Card style={styles.card}> */}
          {/* <Card.Content style={styles.cardContent}>
          <Text style={{fontSize:20, fontWeight:'bold'}}>Upcoming</Text>
          <Text style={{fontSize:20}}>Cleanings</Text>
            <Paragraph>{upcomingCleanings.length}</Paragraph>
          </Card.Content> */}
          <CustomCard style={styles.card} content="Upcoming Cleaning">
          <Text style={{fontSize:20, fontWeight:'bold'}}>Upcoming</Text>
          <Text style={{fontSize:20}}>Cleanings</Text>
            <Paragraph>{upcomingCleanings.length}</Paragraph>
          </CustomCard>
        {/* </Card> */}
        {/* <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
          <Text style={{fontSize:20, fontWeight:'condensed'}}>Outstanding</Text>
          <Text style={{fontSize:20, fontFamily: 'RobotoCondensed-Regular',}}>Paymentss</Text>
            <Paragraph>${outstandingPayments}</Paragraph>
          </Card.Content>
        </Card> */}

          <CustomCard style={styles.card} content="Upcoming Cleaning">
            <Text style={{fontSize:20, fontWeight:'condensed'}}>Outstanding</Text>
            <Text style={{fontSize:20, fontFamily: 'RobotoCondensed-Regular',}}>Payments</Text>
            <Paragraph>${outstandingPayments}</Paragraph>
          </CustomCard>

        
      </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        {pending_payment.length > 0 &&
          <FlatList 
            data={pending_payment}
            renderItem = {renderPendingPayment}
            ListHeaderComponent={<Text style={styles.title}>Pending Payment</Text>}
            ListHeaderComponentStyle={styles.list_header}
            ListEmptyComponent={<Text>No upcoming schedules found</Text>}
            ItemSeparatorComponent={() => <View style={styles.line}></View>}
            keyExtractor={(item) => item.key}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          />
        }



                {/* <FlatList 
                  data={data}
                  renderItem = {renderItem}
                  ListHeaderComponent={<Text style={styles.title}>New Cleaning Requests</Text>}
                  ListHeaderComponentStyle={styles.list_header}
                  ListEmptyComponent={<Text>No cleaning request found</Text>}
                  ItemSeparatorComponent={() => <View style={styles.line}></View>}
                  keyExtractor={(item) => item.key}
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                  horizontal={false}
                /> */}
    




      <CustomCard>
      {apartments.map((property) => (
          <List.Item
            key={property._id}
            title={property?.apt_name}
            description={`${property?.bedroom_num} Bedrooms, ${property?.bathroom_num} Bathrooms`}
            left={(props) => <AntDesign name="home" size={20} color={COLORS.gray}/>} 
            right={(props) => (
              <Button mode="outlined" textColor={COLORS.primary} onPress={() => console.log(`Edit ${property.name}`)}>
                Edit
              </Button>
            )}
          />
        ))}
        </CustomCard>
            

      {/* Upcoming Cleanings */}
      <View style={styles.section}>
      <Text onPress= {logout}>Logout {pending_payment.length}</Text>
        
      </View>

      

      {/* Quick Actions */}
      <View style={styles.section}>
        <Title>Quick Actions</Title>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => console.log('Create New Schedule')}
        >
          Create New Schedule
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          // onPress={() => console.log('Add New Property')}
          onPress={handleHostPress}
        >
          Add New Property
        </Button>
    
        {/* <AvailableSchedules schedules={mockSchedules} onClaim={handleClaimSchedule} /> */}
      </View>


      </ScrollView>
    </SafeAreaView>
  )
  
}


const styles = StyleSheet.create({
    // container:{
    //     width:"100%",
    //     // backgroundColor:"#fff"
    // },
   
      
      // map: {
      //   flex: 1,
      // },

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
        marginHorizontal:10
      },
      listCard: {
        marginBottom: 8,
        backgroundColor:COLORS.primary_light_1
      },
      title:{
        fontSize:16,
        fontWeight:'500',
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