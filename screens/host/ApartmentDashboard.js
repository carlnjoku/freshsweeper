import React, {useState, useEffect, useLayoutEffect,useCallback, useRef, useContext} from  'react';
import { useFocusEffect } from '@react-navigation/native';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { TextInput, Checkbox, RadioButton } from 'react-native-paper';
import COLORS from '../../constants/colors';
import { SafeAreaView, RefreshControl, StyleSheet, Alert, KeyboardAvoidingView, Keyboard, Platform, StatusBar, Linking,  FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Switch, Card,Avatar,Badge, Divider, Title, Paragraph, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../constants/routes';
import CircleIcon from '../../components/CirecleIcon';
import CardColored from '../../components/Card';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import NewBooking from './NewBooking';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from '../../components/PaymentForm';
import AddICalModal from './AddICalModal';
import userService from '../../services/userService';



export default function ApartmentDashboard({route}) {

  const{property} = route.params
  const navigation = useNavigation();

  const[refreshing, setRefreshing] = useState(false); // Step 1: Refresh state
  const[openModal, setOpenModal] = useState(false)
  const[isAutomated, setIsAutomated] = useState(property?.isAutomated); // Assuming 'isAutomated' comes from property details
  const[automatedSchedules, setAutomatedSchedules] = useState([]);
  const[manualSchedules, setManualSchedules] = useState([]);
  const[upcoming_schedules, setUpComingSchedules] = useState([])
  const[ongoing_schedules, setOnGoingSchedules] = useState([])
  const[completed_schedules, setCompletedSchedules] = useState([])


  const [modalVisible, setModalVisible] = useState(false);
  const [icalData, setIcalData] = useState(null);
  const [cleaners, setCleaners] = useState([]);

  // Retrieve the count for each room type
  const bedroomCount = property?.roomDetails.find(room => room.type === "Bedroom")?.number || 0;
  const bathroomCount = property?.roomDetails.find(room => room.type === "Bathroom")?.number || 0;
  const kitchen = property?.roomDetails.find(room => room.type === "Kitchen")?.number || 0;
  const livingroomCount = property?.roomDetails.find(room => room.type === "Livingroom")?.number || 0;

  const bedroomSize = property?.roomDetails.find(room => room.type === "Bedroom")?.size || 0;
  const bathroomSize = property?.roomDetails.find(room => room.type === "Bathroom")?.size || 0;
  const kitchenSize = property?.roomDetails.find(room => room.type === "Kitchen")?.size || 0;
  const livingroomSize = property?.roomDetails.find(room => room.type === "Livingroom")?.size || 0;

  
  const [syncedCalendars, setSyncedCalendars] = useState([]);

  useEffect(()=> {
    fetchCleaners()
    fetchSyncedCals()
  },[])

  const fetchCleaners = async() => {
    await userService.getClanersAssignedByApartmentIds(property._id)
    .then(response => {
      const res = response.data
      console.log(res)
      setCleaners(res.assignedTo)
    })
  }

  const fetchSyncedCals = async() => {
    await userService.getSyncedCalsByApartmentIds(property._id)
    .then(response => {
      const res = response.data
      console.log("syncalendar", res)
      console.log(res)
      setSyncedCalendars(res)
    })
  }
  const toggleSync = (id) => {
      setSyncedCalendars((prevCalendars) =>
          prevCalendars.map((calendar) =>
              calendar.id === id ? { ...calendar, enabled: !calendar.enabled } : calendar
          )
      );
  };



const handleSaveSync = async (newSync) => {
  setSyncedCalendars((prevCalendars) => {
      const existingIndex = prevCalendars.findIndex((item) => item._id === newSync._id);
      
      if (existingIndex !== -1) {
          // Update the existing entry
          return prevCalendars.map((item, index) =>
              index === existingIndex ? { ...item, ...newSync } : item
          );
      } else {
          // Append as a new entry
          return [...prevCalendars, { id: newSync._id || Date.now(), ...newSync, enabled: true }];
          // Ensure fetchSyncedCals runs AFTER the state update
          
      }
      
  });
  await fetchSyncedCals();
};

const handleSyncCalendar = async (data) => {
  try {
      console.log("Sending data to API:", data);
      const response = await userService.createSyncCalendar(data);
      console.log("Received API Response:", response.data.data);
   
      if (response?.status === 200) {
          console.log("Synced Calendar Data:", response.data.data);
          handleSaveSync(response.data.data);

          Alert.alert(
              "Sync Successful",
              response.message || "Your calendar has been synced successfully!",
              [{ text: "OK" }]
          );
      } else {
          throw new Error(response?.detail || "Failed to sync calendar.");
      }
  } catch (error) {
      console.error("Error syncing calendar:", error);
      Alert.alert(
          "Sync Failed",
          error.message || "There was an issue syncing your calendar. Please try again.",
          [{ text: "OK" }]
      );
  }
};

// Debugging: Log when syncedCalendars updates
useEffect(() => {
  console.log("Updated Synced Calendars:", syncedCalendars);
}, [syncedCalendars]);
  
  console.log("prop.............")
  console.log(property)
  console.log("prop.............")
  
  const fetchSchedules = async () => {
    try {
      // Fetch schedules here - simulated as mock data for now
      const fetchedAutomatedSchedules = [
        { id: 1, date: '2024-11-01', task: 'Checkout Cleaning', cleaner:{firstname:'Henry', lastname:'Smith', avatarUrl:'https://firebasestorage.googleapis.com/v0/b/fresh-sweeper.appspot.com/o/profile%2Favatar_670afb2514d97bb4f6a37f3a.jpeg?alt=media&token=13138600-3e0c-4fb1-8ca2-5b9530898724'}, status:'accepted' },
        { id: 2, date: '2024-11-05', task: 'Deep Cleaning', cleaner:{firstname:'Henry', lastname:'Smith', avatarUrl:'https://firebasestorage.googleapis.com/v0/b/fresh-sweeper.appspot.com/o/profile%2Favatar_670afb2514d97bb4f6a37f3a.jpeg?alt=media&token=13138600-3e0c-4fb1-8ca2-5b9530898724'} },
      ];
      const fetchedManualSchedules = [
        { id: 3, date: '2024-10-30', task: 'Regular Cleaning' },
      ];

      setAutomatedSchedules(fetchedAutomatedSchedules);
      setManualSchedules(fetchedManualSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchSchedules1 = async () => {
    await userService.getSchedulesByHostId(currentUserId)
    .then(response => {
      // console.log(response.status)
      const res = response.data
      console.log("1111111111113")
      console.log(JSON.stringify(res, null, 2))
      console.log("111111111111")
      setSchedules(res)

      
      // Call the filterByStatus function after setting schedules
      setUpComingSchedules(res.filter(schedule => schedule.status.toLowerCase() === "upcoming"));
      setOnGoingSchedules(res.filter(schedule => schedule.status.toLowerCase() === "in_progress"));
      setCompletedSchedules(res.filter(schedule => schedule.status.toLowerCase() === "completed"));
    }).catch((err)=> {
      console.log(err)
    })
  }

  const toggleAutomation = () => {
    setIsAutomated((prev) => !prev);
    Alert.alert(
      'Automation Status Changed',
      isAutomated
        ? 'Automated scheduling is now disabled.'
        : 'Automated scheduling is now enabled.'
    );
  };


  const navigateToViewSchedules = () => {
    navigation.navigate(ROUTES.host_bookings, { propertyId: property.id });
  };

const renderScheduleCard = (schedule, animated = false) => (
    <Card key={schedule.id} style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {/* Cleaner Avatar */}
        {schedule.cleaner && schedule.cleaner.avatarUrl && (
          <Avatar.Image
            size={40}
            source={{ uri: schedule.cleaner.avatarUrl }}
            style={styles.avatar}
          />
        )}
  
        <View style={styles.textContainer}>
          <Text style={styles.taskTitle}>{`Task: ${schedule.task ?? 'Unknown task'}`}</Text>
          <Text style={styles.taskDate}>{`Date: ${schedule.date ?? 'Unknown date'}`}</Text>
  
          {schedule.cleaner && (
            <View style={styles.cleanerInfo}>
              <Text style={styles.cleanerName}>{`Assigned to: ${schedule.cleaner.firstname}`}</Text>
              {/* Badge for accepted/pending status */}
              {schedule.status ? (
                <Badge style={styles.acceptedBadge}>Accepted</Badge>
              ) : (
                <Badge style={styles.pendingBadge}>Pending</Badge>
              )}
            </View>
          )}
        </View>
      </Card.Content>
  
      {isAutomated && (
        <Card.Actions>
          <Button mode="text" color="#6200EE">
            <Text>Auto-Generated</Text> {/* Wrap text inside a <Text> component */}
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
  

  // Fetch automated/manual schedules on mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleOpenCreateBooking = () => {
    setOpenModal(true)
    // navigation.navigate(ROUTES.host_new_booking);
  }
  const handleCloseCreateBooking = () => {
    setOpenModal(false)
  }

  // Step 2: Handle refresh action
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchCleaners(), fetchSyncedCals(), fetchSchedules()]);
    setRefreshing(false);
  };

  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="pencil" // Edit icon
          size={20}
          color={COLORS.primary}
          onPress={() => navigation.navigate(ROUTES.host_edit_apt, { propertyId:property._id })}
        />
      ),
    });
  }, [navigation, property]);

  
  // Use `useFocusEffect` to refresh the screen when it's focused
  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [property._id]) // Dependency ensures refresh when property changes
  );

  
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={ // Step 3: Add RefreshControl
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      

      <CardColored>
      <View> 
          <View style={styles.centerContent}>
            <AntDesign name="home" size={60} color={COLORS.gray}/> 
            <Text bold style={styles.headerText}>{property?.apt_name}</Text>
            <Text style={{color:COLORS.gray, marginBottom:5, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{property.address}</Text>
          </View> 

            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:0, marginBottom:10}}>
                <CircleIcon 
                    iconName="bed-empty"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {bedroomCount}
                    roomSize= {bedroomSize}
                    type="Bedrooms"
                /> 
                <CircleIcon 
                    iconName="shower-head"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {bathroomCount}
                    roomSize= {bathroomSize}
                    type="Bathrooms"
                /> 
           
                <CircleIcon 
                    iconName="silverware-fork-knife"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {kitchen}
                    roomSize= {kitchenSize}
                    type="Kitchen"
                /> 
                <CircleIcon 
                    iconName="seat-legroom-extra"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {livingroomCount}
                    roomSize= {livingroomSize}
                    type="Livingroom"
                /> 
                
            </View> 
          </View>
        </CardColored>

      <Card style={styles.automationCard}>
        {/* <Card.Title
          title="Automated Scheduling"
          right={() => (
            <Switch
              value={isAutomated}
              onValueChange={toggleAutomation}
              color={COLORS.primary}
            />
          )}
        /> */}
        <Card.Content>
          {/* <Text>
            {isAutomated
              ? 'Automated scheduling is enabled for this property.'
              : 'Automated scheduling is disabled. You can manually create schedules.'}
          </Text> */}
          <Text style={styles.infoText}>
              Sync your Airbnb, Booking.com, or Vrbo calendar to automatically create cleaning schedules 
              whenever a new guest checks out. Select a default cleaner to be assigned to each cleaning.
          </Text>
        </Card.Content>
      </Card>
      <View style={styles.manualContainer}>
          <TouchableOpacity
           onPress={() => setModalVisible(true)}
            style={styles.createButton}
          >
            <View style={{flexDirection:'row', alignItems:'center'}}>
              
              <MaterialCommunityIcons name="calendar-sync" size={20} color="white" /> 
              <Text style={styles.buttonText}> Sync Calendar</Text>
            </View>
          </TouchableOpacity>
        </View>
      {isAutomated ? (
        <View>
          <Text style={styles.sectionHeader}>Upcoming Automated Schedules</Text>
          {automatedSchedules.length > 0 ? (
            automatedSchedules.map((schedule) =>
              renderScheduleCard(schedule, true)
            )
          ) : (
            <Text style={styles.emptyText}>
              No upcoming automated schedules.
            </Text>
          )}
        </View>
      ) : (
        <>

        {/* List of Synced Calendars */}
        {syncedCalendars.length > 0 && (
          <View>
            <CardColored>
              <Text style={styles.sectionTitle}>Synced Calendars</Text>
              {syncedCalendars.map((calendar) => (
                  <View key={calendar._id} style={styles.syncItem}>
                    <View>
                      <Text style={styles.syncLabel}>{calendar.platform}</Text>
                      <Switch style={styles.switch} color={COLORS.primary} value={calendar.enabled} onValueChange={() => toggleSync(calendar.id)} />
                    </View>
                  </View>
              ))}
            </CardColored>
          </View>
      )}

        
        <View>
          {/* Show Synced Calendar Data */}
          {icalData && (
                    <View>
                        <Text>Platform: {icalData.selectedType}</Text>
                        <Text>iCal URL: {icalData.icalUrl}</Text>
                        <Text>Assigned Cleaner: {icalData.selectedCleaner}</Text>
                    </View>
                )}
        </View>

        </>
      )}

      {/* <Text style={styles.sectionHeader}>Manual Schedules</Text>
      {manualSchedules.length > 0 ? (
        manualSchedules.map(renderScheduleCard)
      ) : (
        <Text style={styles.emptyText}>No manual schedules yet.</Text>
      )} */}

      {/* <Button
        mode="contained"
        onPress={navigateToViewSchedules}
        style={styles.viewButton}
        // labelStyle={styles.buttonLabel}
        title= "View All Schedules"
      /> */}
        
        <Modal 
            visible={openModal}
            animationType="slide" 
            // onRequestClose={onClose} // Handle hardware back button on Android
          >
            
            <NewBooking 
              close_modal={handleCloseCreateBooking}
            />
          </Modal>

          
                {/* iCal Modal */}
                <AddICalModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSave={handleSyncCalendar}
                    cleaners={cleaners}
                    aptId={property._id}
                />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#F5F5F5',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    automationCard: {
      marginBottom: 20,
      borderRadius: 10,
      elevation: 3,
      backgroundColor:COLORS.primary_light_1
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
      marginVertical: 10,
    //   textTransform: 'uppercase'
    },
    card: {
      marginBottom: 15,
      borderRadius: 10,
      elevation: 2,
      backgroundColor: '#FFF',
      height:110
    },
    taskTitle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    taskDate: {
      fontSize: 14,
      color: '#555',
    },
    emptyText: {
      color: '#999',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    manualContainer: {
      alignItems: 'flex-end',
      marginVertical: 0,
    },
    createButton: {
      backgroundColor: COLORS.primary,
      borderRadius: 50,
      paddingVertical: 10,
      paddingHorizontal:20
    },
    buttonText:{
      color:COLORS.white,
      fontSize:16,
      fontWeight:'600'
    },
    viewButton: {
      marginTop: 20,
      backgroundColor: '#6200EE',
      borderRadius: 10,
      paddingVertical: 8,
    },
    buttonLabel: {
      fontSize: 16,
      color: '#FFF',
    },

      cardContent: {
        flexDirection: 'row', // Align avatar and text horizontally
        // alignItems: 'center',
        alignItems:'flex-start'
      },
      avatar: {
        marginRight: 10,
      },
      textContainer: {
        flex: 1,
      },
      
      taskDate: {
        fontSize: 14,
        color: '#666',
      },
      cleanerName: {
        fontSize: 14,
        color: '#333',
      },
      acceptedBadge: {
        backgroundColor: '#4CAF50', // Green color for accepted
        marginLeft: 10,
        paddingHorizontal:5
      },
      pendingBadge: {
        backgroundColor: '#FFC107', // Yellow color for pending
        marginLeft: 10,
        paddingHorizontal:5
      },
      centerContent: {
        alignItems: 'center',  // Center content horizontally
        marginVertical:10
      },
      infoText: {
        fontSize: 14,
        color: '#333',
      },
    sectionTitle:{
      fontSize:16,
      marginVertical:10,
      fontWeight:'600'
    },
    syncLabel:{
      marginTop:5
    },
    switch: {
      marginTop:-30,
    },
    switch_component :{
      // flexDirection:'row',
      // // alignItems:'center',
      // justifyContent:'space-around',
      // width:'100%'

    }
  });
