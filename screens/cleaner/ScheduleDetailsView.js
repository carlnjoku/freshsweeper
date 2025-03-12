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
import calculateDistance from '../../utils/calculateDistance';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Chip } from 'react-native-paper';


  


export default function SchedulePreview({route}) {

    const navigation = useNavigation()
    const {item, requestId, scheduleId, hostId} = route.params
    const {geolocationData, currentUserId, currentUser} = useContext(AuthContext)



    const distanceInKm = 10; // Example distance in kilometers
    const averageSpeedKph = 50; // Example average speed in kilometers per hour
    const eta = calculateETA(distanceInKm, averageSpeedKph);

    const dateTime = moment(eta.toLocaleString(), 'M/D/YYYY, h:mm:ss A');

    const time_to_destination = dateTime.minutes()

    console.log("ETA1:", time_to_destination+ " min"); // Output ETA in local date/time format
   


    const { width } = useWindowDimensions();
    const numColumns2 = 2
    const columnWidth2 = width / numColumns2 - 10; // Adjusted width to accommodate margins

    const[isOpenConfirmation, setIsOpenConfirmatiom] = useState("")
    const[isOpenModal, setOpenModal] = useState(false)

    const[schedule, setSchedule] = useState({})

    const[cleaning_date, setCleaningDate] = useState("")
    const[cleaning_time, setCleaningTime] = useState("")
    const[cleaning_end_time, setCleaningEndTime] = useState("")
    const[room_type_and_size, setRoomTypeSize] = useState([])
    const[host_tokens, setHostPushToken] = useState([])
    const[apartment_latitude, setApartmentLatitude] = useState("")
    const[apartment_longitude, setApartmentLongitude] = useState("")
    const[address, setAddress] = useState("")
    const[apartment_name, setApartmentName] = useState("")
    const[total_cleaning_fee, setTotalCleaningFee] = useState("")
    const[regular_cleaning, setRegularCleaning] = useState([])
    const[extra, setExtra] = useState([])
    const[distance, setDistance] = useState([])
    const[status, setStatus] = useState([])
    

    
    

    // Retrieve the count for each room type
    const bedroomCount = room_type_and_size.find(room => room.type === "Bedroom")?.number || 0;
    const bathroomCount = room_type_and_size.find(room => room.type === "Bathroom")?.number || 0;
    const kitchen = room_type_and_size.find(room => room.type === "Kitchen")?.number || 0;
    const livingroomCount = room_type_and_size.find(room => room.type === "Livingroom")?.number || 0;

    const bedroomSize = room_type_and_size.find(room => room.type === "Bedroom")?.size || 0;
    const bathroomSize = room_type_and_size.find(room => room.type === "Bathroom")?.size || 0;
    const kitchenSize = room_type_and_size.find(room => room.type === "Kitchen")?.size || 0;
    const livingroomSize = room_type_and_size.find(room => room.type === "Livingroom")?.size || 0;


    useEffect(()=> {
      fetchSchedule()
    },[])

    const fetchSchedule = async() => {
      try {
          
        await userService.getScheduleById(scheduleId)
        .then(response=> {
          const res = response.data
      
          setSchedule(res)
          setRoomTypeSize(res.schedule.selected_apt_room_type_and_size)
          setCleaningDate(res.schedule.cleaning_date)
          setCleaningTime(res.schedule.cleaning_time)
          setCleaningEndTime(res.schedule.cleaning_end_time)
          const lat1 = geolocationData.latitude
          const lon1 = geolocationData.longitude

          const lat2 = res.schedule.apartment_latitude
          const lon2 = res.schedule.apartment_longitude
          const dist = calculateDistance(lat1, lon1, lat2, lon2)
          setDistance(dist)
          setApartmentLatitude(res.schedule.apartment_latitude)
          setApartmentLongitude(res.schedule.apartment_longitude)
          setAddress(res.schedule.address)
          setApartmentName(res.schedule.apartment_name)
          setTotalCleaningFee(res.schedule.total_cleaning_fee)
          setRegularCleaning(res.schedule.regular_cleaning)
          setExtra(res.schedule.extra)
          setStatus(res.status)
          
        })
        
       
      } catch(e) {
        // error reading value
        console.log(e)
      }
    }

    const handleOpenDirections = () => {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentUser.location.latitude},${currentUser.location.longitude }&destination=${apartment_latitude},${apartment_longitude}&travelmode=driving`;
    
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open Google Maps", err)
      );
    };

    

    const gotToTaskScreen = () => {
        navigation.navigate(ROUTES.cleaner_attach_task_photos,{scheduleId:scheduleId})
      }

    const handleClockIn = () => {
      navigation.navigate(ROUTES.cleaner_clock_in, {
        scheduleId:scheduleId,
        schedule:schedule
      })
    }

  return (
    <SafeAreaView
      style={{
        flex:1,
        backgroundColor:COLORS.white,
      }}
    >
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
       
        <GoogleMapComponent 
          latitude={apartment_latitude}
          longitude={apartment_longitude}
        />

        <View style={{height:"55%"}}>  
        <View style={styles.address_direction}>
          <Image source={require('../../assets/google_direction.png')} style={styles.google_direction} />
          <TouchableOpacity 
            onPress={handleOpenDirections}
          >
            <Text bold style={{color:COLORS.gray, fontSize:14}}> Direction</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
        
        <View style={styles.container}>
          
          <CardNoPrimary>
            <View style={styles.centerContent}>
              <Text bold style={styles.headerText}>{apartment_name}</Text>
              <Text style={{color:COLORS.gray, marginBottom:5, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{address}</Text>
              <Text style={{fontSize:13, color:COLORS.light_gray, marginBottom:10,}}>{distance || 0} Miles away</Text>
            </View>

            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:0}}>
                <CircleIcon 
                    iconName="bed-empty"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {bedroomCount}
                    roomSize={bedroomSize}
                    type="Bedrooms"
                /> 
                <CircleIcon 
                    iconName="shower-head"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {bathroomCount}
                    roomSize={bathroomSize}
                    type="Bathrooms"
                /> 
                <CircleIcon 
                  iconName="silverware-fork-knife"
                  buttonSize={26}
                  radiusSise={13}
                  iconSize={16}
                  title= {kitchen}
                  roomSize={kitchenSize}
                  type="Kitchen"
                />
                <CircleIcon 
                  iconName="seat-legroom-extra"
                  buttonSize={26}
                  radiusSise={13}
                  iconSize={16}
                  title= {livingroomCount}
                  roomSize={livingroomSize}
                  type="Livingroom"
                /> 
              </View>
              <Text>More Details(modal to show penalties)</Text>
          </CardNoPrimary>
          

          <Text bold style={{fontSize:16, marginBottom:10, marginHorizontal:5}}>Schedule</Text>
          <CardNoPrimary>
              <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                <CircleIconButton1
                  iconName="calendar"
                  buttonSize={50}
                  radiusSise={25}
                  iconSize={26}
                  title={moment(cleaning_date).format('ddd MMM D')}
                  title_color={COLORS.gray}
                />
                <CircleIconButton1
                 iconName="clock-outline"
                 buttonSize={50}
                 radiusSise={25}
                 iconSize={26}
                 title={`Starts ${moment(cleaning_time, 'h:mm:ss A').format('h:mm A')}`}
                 title_color={COLORS.gray}
                />
                <CircleIconButton1
                 iconName="timer-outline"
                 buttonSize={50}
                 radiusSise={25}
                 iconSize={26}
                 title={`Ends ${moment(cleaning_end_time, 'h:mm:ss A').format('h:mm A')}`}
                 title_color={COLORS.gray}
                />
              </View>
          </CardNoPrimary>

        <View>
        {regular_cleaning.length > 0 && 
          <Card>
            <Text bold style={{fontSize:16, marginBottom:10, marginHorizontal:5}}>Regular Cleaning</Text>
            <View style={styles.chip_container}>
              {regular_cleaning.map((item, index) => (
                <Chip 
                  key={index} 
                  mode="outlined" 
                  style={styles.chip}
                  textStyle={styles.chipText}
                  >
                  <Text style={{fontSize:12}}>{item.label}</Text>
                </Chip>
              ))}
            </View>
          </Card>
        }
          {extra.length > 0 && 

          <Card>
            <Text bold style={{fontSize:16, marginBottom:10, marginHorizontal:5}}>Deep Cleaning</Text>
            <View style={styles.chip_container}>
              {extra.map((item, index) => (
                <Chip 
                  key={index} 
                  mode="outlined" 
                  style={styles.chip}
                  textStyle={styles.chipText}
                  >
                  <Text style={{fontSize:12}}><MaterialCommunityIcons name={item.icon} size={14} /> {item.label} </Text>
                </Chip>
              ))}
            </View>
          </Card>
          
        }
          <View style={{marginTop:20}} />
        </View>
        </View>

        
        </ScrollView>
        </View>
        
       <View style={styles.button}>
        <TouchableOpacity 
          style={styles.decline_button}
        >
          <Text bold style={styles.price}>{geolocationData.currency.symbol}{total_cleaning_fee}</Text>
        </TouchableOpacity>
        <View></View>
        
        {status === 'in_progress' ? (
        <>
        <TouchableOpacity style={styles.clockInbutton} onPress={gotToTaskScreen}>
          <MaterialCommunityIcons name="timer-outline" size={24} color={COLORS.gray} />
          <Text style={styles.buttonText}>
               Go To Work
          </Text>
        </TouchableOpacity>
        
        </>
      ) : status === 'upcoming' ? (

        <TouchableOpacity style={styles.clockInbutton} onPress={handleClockIn}>
          <Text style={styles.buttonText}>
            <MaterialCommunityIcons name="timer-outline" size={24} color={COLORS.gray} /> Clock-In
          </Text>
        </TouchableOpacity>
      ) : null}
        
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
    height: '75%',
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
      // backgroundColor:COLORS.light_gray_1,
      paddingVertical: 0,
      paddingHorizontal: 10,
      borderRadius:10,
      marginTop:-5
    },
    buttonText: {
      color: COLORS.primary,
      fontSize: 14
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
    padding:10,
    marginTop:0
  },
address_bar:{
  // minHeight:40,
  // width:"30%",
  // borderBottomStartRadius:10,
  // backgroundColor:COLORS.light_gray_1,
  // marginTop:-1,

  // position: 'absolute',  // Make it float over address_direction
  //   top: 0,                // Adjust positioning as needed
  //   left: 0,               // Adjust positioning as needed
  //   width: '100%',         // Optional: Full width
    
  },

  address_direction:{
    // alignItems:'flex-end',
    // backgroundColor:'rgba(0, 0, 0, 0.0)'

    backgroundColor: 'white', // Optional: Set a background color
    paddingHorizontal: 10,
    paddingVertical:15,
    elevation: 4,          // For Android shadow
    shadowColor: '#000',   // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection:'row', 
    alignItems:"center", 
    paddingLeft:15
    
  },
  clockInbutton:{
    flexDirection:'row',
    marginTop:0,
    alignItems:'center'
  },
  google_direction:{
    width:16,
    height:16
  },
  chip_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center', // Ensures wrapping works properly
    padding: 5,
    gap: 8, // Adjust spacing between chips
  
  },
  chip: {
    height: 35,   // Reduce the chip height
    paddingHorizontal: 0,  // Reduce padding inside the chip
    borderRadius: 17,  // Make it more compact
    borderWidth:0.5,
    borderColor:COLORS.light_gray,
    backgroundColor:'#f9f9f9',
    flexShrink: 1,
  },
  chipText: {
    fontSize: 12,  // Reduce font size
    fontWeight: 'normal',  // Normal font weight
    color:COLORS.gray
  },
  })


  