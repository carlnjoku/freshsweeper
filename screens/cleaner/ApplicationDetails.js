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




export default function ApplicationDetails({route, get_applicationId}) {

const navigation = useNavigation();

const {item, currentUser} = route.params
const {currentUserId} = useContext(AuthContext)


console.log("params2")
console.log(item._id)
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
const[regular_cleaning, setRegularCleaning] = useState(item.schedule.regular_cleaning)
const[extra_cleaning, setExtarCleaning] = useState(item.schedule.extra)
const[apartment_name, setApartmentName] = useState(item.schedule.apartment_name)
const[address, setAddress] = useState(item.schedule.address)
const[bedroom, setBedroom] = useState(item.schedule.bedroom)
const[bathroom, setBathroom] = useState(item.schedule.bathroom)
const[livingroom, setLivingroom] = useState(item.schedule.livingroom)
const[loading, setLoading] = useState(false)

const[successModalVisible, setSuccessModalVisible] = useState(false);
const[failedModalVisible, setFailedModalVisible] = useState(false);


const[return_message, setReturnMsg] = useState("");
const[applicaId, setApplicationId] = useState(false);

const cleaning_date = item.schedule.cleaning_date
const cleaning_time = item.schedule.cleaning_time

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

const handleCancel = () => {
  setOpenModal(true)
}

const removeDeleteItemFromList = () => {
  // const applId = item._id
  // get_applicationId(applId)
  // navigation.navigate(ROUTES.cleaner_application)
}

const handle_cancellation = async()=>{
    
    // Close modal
    setOpenModal(false)
    setLoading(true);
    const applicationId = item._id
    try {

        // setLoading(true)
        // Simulate a 3-second delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        await userService.deleteApplication(applicationId)
        .then(response=> {
          const res = response.data
          console.log(res)
            // Show success modal
            
            console.log(JSON.stringify(res, null, 2))
            
            if(res.status ==="success"){
                setReturnMsg(res.message)
                setLoading(false);
                setSuccessModalVisible(true);
                get_applicationId(applicationId)
            }else{
                setReturnMsg(res.message)
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
              <Text bold style={styles.title}>{apartment_name}</Text>
              <Text style={{color:COLORS.gray, marginBottom:10, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{address}</Text>
            </View>
            {/* <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginTop:5}}> */}

            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:0}}>
                <CircleIcon 
                    iconName="bed-empty"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {bedroom}
                    type="Bedrooms"
                /> 
                <CircleIcon 
                    iconName="shower-head"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {bathroom}
                    type="Bathrooms"
                /> 
                <CircleIcon 
                    iconName="seat-legroom-extra"
                    buttonSize={26}
                    radiusSise={13}
                    iconSize={16}
                    title= {bathroom}
                    type="Livingroom"
                /> 
              </View>
          
            {/* </View> */}
            
          </CardNoPrimary>

        <CardColored>
            <View><Text bold style={{fontSize:20, textAlign:'center', color:'#fff'}}>Schedule</Text></View>
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
                title={moment(cleaning_date+ +cleaning_time, 'ddd MMM DD YYYY h:mm:ss A').format('h:mm A')}
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




  return (
    <SafeAreaView
      style={{
        flex:1,
        backgroundColor:COLORS.backgroundColor,
      }}
    >
        {/* <StatusBar translucent backgroundColor="transparent" /> */}
        
        
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
              handle_action={handle_cancellation}
              handle_remove_item={removeDeleteItemFromList}
              title="Cancel Application"
              body="Are you sure you want to cancel your application for this cleaning job? This action cannot be undone."
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
                        <Text style={styles.modalText}>{return_message}!</Text>
                        <TouchableOpacity
                            style={[styles.buttonOk, styles.buttonClose]}
                            // onPress={() => setSuccessModalVisible(!successModalVisible)}
                            onPress={() => navigation.navigate(ROUTES.cleaner_application) }
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
                        <Text style={styles.modalText}>{return_message}!</Text>
                        <TouchableOpacity
                            style={[styles.buttonOk, styles.buttonClose]}
                            onPress={() => setFailedModalVisible(!failedModalVisible)}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
       
        
   
        <View style={styles.button}>
        
        <View><Text bold style={styles.price}>{item.location.currency.symbol}{item.schedule.totalPrice}</Text></View>
        <View></View>
        
        <TouchableOpacity 
          style={styles.accept_button} onPress={handleCancel}
        >
          
          <Text bold style={styles.buttonacceptText}><MaterialCommunityIcons name="check-all" size={24} color={COLORS.white} /> Cancel</Text>
        </TouchableOpacity>
        
        </View>

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
      backgroundColor: COLORS.white,
      paddingVertical: 12,
      paddingHorizontal: 20,
      justifyContent:'space-between',
      borderTopWidth:1,
      borderColor:COLORS.light_gray_1
    },
    button_disable: {
      flexDirection:'row',
      backgroundColor: COLORS.light_gray_1,
      paddingVertical: 12,
      paddingHorizontal: 20,
     justifyContent:'center'
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

    price:{
      fontSize:24,
      fontWeight:'600',
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
    
  })

