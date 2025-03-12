import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Button from '../../components/Button';
import CalendarListItem from '../../components/CalendarListItem';
import CalendarView from '../../components/CalendarView';
import Text from '../../components/Text';
import COLORS from '../../constants/colors';
import ROUTES from '../../constants/routes';
import Upcoming from './ScheduleTabs/Upcoming';
import Ongoing from './ScheduleTabs/Ongoing';
import * as Animatable from 'react-native-animatable';
// import CreateBooking from './CreateBooking';

import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import CompletedJobsList from './ScheduleTabs/CompletedJobList';
// import UpcomingScheduleListItem from '../../components/host/ScheduleListItem';
// import Upcoming from './BookingTabs/Upcoming';
// import Ongoing from './BookingTabs/Ongoing';
// import Completed from './BookingTabs/Completed';


export default function Schedules({navigation}) {

    const{currentUserId} = useContext(AuthContext)

  
    const[openModal, setOpenModal] = useState(false)
    const[schedules, setSchedules] = useState([])
    const[currentStep, setCurrentStep] = useState(1);
    const[upcoming_schedules, setUpComingSchedules] = useState([])
    const[ongoing_schedules, setOnGoingSchedules] = useState([])
    const[completed_schedules, setCompletedSchedules] = useState([])
    const[future_schedules, setFutureSchedules] = useState([]);
    

    useEffect(()=> {
      fetchSchedules()
      // const unsubscribe = navigation.addListener('tabPress', () => {
      // alert("Hey")
        // fetchSchedules()
    // });

    // return unsubscribe; // Cleanup subscription
      
    },[navigation, currentStep])

    const fetchSchedules = async () => {
      await userService.getSchedulesAssignedToCleaner(currentUserId)
      .then(response => {
        // console.log(response.status)
        const res = response.data
        console.log("1111111111113")
        // console.log(JSON.stringify(res, null, 2))
        console.log("1111111111112")
        
        
        // Call the filterByStatus function after setting schedules
        const scheduleDateTime = new Date(`${res.cleaning_date}T${res.cleaning_time}`); // Combine date and time
        const currentDateTime = new Date(); // Get the current date and time

        setUpComingSchedules(res.filter(schedule => schedule.status.toLowerCase() === "upcoming"));
        // setUpComingSchedules(
        //   res.filter(schedule => {
        //     const scheduleDateTime = new Date(`${schedule.schedule.cleaning_date}T${schedule.schedule.cleaning_time}`); // Combine date and time
        //     const currentDateTime = new Date(); // Get the current date and time
        
        //     return (
        //       schedule.status.toLowerCase() === "upcoming" &&
        //       scheduleDateTime >= currentDateTime // Include only schedules with date-time now or later
        //     );
        //   })
        // );
        setOnGoingSchedules(res.filter(schedule => schedule.status.toLowerCase() === "in_progress"));
        setCompletedSchedules(res.filter(schedule => schedule.status.toLowerCase() === "completed"));
      
        // Filter for today's and future dates
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date

        const futureDates = res
          .filter(schedule => {
            const scheduleDate = new Date(schedule.schedule.cleaning_date);
            scheduleDate.setHours(0, 0, 0, 0); // Normalize schedule date
            return scheduleDate > today && schedule.status === "upcoming"; // Future dates with "upcoming" status
          })
          .map(schedule => {
            const scheduleDate = new Date(schedule.schedule.cleaning_date);
            return scheduleDate.toDateString(); // Convert to "Wed Feb 07 2025" format
          });

          setFutureSchedules(futureDates)
          console.log(futureDates);
       
        
        // setSchedules(res)
      }).catch((err)=> {
        console.log(err)
      })
    }

    const onUpcomingSchedule = () => {
      setCurrentStep(1)
    }

    const onOngoingSchedule = () => {
      setCurrentStep(2)
    }


    
  return (
    
    <View style={{flex:1, margin:0, marginTop:0}}>
      
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{backgroundColor:COLORS.primary}}>
          <View style={{margin:20}}>
            <CalendarView
              title="My schedules"
              openUpcomingTab={onUpcomingSchedule}
              openOngoingTab={onOngoingSchedule}
              future_schedule_dates = {future_schedules}
            />
          </View>

      </View>

      <View style={styles.container2}>
        {/* <View style={styles.colorcode}>
            <Text><MaterialCommunityIcons name="circle" color="#FADCA7" size={18} /> Yellow: Unavailable</Text>
            <Text><MaterialCommunityIcons name="circle-outline" color={COLORS.light_gray} size={18} /> Available</Text>
        </View> */}


      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 2 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(2)}>
          <MaterialCommunityIcons name="progress-clock" size={24} color={currentStep === 2 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>In Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 1 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(1)}>
          <MaterialCommunityIcons name="folder-network" size={24} color={currentStep === 1 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Up Coming </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 3 ? COLORS.primary :"#f0f0f0"}]} onPress={() => setCurrentStep(3)}>
          <MaterialCommunityIcons name="progress-check" size={24} color={currentStep === 3 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Completed</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.container}>
          {currentStep === 1 && <Upcoming schedules= {upcoming_schedules} />}
          {currentStep === 2 && <Ongoing schedules= {ongoing_schedules} />}
          {/* {currentStep === 3 && <Completed schedules= {completed_schedules} />} */}
          {currentStep === 3 && <CompletedJobsList schedules ={completed_schedules} />}
        </View>
        
    
      </View>

        

        <Modal 
            visible={openModal}
            animationType="slide" 
            // onRequestClose={onClose} // Handle hardware back button on Android
          >
            
            
          </Modal>
    </View>

    
  )
}


const styles = StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor:COLORS.white,
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