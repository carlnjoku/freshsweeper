import React, { useContext, useEffect,useState } from 'react';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import ChipIcon from '../../components/ChipIcon';
import GoogleMapComponent from '../../components/GoogleMap';
import GoogleMapWithRoute from '../../components/GoogleMapWithRoute';
import Text from '../../components/Text';
// import calculateETA from '../../utils/calculateETA';
import COLORS from '../../constants/colors';
import userService from '../../services/userService';
import calculateETA from '../../utils/calculateETA';
import moment from 'moment';
import CardColored from '../../components/CardColored';
import Card from '../../components/Card';
import CardNoPrimary from '../../components/CardNoPrimary';
import CircleIconButton1 from '../../components/CircleButton1';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ClockInConfirmation from './ClockInConfirmation';
import { automatedChatMessage } from '../../utils/automatedChatMessage';
import CircleIcon from '../../components/CirecleIcon';
import { AuthContext } from '../../context/AuthContext';
import GoogleDirections from '../../components/GoogleDirections';
import ROUTES from '../../constants/routes';
import { acceptCleaningRequestPushNotification, sendPushNotifications } from '../../utils/sendPushNotification';



export default function SchedulePreview({route}) {

    const {item, chatroomId} = route.params
    const {geolocationData, currentUserId, currentUser} = useContext(AuthContext)

    // alert(item.selected_schedule.hostInfo._id)
    console.log("params")
    // console.log(JSON.stringify(item.selected_schedule, null, 2))
    console.log("params")
    const distanceInKm = 10; // Example distance in kilometers
    const averageSpeedKph = 50; // Example average speed in kilometers per hour
    const eta = calculateETA(distanceInKm, averageSpeedKph);

    const dateTime = moment(eta.toLocaleString(), 'M/D/YYYY, h:mm:ss A');

    const time_to_destination = dateTime.minutes()

    console.log("ETA1:", time_to_destination+ " min"); // Output ETA in local date/time format
   
    const cleaning_date = item.selected_schedule.schedule.cleaning_date
    const cleaning_time = item.selected_schedule.schedule.cleaning_time


    const { width } = useWindowDimensions();
    const numColumns2 = 2
    const columnWidth2 = width / numColumns2 - 10; // Adjusted width to accommodate margins

    const[isOpenConfirmation, setIsOpenConfirmatiom] = useState("")
    const[isOpenModal, setOpenModal] = useState(false)
    const[host_expo_push_token, setExpoHostPushToken] = useState("")
    const[room_type_and_size, setRoomTypeSize] = useState(item?.selected_schedule.schedule.selected_apt_room_type_and_size)
    const[host_tokens, setHostPushToken] = useState([])

    // Retrieve the count for each room type
    const bedroomCount = room_type_and_size.find(room => room.type === "Bedroom")?.number || 0;
    const bathroomCount = room_type_and_size.find(room => room.type === "Bathroom")?.number || 0;
    const livingroomCount = room_type_and_size.find(room => room.type === "Livingroom")?.number || 0;

    console.log("Tasks", item.selected_schedule.schedule.regular_cleaning)
    alert(item.selected_schedule._id)
    useEffect(()=> {
      const fetchUser = async () => {
        
        try {
          
          await userService.getUser(item.selected_schedule.hostInfo._id)
          .then(response=> {
            const res = response.data
            // alert(res.expo_push_token)
            setExpoHostPushToken(res.expo_push_token)
            
          })
          
         
        } catch(e) {
          // error reading value
          console.log(e)
        }
      }
      fetchUser()
      fetchCleanerPushTokens()
    },[])

    const fetchCleanerPushTokens = async() => {
      await userService.getUserPushTokens(item.selected_schedule.hostInfo?._id)
      .then(response => {
          const res = response.data.tokens
          setHostPushToken(res)
          console.log("User tokens", res)
      })
    }
    const taskItem = ( {item,index} ) => (
    <View style={[styles.tasks, { width: columnWidth2 }]}>
        <Text style={{fontSize:13}}>{item.label}pii </Text>
    </View>
    
    )

    const onClose = () => {
        setOpenModal(false)
    }
    const taskItem2 = ( {item,index} ) => (
    <View style={[styles.tasks, { width: columnWidth2 }]}>
        <Text style={{fontSize:13}}><MaterialCommunityIcons name={item.icon} size={16} /> {item.label} </Text>
    </View>
    
    )

    const openModal = () => {
    setIsOpenConfirmatiom(true)
    }

    const handleOpenConfirmClockIn = () => {
    setOpenModal(true)
    // navigation.navigate(ROUTES.host_new_booking);
    }
    const handleCloseConfirmClockIn = () => {
    setOpenModal(false)
    }

    const handleAccept = () => {
      const status = "Accepted"
      const cleanerFname = currentUser.firstname
      const cleanerLname = currentUser.lastname
      
      // alert(item.selected_schedule.hostInfo._id)
      
      userService.acceptCleaningRequest(item.selected_schedule._id)
      .then(response => {
        console.log(response.data)
      })

      

      const notificationMsg =`${currentUser.firstname} ${currentUser.lastname} accepted your cleaning request`
    // Example usage:
    // acceptCleaningRequestPushNotification(
      sendPushNotifications(
        host_tokens, // Replace with a valid Expo Push Token
        currentUser.firstname+" "+currentUser.lastname,
        notificationMsg,
            {
            screen: ROUTES.host_dashboard,
            params: {
                scheduleId:item.selected_schedule._id,
                // hostId:currentUserId,
                // hostFirstname:currentUser.firstname,
                // hostLastname:currentUser.lastname,
                // cleanerId: item.cleanerId,
                // cleaning_date:selected_schedule.schedule.cleaning_date,
                // cleaning_time:selected_schedule.schedule.cleaning_time,
                // sender_expo_push_token:host_expo_push_token
            },
            }

      );

      console.log("Accepted")
      // handleOpenConfirmClockIn()
    }


    const handleDecline = () => {
      const status = "Accepted"
      const cleanerFname = currentUser.firstname
      const cleanerLname = currentUser.lastname

      automatedChatMessage(
        chatroomId, 
        item.selected_schedule, 
        item.selected_scheduleId,
        status,
        text_msg = cleanerFname +" "+cleanerLname + " accepted your request"
      )

      // Send push notification to friend
      const expo_pn = {
        // to:"ExponentPushToken[wFqHu7BrmdL5JivAJqpl6I]",
        to:host_expo_push_token,
        title:"Fresh Sweeper",
        body: cleanerFname +" "+cleanerLname + " accepted your cleaning request",
        data: {
          "icon": "https://firebasestorage.googleapis.com/v0/b/fresh-sweeper.appspot.com/o/android_notification_icon.png?alt=media&token=90ec77ca-211d-4e27-8c66-bd6b9a47e2bb",
          "screen": ROUTES.cleaner_profile,
          "params": {
              "id": "123",  
              "name": "Item Name'"
          }
        }
      }
      userService.sendPushNotification(expo_pn)
      .then(response => {
        console.log(response.data)
      })

      console.log("Declined")
      // handleOpenConfirmClockIn()
    }

  return (
    <SafeAreaView
      style={{
        flex:1,
        backgroundColor:COLORS.backgroundColor,
      }}
    >
        <StatusBar translucent backgroundColor="white" />
       
    
        {/* <GoogleDirections 
               origin={{
                latitude:40.6940337,
                longitude:-73.98938989999999
              }}
                destination={{
                latitude:item.selected_schedule.apartment_latitude,
                longitude:item.selected_schedule.apartment_longitude
              }}
              /> */}
         
      <GoogleMapComponent 
        latitude={item.selected_schedule.apartment_latitude}
        longitude={item.selected_schedule.apartment_longitude}
      />

          
 
        <View style={{height:"50%"}}>  
        <View style={styles.address_bar}>
            <View style={styles.addre}>
              <Text style={{color:COLORS.light_gray_1}}>{item.selected_schedule.schedule.contact?.address}</Text>
              {item.distance ? 
                <Text style={{fontSize:13, color:COLORS.light_gray}}>{item?.distance.toFixed(1)} Miles away</Text>
                :
                <Text style={{fontSize:13, color:COLORS.light_gray}}>miles away</Text>
                // <Text style={{fontSize:13, color:COLORS.light_gray}}>{distanceKm?.toFixed(1)} miles away</Text>
              }
            </View>
        </View>
        <ScrollView>
        
        <View style={styles.container}>
          
          <CardNoPrimary>
          <View style={styles.centerContent}>
              <Text bold style={styles.headerText}>{item?.selected_schedule.schedule.apartment_name}</Text>
              <Text style={{color:COLORS.gray, marginBottom:10, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{item?.selected_schedule.schedule.address}</Text>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:0}}>
                <CircleIcon 
                    iconName="bed-empty"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {bedroomCount}
                    type="Bedrooms"
                /> 
                <CircleIcon 
                    iconName="shower-head"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {bathroomCount}
                    type="Bathrooms"
                /> 
                <CircleIcon 
                    iconName="seat-legroom-extra"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {livingroomCount}
                    type="Livingroom"
                /> 
              </View>

          </CardNoPrimary>
          <CardColored>
          <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                <CircleIconButton1
                  iconName="calendar"
                  buttonSize={50}
                  radiusSise={25}
                  iconSize={26}
                  title={moment(cleaning_date).format('ddd MMM D')}
                  title_color={COLORS.white}
                />
                <CircleIconButton1
                 iconName="clock-outline"
                 buttonSize={50}
                 radiusSise={25}
                 iconSize={26}
                 title={moment(cleaning_time, 'h:mm:ss A').format('h:mm A')}
                 title_color={COLORS.white}
                />
                <CircleIconButton1
                 iconName="timer-outline"
                 buttonSize={50}
                 radiusSise={25}
                 iconSize={26}
                 title="2hrs Task"
                 title_color={COLORS.white}
                />
              </View>
          </CardColored>

        <View>
      
          <CardNoPrimary>
            <FlatList
                data={item.selected_schedule.schedule.regular_cleaning}
                renderItem = {taskItem}
                    ListHeaderComponent={<Text bold style={{fontSize:16}}>Regular Cleaning</Text>}
                    ListHeaderComponentStyle={styles.list_header}
                    // ListEmptyComponent= {emptyListing}
                    // ItemSeparatorComponent={itemSeparator}
                    keyExtractor={(item, index)=> item.label}
                    numColumns={numColumns2}
                    showsVerticalScrollIndicator={false}
            />
          </CardNoPrimary>
          {item.selected_schedule.schedule.regular_cleaning.length > 0 && 
          <CardNoPrimary>
            <FlatList
                data={item.selected_schedule.schedule.extra}
                renderItem = {taskItem2}
                ListHeaderComponent={<Text bold style={{fontSize:16}}>Deep Cleaning</Text>}
                ListHeaderComponentStyle={styles.list_header}
                // ListEmptyComponent= {emptyListing}
                // ItemSeparatorComponent={itemSeparator}
                keyExtractor={(item, index)=> item.label}
                numColumns={numColumns2}
                showsVerticalScrollIndicator={false}
            />
          </CardNoPrimary>
        }
          <View style={{marginTop:20}} />
        </View>
        </View>

        {/* <Modal 
            visible={isOpenModal}
            animationType="slide" 
            transparent={true}
            onRequestClose={()=> {handleCloseConfirmClockIn()}} // Handle hardware back button on Android
          >
  
            <ClockInConfirmation
              close_modal={handleCloseConfirmClockIn}
            />
          </Modal>
        */}
        </ScrollView>
        </View>
        
       <View style={styles.button}>
        <TouchableOpacity 
          style={styles.decline_button} onPress={handleDecline}
        >
          <Text bold style={styles.buttonText}><MaterialCommunityIcons name="cancel" size={24} color={COLORS.black} /> Decline</Text>
        </TouchableOpacity>
        <View><Text bold style={styles.price}>{geolocationData.currency.symbol}{item.selected_schedule.schedule.total_cleaning_fee}</Text></View>
        
        <TouchableOpacity 
          style={styles.accept_button} onPress={handleAccept}
        >
          <Text bold style={styles.buttonacceptText}><MaterialCommunityIcons name="check-all" size={24} color={COLORS.white} /> Accept </Text>
        </TouchableOpacity>
        
        </View>
   
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
   container:{
    marginHorizontal:10,
    alignItems: 'center',  // Horizontally center content
    justifyContent: 'center', // Vertically center 
   },
   mainContent: {
    position: 'absolute',
    bottom: 0,
    height: '65%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
  },
    eta:{
        flexDirection:'row',
        height:50,
        padding:5,
        borderWidth:0.5,
        borderColor:COLORS.light_gray_1,
        backgroundColor:COLORS.white,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    title:{
      fontSize:20,
      fontWeight:'60'
    },
    button: {
      flexDirection:'row',
      backgroundColor: COLORS.white,
      paddingVertical: 12,
      paddingHorizontal: 20,
      justifyContent:'space-between',
      borderTopWidth:1,
      borderColor:COLORS.light_gray_1
    },
    accept_button:{
      backgroundColor: COLORS.primary,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius:10
    },
    decline_button:{
      backgroundColor:COLORS.light_gray_1,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius:10,
      // borderWidth:1,
      // borderColor:COLORS.light_gray
    },
    buttonText: {
      color: COLORS.gray,
      fontSize: 18
    },
    buttonacceptText: {
      color: '#fff',
      fontSize: 18
    },
    price:{
      fontSize:24,
      fontWeight:'600',
    },
    centerContent: {
      alignItems: 'center',  // Center content horizontally
      marginVertical:5
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    modeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 10,
  },
  addre:{
    flex:0.7,
    padding:10
  },
address_bar:{
    minHeight:60,
    backgroundColor:COLORS.deepBlue,
    marginTop:-1
  },
  })


  