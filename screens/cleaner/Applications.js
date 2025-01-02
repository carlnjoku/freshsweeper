import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback, useContext } from 'react';

import { useFocusEffect } from '@react-navigation/native';

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

import userService from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
// import UpcomingScheduleListItem from '../../components/host/ScheduleListItem';
// import Upcoming from './BookingTabs/Upcoming';
// import Ongoing from './BookingTabs/Ongoing';
// import Completed from './BookingTabs/Completed';

import Pending from './ApplicationTab/Pending'; 
import Accepted from './ApplicationTab/Accepted';
import Rejected from './ApplicationTab/Rejected';



export default function Applications({route, navigation}) {

  const{currentUserId, currentUser} = useContext(AuthContext)
  
    
    const[openModal, setOpenModal] = useState(false)
    const[schedules, setSchedules] = useState([])
    const[apartments, setApartments] = useState([])
    const[currentStep, setCurrentStep] = useState(1);
    const[pending, setPending] = useState([]);
    const[accepted, setAccepted] = useState([]);
    const[rejected, setRejected] = useState([]);

    

    useEffect(()=> {
      const unsubscribe = navigation.addListener('tabPress', () => {
        // Refresh data or reset state here
        fetchSchedules()
        
    });
   
    fetchApplications()
    return unsubscribe; // Cleanup subscription
    
    },[navigation])

     useFocusEffect(
        useCallback(() => {
            fetchApplications(); // Refresh the component data when the screen is focused
        }, [])
      );

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         fetchApplications(); // Refresh your data or perform any other action
    //     });
      
    //     return unsubscribe; // Cleanup the listener on component unmount
    //   }, [navigation]);

    const fetchSchedules = async () => {
      await userService.getSchedulesByHostId(currentUserId)
      .then(response => {
        // console.log(response.status)
        const res = response.data
        console.log("1111111111113")
        console.log(res.data)
        console.log("111111111111")
        setSchedules(res)
      }).catch((err)=> {
        console.log(err)
      })
    }

    

    const fetchApplications =  async() => {
      await userService.getAllCleanerApplications(currentUserId)
      .then(response => {
        const res = response.data
        // console.log(JSON.stringify(res, null, 2))
        
        // Filter applications with status 'pending'
        const pendingApplications = res.filter(
            (res) => res.status === 'pending'
        );
        console.log("pending.......................")
        console.log(JSON.stringify(pendingApplications, null, 2))
        console.log("pending.......................")
        setPending(pendingApplications)

        // Filter applications with status 'accepted'
        const acceptedApplications = res.filter(
            (res) => res.status === 'accepted'
        );
        console.log("accepted.......................")
        console.log(JSON.stringify(acceptedApplications, null, 2))
        console.log("accepted.......................")
        setAccepted(acceptedApplications)

        // Filter applications with status 'rejected'
        const rejectedApplications = res.filter(
            (res) => res.status === 'rejected'
        );
        setRejected(rejectedApplications)

    }).catch((err)=> {
        console.log(err)
        setErrMsg(true)
        console.log("error")
        Alert.alert('Error', "Something went wrong, please try again");
      })
    }
    

    const handleRemoveItem = (applicaId) => {
        alert(applicaId)
        const pendingAppls = pending.filter((application) => application._id !== applicaId)
        setPending(pendingAppls)
        // setApplications(prevApplications => [...prevApplications, applications.find(app => app.id === id)]);
        // alert(pendingAppls.length)

  };
    
  return (
    
    <SafeAreaView style={{flex:1, margin:0, marginTop:0, backgroundColor:COLORS.backgroundColor}}>
      
      <StatusBar translucent backgroundColor="transparent" />
      {/* <View style={{backgroundColor:COLORS.primary}}>
          <View style={{margin:20}}>
            <CalendarView
              title="My schedules"
            />
          </View>

      </View> */}



      <View style={styles.container2}>
        {/* <View style={styles.colorcode}>
            <Text><MaterialCommunityIcons name="circle" color="#FADCA7" size={18} /> Yellow: Unavailable</Text>
            <Text><MaterialCommunityIcons name="circle-outline" color={COLORS.light_gray} size={18} /> Available</Text>
        </View> */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 1 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(1)}>
          <MaterialCommunityIcons name="folder-network" size={24} color={currentStep === 1 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Pending </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 2 ? COLORS.primary : "#f0f0f0"}]} onPress={() => setCurrentStep(2)}>
          <MaterialCommunityIcons name="progress-clock" size={24} color={currentStep === 2 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Accepted</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { borderBottomColor: currentStep == 3 ? COLORS.primary :"#f0f0f0"}]} onPress={() => setCurrentStep(3)}>
          <MaterialCommunityIcons name="progress-check" size={24} color={currentStep === 3 ? COLORS.primary : COLORS.gray} />
          <Text style={styles.tab_text}>Rejected</Text>
        </TouchableOpacity>
      </View>



        <View style={styles.container}>
          {currentStep === 1 && <Pending currentUser={currentUser} pending_applications = {pending} get_applicationId={handleRemoveItem}  />} 
          {currentStep === 2 && <Accepted schedules= {accepted} />}
          {currentStep === 3 && <Rejected schedules= {rejected} />}
        </View>
      </View>

        

        <Modal 
            visible={openModal}
            animationType="slide" 
            // onRequestClose={onClose} // Handle hardware back button on Android
          >
         
          </Modal>
    </SafeAreaView>

    
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