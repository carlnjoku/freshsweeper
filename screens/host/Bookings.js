import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Button from '../../components/Button';
import CalendarListItem from '../../components/CalendarListItem';
import CalendarView from '../../components/CalendarView';
import FloatingButton from '../../components/FloatingButton';
import Text from '../../components/Text';
import COLORS from '../../constants/colors';
import ROUTES from '../../constants/routes';
import * as Animatable from 'react-native-animatable';
// import CreateBooking from './CreateBooking';
import NewBooking from './NewBooking';
import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import UpcomingScheduleListItem from '../../components/host/ScheduleListItem';
import Upcoming from './BookingTabs/Upcoming';
import Ongoing from './BookingTabs/Ongoing';
import Completed from './BookingTabs/Completed';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

export default function Bookings({navigation}) {

  const{currentUserId} = useContext(AuthContext)
  
  // const schedules = [
  //   {
  //     scheduleId:"65f583076236fc83e9bf362d",
  //     time:"11:00 AM",
  //     date:"15 March",
  //     apartment:"Royal Suite",
  //     assignee:"Gonzalles",
  //     task: "Regular Cleaning",
  //     status:"Completed"
  //   },
  //   {
  //     scheduleId:"65f583076236fc83e9bf362d",
  //     time:"11:00 AM",
  //     date:"15 March",
  //     apartment:"Comfort Zone",
  //     assignee:"Gonzalles",
  //     task: "Deep Cleaning",
  //     status:"Upcoming"
  //   },
  //   {
  //     scheduleId:"65f583076236fc83e9bf362d",
  //     time:"11:00 AM",
  //     date:"15 March",
  //     apartment:"Apartment Adele",
  //     assignee:"Gonzalles",
  //     task: "Move in Cleaning",
  //     status:"Completed"
  //   },
  //   {
  //     scheduleId:"65f583076236fc83e9bf362d",
  //     time:"11:00 AM",
  //     date:"15 March",
  //     apartment:"How Home Suite",
  //     assignee:"Gonzalles",
  //     task: "Deep Cleaning",
  //     status:"Cancelled"
  //   },
  // ]

    const[openModal, setOpenModal] = useState(false)
    const[schedules, setSchedules] = useState([])
    const[upcoming_schedules, setUpComingSchedules] = useState([])
    const[ongoing_schedules, setOnGoingSchedules] = useState([])
    const[completed_schedules, setCompletedSchedules] = useState([])
    const[apartments, setApartments] = useState([])
    const[currentStep, setCurrentStep] = useState(1);
    const[future_schedules, setFutureSchedules] = useState([]);


    

    useEffect(()=> {
      const unsubscribe = navigation.addListener('tabPress', () => {
        // Refresh data or reset state here
        fetchApartment()
        fetchSchedules()
    });
    
// // Refresh data every time the screen is focused
//   useFocusEffect(
//     React.useCallback(() => {
//       fetchApartment()
//         fetchSchedules()
//     }, [])
//   );

    return unsubscribe; // Cleanup subscription
      
    },[navigation, currentStep])

    // Function to filter by status
    const filterByStatus = (status) => {
      alert(status)
      return schedules.filter(schedule => schedule.status === status);
    };

    const fetchSchedules = async () => {
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

        // Extract future cleaning dates
      const today = new Date();
      const futureCleaningDates = res
        .map(schedule => new Date(schedule.schedule.cleaning_date))
        .filter(cleaningDate => cleaningDate > today) // Only future dates
        .map(date => date.toDateString()); // Format as string if needed

      console.log("Future Cleaning Dates:", futureCleaningDates);

      // Set future cleaning dates (if you want to use them elsewhere in your app)
      setFutureSchedules(futureCleaningDates); // Assuming you have a state like `futureCleaningDates`

        

      }).catch((err)=> {
        console.log(err)
      })
    }

  

    const fetchApartment =  async() => {
      await userService.getApartment(currentUserId)
      .then(response => {
        const res = response.data
        
        if(res.length < 1){
          navigation.navigate(ROUTES.host_home_tab)
        }
        setApartments(res)
        console.log("Heeeeeeey2")
        console.log(res)
        console.log("Heeeeeeey2")
    }).catch((err)=> {
        console.log(err)
        setErrMsg(true)
        console.log("error")
        Alert.alert('Error', "Something went wrong, please try again");
      })
    }
    
    
    const handleOpenCreateBooking = () => {
      setOpenModal(true)
      // navigation.navigate(ROUTES.host_new_booking);
    }
    const handleCloseCreateBooking = () => {
      setOpenModal(false)
    }

    // Navigate to the previous tab (e.g., "Upcoming")
  const navigateToPreviousTab = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // If already at the first tab, you might want to disable this action
      console.log('Already at the first tab');
    }
  };

  const onUpcomingSchedule = () => {
    setCurrentStep(1)
  }

  const onOngoingSchedule = () => {
    setCurrentStep(2)
  }
  
    

    
  return (
    
    <View style={{backgroundColor:COLORS.backgroundColor, flex:1, margin:0, marginTop:0}}>
      
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{backgroundColor:COLORS.primary}}>
          <View style={{margin:20}}>
            <CalendarView
              title="My schedule"
              future_schedule_dates = {future_schedules}
              openUpcomingTab={onUpcomingSchedule}
              openOngoingTab={onOngoingSchedule}
            />
          </View>

      </View>

      <View style={styles.container2}>
        {/* <View style={styles.colorcode}>
            <Text><MaterialCommunityIcons name="circle" color="#FADCA7" size={18} /> Yellow: Unavailable</Text>
            <Text><MaterialCommunityIcons name="circle-outline" color={COLORS.light_gray} size={18} /> Available</Text>
        </View> */}


      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 1 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(1)}>
          <MaterialCommunityIcons name="folder-network" size={24} color={currentStep === 1 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>New Work </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 2 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(2)}>
          <MaterialCommunityIcons name="progress-clock" size={24} color={currentStep === 2 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Working</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 3 ? COLORS.primary :"#f0f0f0"}]} onPress={() => setCurrentStep(3)}>
          <MaterialCommunityIcons name="progress-check" size={24} color={currentStep === 3 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Completed</Text>
        </TouchableOpacity>
      </View>



        
          <View style={styles.container}>
            {currentStep === 1 && <Upcoming schedules={upcoming_schedules} />}
            {currentStep === 2 && <Ongoing schedules={ongoing_schedules} />}
            {currentStep === 3 && <Completed schedules={completed_schedules} />}
          </View>
    
        
         

        {apartments.length > 0 && 
          <FloatingButton 
            onPress={handleOpenCreateBooking}
            color="green"
          />
        }
    
      </View>

        

        <Modal 
            visible={openModal}
            animationType="slide" 
            // onRequestClose={onClose} // Handle hardware back button on Android
          >
            
            <NewBooking 
              close_modal={handleCloseCreateBooking}
            />
          </Modal>
    </View>

    
  )
}


const styles = StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor:COLORS.backgroundColor,
    padding:10
  },
  container2:{
    flex: 1,
    margin:0
  },
  colorcode:{
    marginBottom:20
},
item_separator : {
  marginTop:5,
  marginBottom:5,
  height:1,
  width:"100%",
  backgroundColor:"#E4E4E4",
  },
empty_listing: {
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  marginTop:'50%'
},
button:{
  padding:10,
  borderRadius:50,
  backgroundColor:COLORS.primary,
  marginTop:20
},
add_apartment_text:{
  color:COLORS.white
},
tabsContainer:{
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderBottomWidth: 0,
  borderBottomColor: "#e9e9e9",
  elevation:2
},
tab:{
  borderBottomWidth:3,
  borderBottomColor: COLORS.primary,
  alignItems:'center',
  marginTop:10,
  paddingHorizontal:26
},
tab_text:{
  marginBottom:5,
},
navigation: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  padding: 20,
  borderTopWidth: 1,
  borderTopColor: '#ccc',
},
arrowButton: {
  padding: 10,
},
})