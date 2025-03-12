import React, { useContext, useEffect,useState } from 'react';
import { SafeAreaView,StyleSheet, StatusBar, Button, Linking, FlatList, ScrollView, Modal, Image, View, useWindowDimensions, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
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
import CircleIconButton1 from '../../components/CircleButton1';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ClockInConfirmation from './ClockInConfirmation';
import CircleIcon from '../../components/CirecleIcon';
import { AuthContext } from '../../context/AuthContext';
import ROUTES from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';
import GoogleDirections from '../../components/GoogleDirections';
import CardNoPrimary from '../../components/CardNoPrimary';
import ConfirmationModal from '../../components/ConfirmationModal';




export default function JobDetails({route}) {

const navigation = useNavigation();

const {item, currentUser} = route.params
const {currentUserId} = useContext(AuthContext)


console.log("params2")
console.log(item)
console.log(JSON.stringify(currentUser, null, 2))
console.log("params2")
const distanceInKm = 10; // Example distance in kilometers
const averageSpeedKph = 50; // Example average speed in kilometers per hour
const eta = calculateETA(distanceInKm, averageSpeedKph);

console.log("eta--------------")
console.log(eta.toLocaleString())
console.log(new Date().toLocaleString())
const date1 = moment(eta.toLocaleString(), "M/DD/YYYY, h:mm:ss A");
const date2 = moment(new Date().toLocaleString(), "M/DD/YYYY, h:mm:ss A");
const differenceInMinutes = date1.diff(date2, 'minutes');
console.log(differenceInMinutes)
console.log("eta--------------")

const dateTime = moment(eta.toLocaleString(), 'M/D/YYYY, h:mm:ss A');

const time_to_destination = dateTime.minutes()

console.log("ETA1:", time_to_destination+ " min"); // Output ETA in local date/time format
const date = moment("Sun Mar 24 2024").format('ddd MMM D')
const time = moment("9:51:00 AM").format('h:mm A')
console.log(date)
console.log(time)


const { width } = useWindowDimensions();
const numColumns2 = 2
const columnWidth2 = width / numColumns2 - 10; // Adjusted width to accommodate margins

const[isOpenConfirmation, setIsOpenConfirmatiom] = useState("")
const[isOpenModal, setOpenModal] = useState(false)
const[regular_cleaning, setRegularCleaning] = useState(item.regular_cleaning)
const[extra_cleaning, setExtarCleaning] = useState(item.extra)
const[apartment_name, setApartmentName] = useState(item.apartment_name)
const[address, setAddress] = useState(item.address)
const[bedroom, setBedroom] = useState(item.bedroom)
const[bathroom, setBathroom] = useState(item.bathroom)
const[loading, setLoading] = useState(false)
const[successModalVisible, setSuccessModalVisible] = useState(false);
const[failedModalVisible, setFailedModalVisible] = useState(false);
const[room_type_and_size, setRoomTypeSize] = useState(item.selected_apt_room_type_and_size)

const cleaning_date = item.cleaning_date
const cleaning_time = item.cleaning_time

// Retrieve the count for each room type
const bedroomCount = room_type_and_size.find(room => room.type === "Bedroom")?.number || 0;
const bathroomCount = room_type_and_size.find(room => room.type === "Bathroom")?.number || 0;
const livingroomCount = room_type_and_size.find(room => room.type === "Livingroom")?.number || 0;



  const openGoogleMaps = async () => {
    const origin = `${currentUser.location.latitude}, ${currentUser.location.longitude}`; // Example: San Francisco (latitude, longitude)
    const destination = `${item.apartment_latitude},${item.apartment_longitude}`; // Example: Los Angeles (latitude, longitude)
    const travelMode = 'driving'; // driving, walking, transit, bicycling
      
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`;
  
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Google Maps cannot be opened');
    }
  };

const taskItem = ( {item, index} ) => (
  <View style={[styles.tasks, { width: columnWidth2 }]}>
      <Text style={{fontSize:13}}>{item.label} </Text>
  </View>
  
)

const onClose = () => {
  setOpenModal(false)
}
const taskItem2 = ( {item,index} ) => (
  <View style={[styles.tasks, { width: columnWidth2 }]}>
      <Text style={{fontSize:14}}><MaterialCommunityIcons name={item.icon} size={16} /> {item.label} </Text>
  </View>
  
)


const handleOpenModal = () => {
  setOpenModal(true)
}
const handleCloseModal = () => {
  setOpenModal(false)
}

const handle_application = async()=>{
    
    // Close modal
    setOpenModal(false)
    setLoading(true);
    const applicationData = 
        {
            "scheduleId": item._id,
            "schedule":item,
            "hostId": item.hostId,
            "cleanerId": currentUser['_id'],
            "firstname": currentUser['firstname'],
            "lastname": currentUser['lastname'],
            "email": currentUser['email'],
            "phone": currentUser['phone'],
            "userType": currentUser['userType'],
            "location": currentUser['location'],
            "contact": currentUser['contact'],
            "aboutme": currentUser['aboutme'],
            "availability": currentUser['availability'],
            "certification": currentUser['certification'],
            "avatar": currentUser['avatar'],
            "presence_status": currentUser['presence_status'],
            "account_verification": currentUser['account_verification'],
            "distance": "",
            "expo_push_token": currentUser["expo_push_token"]
        }
       
    


    try {

        // setLoading(true)
        // Simulate a 3-second delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        await userService.addApplication(applicationData)
        .then(response=> {
          const res = response.data
          console.log(res)
            // Show success modal
            
            
            if(res.status ==="success"){
                setSuccessModalVisible(true);
            }else{
                setFailedModalVisible(true);
            }
        })
    
        setLoading(false)
  
        // return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch(e) {
        // error reading value
        console.log(e)
        setFailedModalVisible(true);
      }
  

}


const gotToTaskScreen = () => {
  navigation.navigate(ROUTES.cleaner_attach_task_photos,{scheduleId:item.item._id})
}


const renderItem = ({ item }) => {
  switch (item.type) {
    

      case 'circleicons' :
      return (
        <View style={styles.container}>
          <CardNoPrimary>
            <View style={styles.centerContent}>
              <Text bold style={styles.headerText}>{apartment_name}</Text>
              <Text style={{color:COLORS.gray, marginBottom:10, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{address}</Text>
            </View>
            {/* <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginTop:5}}> */}

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
          
            {/* </View> */}
            
          </CardNoPrimary>

        <Card>
        <View><Text bold style={{fontSize:16, textAlign:'center', color:COLORS.deepBlue}}>Schedule</Text></View>
        <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
              <CircleIconButton1
                iconName="calendar"
                buttonSize={50}
                radiusSise={25}
                iconSize={26}
                title={moment(cleaning_date).format('ddd MMM D')}
                title_color={COLORS.deepBlue}
              />
              <CircleIconButton1
                iconName="clock-outline"
                buttonSize={50}
                radiusSise={25}
                iconSize={26}
                title={moment(cleaning_time, 'h:mm:ss A').format('h:mm A')}
                title_color={COLORS.deepBlue}
              />
              <CircleIconButton1
                iconName="timer-outline"
                buttonSize={50}
                radiusSise={25}
                iconSize={26}
                title="2hrs Task"
                title_color={COLORS.deepBlue}
              />
            </View>
        </Card>

       </View> 
      );

      case 'taskItem':
        return (
          <View>
            <CardNoPrimary>
              <FlatList
                  data={regular_cleaning}
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
            {extra_cleaning.length > 0 && 
            <CardNoPrimary>
              
              <FlatList
                data={extra_cleaning}
                renderItem = {taskItem2}
                ListHeaderComponent={<Text bold style={{fontSize:16}}>Deep Cleaning</Text>}
                ListHeaderComponentStyle={styles.list_header}
                // ListEmptyComponent= {emptyListing}
                // ItemSeparatorComponent={itemSeparator}
                keyExtractor={(item, index)=> item.label}
                numColumns={numColumns2}
                // showsVerticalScrollIndicator={false}
              />
            
            </CardNoPrimary>
            }
          </View>
        )

    }

    
}

const data = [
  { type: 'googledirection' },
  { type: 'circleicons' },
  { type: 'taskItem'},
  { type: 'camera' },
  { type: 'coloredCard' },
];


  
// Check is cleaner already applied for the job
const cleanerApplications = item.cleaner_applications || [];
const exists = cleanerApplications.includes(currentUser._id)

console.log("cleaners..........")
console.log(exists)
console.log(currentUser._id)
console.log("cleaners..........")


  return (
    <SafeAreaView
      style={{
        flex:1,
        backgroundColor:COLORS.backgroundColor,
      }}
    >
        {/* <StatusBar translucent backgroundColor="transparent" /> */}
        
        {/* <GoogleDirections 
          origin={{
            latitude:currentUser.location.latitude,
            longitude:currentUser.location.longitude
          }}
          destination={{
            latitude:item.apartment_latitude,
            longitude:item.apartment_longitude
          }}
        /> */}

        <GoogleMapComponent
          latitude={item.apartment_latitude}
          longitude={item.apartment_longitude}
        />
        <View style={{flexDirection:'row', alignItems:"center", paddingVertical:10, paddingLeft:15, backgroundColor:"#f1f1f1"}}>
          <Image source={require('../../assets/google_direction.png')} style={styles.google_direction} />
          <TouchableOpacity 
            onPress={openGoogleMaps}
          >
            <Text style={{color:COLORS.gray}}> Direction</Text>
          </TouchableOpacity>
        </View>
    
      <View style={styles.container}> 
      {loading ? (
        // Display the loading spinner while loading is true
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        // Display the content when not loading
        <>
          <Text style={styles.text}></Text>
          
        </>
          )}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        
      </View>

        <Modal 
            visible={isOpenModal}
            animationType="slide" 
            transparent={true}
            // animationType="none" // No animation
            statusBarTranslucent={true}
            // onRequestClose={()=> {handleCloseConfirmClockIn()}} // Handle hardware back button on Android
          >
            <ConfirmationModal
              handle_action={handle_application}
              title="Are you sure you want to apply for this job?"
              body="By applying, you agree to accept the cleaning job under the specified terms."
              close_modal={handleCloseModal}
            />
            
            {/* <StatusBar backgroundColor="transparent" translucent={true} /> */}
          </Modal>

          <Modal
              animationType="slide"
              transparent={true}
              visible={successModalVisible}
              onRequestClose={() => {
                  setSuccessModalVisible(!successModalVisible);
              }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Application Submitted Successfully!</Text>
                        <TouchableOpacity
                            style={[styles.buttonOk, styles.buttonClose]}
                            // onPress={() => setSuccessModalVisible(!successModalVisible)}
                            onPress={() => navigation.navigate(ROUTES.cleaner_jobs) }
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
          <Modal
              animationType="slide"
              transparent={true}
              visible={failedModalVisible}
              onRequestClose={() => {
                  setFailedModalVisible(!failedModalVisible);
              }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Something went wrong. Please try again later!</Text>
                        <TouchableOpacity
                            style={[styles.buttonOk, styles.buttonClose]}
                            onPress={() => setFailedModalVisible(!failedModalVisible)}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
       
        
    { exists ?
        <View style={styles.button_disable}>
            
            
            <Pressable 
            style={styles.accept_button}
            >
            
            <Text bold style={styles.buttonacceptTextDisable}> Already Apply</Text>
            </Pressable>
        
        </View>

        :

        <View style={styles.button}>
            
            
            <TouchableOpacity 
            style={styles.accept_button}
            onPress={handleOpenModal}
            >
            
            <Text bold style={styles.buttonacceptText}><MaterialCommunityIcons name="check-all" size={24} color={COLORS.white} /> Apply Now</Text>
            </TouchableOpacity>
        
        </View>
}
    </SafeAreaView>
  )

  
}

const styles = StyleSheet.create({
   container:{
    flex:1,
    marginHorizontal:5,
    marginBottom:20
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
      fontSize:16,
      fontWeight:'60'
    },
    button: {
      flexDirection:'row',
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
     justifyContent:'center'
    },
    button_disable: {
      flexDirection:'row',
      backgroundColor: COLORS.light_gray_1,
      paddingVertical: 12,
      paddingHorizontal: 20,
     justifyContent:'center'
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18
    },
    title:{
      fontSize:20,
      fontWeight:'60'
    },
   
    buttonacceptText: {
        color: '#fff',
        fontSize: 18
    },
    buttonacceptTextDisable: {
        color: COLORS.gray,
        fontSize: 18
    },



    modalView: {
        marginTop:270,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonOk: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,

    },
    buttonClose: {
        backgroundColor:COLORS.primary,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize:18

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
    google_direction:{
      width:16,
      height:16
    }
    
  })

