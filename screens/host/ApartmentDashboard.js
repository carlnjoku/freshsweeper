import React, {useState, useEffect, useRef, useContext} from  'react';
import Text from '../../components/Text';
import Button from '../../components/Button';
import { TextInput, Checkbox, RadioButton } from 'react-native-paper';
import COLORS from '../../constants/colors';
import { SafeAreaView,StyleSheet, Alert, KeyboardAvoidingView, Keyboard, Platform, StatusBar, Linking,  FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Switch, Card,Avatar,Badge, Divider, Title, Paragraph, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../constants/routes';
import CircleIcon from '../../components/CirecleIcon';
import CardColored from '../../components/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NewBooking from './NewBooking';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from '../../components/PaymentForm';



export default function ApartmentDashboard({route}) {

  const{property} = route.params
  const navigation = useNavigation();

  const [openModal, setOpenModal] = useState(false)
  const [isAutomated, setIsAutomated] = useState(property?.isAutomated); // Assuming 'isAutomated' comes from property details
  const [automatedSchedules, setAutomatedSchedules] = useState([]);
  const [manualSchedules, setManualSchedules] = useState([]);
  const[upcoming_schedules, setUpComingSchedules] = useState([])
  const[ongoing_schedules, setOnGoingSchedules] = useState([])
  const[completed_schedules, setCompletedSchedules] = useState([])
  
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


// const renderScheduleCard = (schedule, automated = false) => (
//     <Card key={schedule.id} style={styles.card}>
//       <Card.Content>
//         <Text style={styles.taskTitle}>{`Task: ${schedule.task}`}</Text>
//         <Text style={styles.taskDate}>{`Date: ${schedule.date}`}</Text>
//       </Card.Content>
//       {automated && (
//         <Card.Actions>
//           <Button mode="text" color="#6200EE">
//             Auto-Generated
//           </Button>
//         </Card.Actions>
//       )}
//     </Card>
//   );

//   const renderScheduleCard = (schedule, automated = false) => (
//     <Card key={schedule.id} style={styles.card}>
//     <Card.Content style={styles.cardContent}>
//       {/* Cleaner Avatar */}
//       {schedule.cleaner && schedule.cleaner.avatarUrl && (
//         <Avatar.Image
//           size={40}
//           source={{ uri: schedule.cleaner.avatarUrl }}
//           style={styles.avatar}
//         />
//       )}

//       <View style={styles.textContainer}>
//         <Text style={styles.taskTitle}>{`Task: ${schedule.task ?? 'Unknown task'}`}</Text>
//         <Text style={styles.taskDate}>{`Date: ${schedule.date ?? 'Unknown date'}`}</Text>
//         {schedule.cleaner && (
//           <Text style={styles.cleanerName}>{`Assigned to: ${schedule.cleaner.firstname} ${schedule.cleaner.lastname}`}</Text>
//         )}
//       </View>
//     </Card.Content>

//     {isAutomated && (
//       <Card.Actions>
//         <Button mode="text" color="#6200EE">
//           Auto-Generated
//         </Button>
//       </Card.Actions>
//     )}
//   </Card>
//   );


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

 
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      

      <CardColored>
      <View> 
          <View style={styles.centerContent}>
            <Text bold style={styles.headerText}>{property?.apt_name}</Text>
            <Text style={{color:COLORS.gray, marginBottom:10, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{property.address}</Text>
            </View> 

            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:5}}>
                <CircleIcon 
                    iconName="bed-empty"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {3}
                    type="Bedrooms"
                /> 
                <CircleIcon 
                    iconName="shower-head"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {1}
                    type="Bathrooms"
                /> 
                <CircleIcon 
                    iconName="seat-legroom-extra"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {1}
                    type="Livingroom"
                /> 
            </View> 
          </View>
        </CardColored>

      <Card style={styles.automationCard}>
        <Card.Title
          title="Automated Scheduling"
          right={() => (
            <Switch
              value={isAutomated}
              onValueChange={toggleAutomation}
              color={COLORS.primary}
            />
          )}
        />
        <Card.Content>
          <Text>
            {isAutomated
              ? 'Automated scheduling is enabled for this property.'
              : 'Automated scheduling is disabled. You can manually create schedules.'}
          </Text>
        </Card.Content>
      </Card>

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
        <View style={styles.manualContainer}>
          <Button
            mode="contained"
            onPress={handleOpenCreateBooking}
            style={styles.createButton}
            labelStyle={styles.buttonLabel}
            title="Create Schedule Manually"
          />
            
          
        </View>
      )}

      <Text style={styles.sectionHeader}>Manual Schedules</Text>
      {manualSchedules.length > 0 ? (
        manualSchedules.map(renderScheduleCard)
      ) : (
        <Text style={styles.emptyText}>No manual schedules yet.</Text>
      )}

      <Button
        mode="contained"
        onPress={navigateToViewSchedules}
        style={styles.viewButton}
        // labelStyle={styles.buttonLabel}
        title= "View All Schedules"
      />
        
        <Modal 
            visible={openModal}
            animationType="slide" 
            // onRequestClose={onClose} // Handle hardware back button on Android
          >
            
            <NewBooking 
              close_modal={handleCloseCreateBooking}
            />
          </Modal>

          

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
      alignItems: 'center',
      marginVertical: 15,
      marginHorizontal:20
    },
    createButton: {
      backgroundColor: '#6200EE',
      borderRadius: 10,
      paddingVertical: 8,
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
        marginVertical:20
      },
  });
