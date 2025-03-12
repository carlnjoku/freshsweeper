import React, { useContext, useEffect, useRef,useState } from 'react';
import { SafeAreaView,StyleSheet, StatusBar, Button, Linking,  Animated, PanResponder, FlatList, ScrollView, Modal, Image, View, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import ModeSelector from './ModeSelector';
import * as Location from 'expo-location';  // Import the location module from Expo

export default function ScheduleDetails({route}) {

const navigation = useNavigation();

const {item} = route.params
const {currentUserId, currentUser} = useContext(AuthContext)
const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

console.log("params2")
console.log(item)
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
const[room_type_and_size, setRoomTypeSize] = useState(item.schedule.selected_apt_room_type_and_size)
const[mode_distance, setModeDistance] = useState({})
const[selectedMode, setSelectedMode] = useState('driving'); // State for selected mode
const[mapRegion, setMapRegion] = useState(null);
const[etaDistance, setEtaDistance] = useState({});
const[directions, setDirections] = useState(null); // State for directions to display on the map
const [coordinates, setCoordinates] = useState(null);
const [errorMsg, setErrorMsg] = useState(null);

const mapRef = useRef(null); // Reference to map
// const allEta = {
//     driving: '10 mins',
//     transit: '20 mins',
//     walking: '30 mins',
// };
// const allDistances = {
//     driving: 5,
//     transit: 10,
//     walking: 2,
// };
// const allDirections = {
//     driving: [{ latitude: 10, longitude: 20 }], // Replace with actual coordinates
//     transit: [{ latitude: 15, longitude: 25 }],
//     walking: [{ latitude: 30, longitude: 40 }],
// };
// const origin = { latitude: 12.34, longitude: 56.78 };


// Retrieve the count for each room type
const bedroomCount = room_type_and_size.find(room => room.type === "Bedroom")?.number || 0;
const bathroomCount = room_type_and_size.find(room => room.type === "Bathroom")?.number || 0;
const kitchen = room_type_and_size.find(room => room.type === "Kitchen")?.number || 0;
const livingroomCount = room_type_and_size.find(room => room.type === "Livingroom")?.number || 0;


const bedroomSize = room_type_and_size.find(room => room.type === "Bedroom")?.size || 0;
const bathroomSize = room_type_and_size.find(room => room.type === "Bathroom")?.size || 0;
const kitchenSize = room_type_and_size.find(room => room.type === "Kitchen")?.size || 0;
const livingroomSize = room_type_and_size.find(room => room.type === "Livingroom")?.size || 0;

const cleaning_date = item.schedule.cleaning_date
const cleaning_time = item.schedule.cleaning_time



useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    
    setCoordinates({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  })();
  
}, []);

const [lastPosition, setLastPosition] = useState(0);

const initialPosition = 0; // Original position at the top
const dragLimit = 300; // Maximum distance allowed for dragging down

const panResponder = PanResponder.create({
  onMoveShouldSetPanResponder: () => true,
  onPanResponderMove: (evt, gestureState) => {
    // Allow dragging both up and down but within the drag limit
    const newTranslateY = gestureState.dy + lastPosition;
    if (newTranslateY <= dragLimit && newTranslateY >= initialPosition) {
      pan.setValue({ x: 0, y: newTranslateY });
    }
  },
  onPanResponderRelease: (evt, gestureState) => {
    const newPosition = gestureState.dy + lastPosition;

    if (newPosition < dragLimit / 2) {
      // Snap back up if dragged less than halfway down
      Animated.spring(pan, {
        toValue: { x: 0, y: initialPosition },
        useNativeDriver: true,
      }).start(() => setLastPosition(initialPosition));
    } else {
      // Else, stay at the dragged position
      setLastPosition(newPosition);
      pan.flattenOffset();
    }
  },
});

useEffect(()=> {
  getDistance()
},[])

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

const handleClockIn = () => {
  handleOpenConfirmClockIn()
}

const gotToTaskScreen = () => {
  navigation.navigate(ROUTES.cleaner_attach_task_photos,{scheduleId:item._id})
}


const handleOpenDirections = () => {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${currentUser.location.latitude},${currentUser.location.longitude }&destination=${item.schedule.apartment_latitude},${item.schedule.apartment_longitude}&travelmode=driving`;

  Linking.openURL(url).catch((err) =>
    console.error("Failed to open Google Maps", err)
  );
};

const renderItem = ({ item }) => {
  switch (item.type) {
    

      case 'circleicons' :
      return (
        <View style={styles.container}>
          <Card>
          <View style={styles.centerContent}>
            {/* <AntDesign name="home" size={60} color={COLORS.gray}/>  */}
            <Text bold style={styles.headerText}>{apartment_name}</Text>
            <Text style={{color:COLORS.gray, marginBottom:10, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{address}</Text>
          </View>

            {/* <Text bold style={styles.title}>{apartment_name}</Text>
            <Text style={{color:COLORS.gray, marginBottom:10, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{address}</Text>
             */}
              <View>
                <Text>Current Coordinates:</Text>
                {errorMsg ? (
                  <Text>{errorMsg}</Text>
                ) : coordinates ? (
                  <Text>Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}</Text>
                ) : (
                  <Text>Fetching coordinates...</Text>
                )}
              </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:5}}>
                <CircleIcon 
                  iconName="bed-empty"
                  buttonSize={26}
                  radiusSise={13}
                  iconSize={16}
                  roomSize={bedroomSize}
                  title= {bedroomCount}
                  type="Bedrooms"
                /> 
                <CircleIcon 
                  iconName="shower-head"
                  buttonSize={26}
                  radiusSise={13}
                  iconSize={16}
                  roomSize={bathroomSize}
                  title= {bathroomCount}
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
                  roomSize={livingroomSize}
                  title= {livingroomCount}
                  type="Livingroom"
                /> 
              </View>
          
           
            
          </Card>

        <Card>
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
            <Card>
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
            </Card>

            <Card>
              <FlatList
                data={extra_cleaning}
                renderItem = {taskItem2}
                ListHeaderComponent={<Text bold style={{fontSize:16}}>Deep Cleaning</Text>}
                ListHeaderComponentStyle={styles.list_header}
                // ListEmptyComponent= {emptyListing}
                // ItemSeparatorComponent={itemSeparator}
                keyExtractor={(item, index)=> item.label}
                numColumns={numColumns2}
                showsVerticalScrollIndicator={false}
              />
            </Card>
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




const getDistance = (a) => {
  // alert("recall")
  console.log("coopeeeeeer")
  console.log(a)
  console.log("coopeeeeeer")
  setModeDistance(a)
}


const handleModeChange = (mode) => {
  // alert("latitude", origin.latitude);
  
  setSelectedMode(mode);
  setDirections(allDirections[mode]);
  console.log("All directions..........................")
  // console.log(allDirections[mode])

  if (mapRef.current) {
      mapRef.current.fitToCoordinates(allDirections[mode], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
      });
  }
  

  setMapRegion({
      latitude: origin.latitude,
      longitude: origin.longitude,
      latitudeDelta: 0.008,
      longitudeDelta: 0.0041,
  });

  const eta_and_distance = {
      _eta: allEta[mode],
      _distance: allDistances[mode]
  };
  setEtaDistance(eta_and_distance);

  console.log(allEta[mode]);
  console.log(`Distance in ${mode}: ${allDistances[mode]} miles`);

  const mode_distance = {
      mode: mode,
      distance: allEta[mode]
  };
  // alert("607");
  // getModeChange(mode_distance);
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:COLORS.primary}}>
  {/* Google Directions Component */}
  <GoogleDirections 
    // origin={{ latitude: !coordinates.latitude? currentUser.location.latitude, longitude: !coordinates.longitude?currentUser.location.longitude }}
    origin={{
      latitude: coordinates?.latitude || currentUser.location.latitude,
      longitude: coordinates?.longitude || currentUser.location.longitude
    }}
    destination={{ latitude: item.schedule.apartment_latitude, longitude: item.schedule.apartment_longitude}}
    triggerMap = {handleModeChange}
  />

  {/* Draggable Main Content Container */}
  <Animated.View
      style={[
        styles.mainContent,
        {
          transform: [
            {
              translateY: pan.y.interpolate({
                inputRange: [0, 300],    // Set the drag range (e.g., 0 to 300)
                outputRange: [0, 300],   // Control movement in the visible area
                extrapolate: 'clamp',    // Prevent movement outside the range
              }),
            },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Header Section */}
 

  {/* Drag Handle */}
  <View style={styles.dragHandleContainer}>
    <View style={styles.dragHandle} />
  </View>

    <ScrollView contentContainerStyle={styles.container}>
          <Text>{mode_distance?.mode}</Text>
          <View style={styles.animatedView}>
                <Text style={styles.distance_text}>{etaDistance?._eta} <Text> ({etaDistance?._distance} miles) </Text></Text>
                </View>
          <View style={styles.modeContainer}>
          {/* <ModeSelector 
              selectedMode={selectedMode} 
              handleModeChange={handleModeChange} 
              allEta={allEta} 
          /> */}
                {/* <ChipIcon
                    onPress={() => getDistance('driving')}
                    iconName="car-outline"
                    // label={mode_distance.mode}
                    label={20}
                    iconSize={18}
                    active={selectedMode === 'driving'}
                />
                <ChipIcon
                    onPress={() => getDistance('transit')}
                    iconName="train"
                    // label={mode_distance.transit}
                    label={40}
                    iconSize={17}
                    active={selectedMode === 'transit'}
                />
                <ChipIcon
                    onPress={() => getDistance('walking')}
                    iconName="walk"
                    // label={mode_distance.walking}
                    label={60}
                    iconSize={18}
                    active={selectedMode === 'walking'}
                /> */}

             {/* Inside GoogleDirections component */}
            

                
            </View>

      {/* Data List */}
      <FlatList 
        data={data} 
        renderItem={renderItem} 
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Modal for Confirmation */}
      <Modal
        visible={isOpenModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
      >
        <ClockInConfirmation
          cleanerId={currentUserId}
          scheduleId={item._id}
          cleaning_date={item.schedule.cleaning_date}
          cleaning_time={item.schedule.cleaning_time}
          total_cleaning_time={item.schedule.total_cleaning_time}
          close_modal={handleCloseConfirmClockIn}
        />
      </Modal>

      {/* Conditional Buttons */}
      {item.status === 'in_progress' ? (
        <>
        <TouchableOpacity style={styles.button} onPress={gotToTaskScreen}>
          <MaterialCommunityIcons name="timer-outline" size={24} color={COLORS.white} />
          <Text style={styles.buttonText}>
              View progress
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleOpenDirections}>
          <MaterialCommunityIcons name="timer-outline" size={24} color={COLORS.white} />
          <Text style={styles.buttonText}>
              Direction
          </Text>
        </TouchableOpacity>
        </>
      ) : item.status === 'upcoming' ? (
        <TouchableOpacity style={styles.button} onPress={handleClockIn}>
          <Text style={styles.buttonText}>
            <MaterialCommunityIcons name="timer-outline" size={28} color={COLORS.white} /> Clock-In
          </Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  </Animated.View>
</SafeAreaView>
  )

  
}

const styles = StyleSheet.create({
   container:{
    flex:1,
    marginHorizontal:10,
    marginBottom:20
   },
  mainContent: {
    position: 'absolute',
    bottom: 0,
    height: '55%',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2, // Negative height creates a shadow above the component
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
  },

  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomColor:COLORS.light_gray_1,
    borderBottomWidth:1
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
      fontSize:16,
      fontWeight:'60'
    },
    button: {
      flexDirection:'row',
      backgroundColor: COLORS.deepBlue,
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius:50,
     justifyContent:'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight:'bold'
    },
    title:{
      fontSize:20,
      fontWeight:'60'
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
  distance_text:{
    color:'#00A86B',
    textAlign:'center'
    
},
// animatedView: {
//     // backgroundColor:'#00A86B',
//     paddingLeft:10,
//     padding:7,
//     borderTopRightRadius:5,
//     borderBottomRightRadius:5,
//     marginRight:10
// },
  })
