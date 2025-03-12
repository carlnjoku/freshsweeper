import React, { useEffect, useState, useContext } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, useWindowDimensions, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import userService from '../../services/userService';
import COLORS from '../../constants/colors';
import { Avatar, Chip, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../../components/StarRating';
import GoogleDirections from '../../components/GoogleDirections';
import CircleIconButton1 from '../../components/CircleButton1';
import CardColored from '../../components/CardColored';
import Card from '../../components/Card';
import CircleIcon from '../../components/CirecleIcon';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import CircularIcon from '../../components/CircularIcon';
import ROUTES from '../../constants/routes';
import { AuthContext } from '../../context/AuthContext';
import calculateDistance from '../../utils/calculateDistance';

export default function ScheduleDetails({navigation, route}) {
    
    const {item, scheduleId} = route.params

    const{
      fbaseUser,
      setTotalUnreadCount,
      friendsWithLastMessagesUnread
    } = useContext(AuthContext)
    
    
  

    console.log("extraaaaaaaa11..............")
    // console.log(JSON.stringify(friendsWithLastMessagesUnread, null, 2))
    console.log("extraaaaaaaa..............")

    const [loading, setLoading] = useState(true); // Add loading state
    const[schedule, setSchedule] = useState("")
    const[regular_cleaning, setRegularCleaning] = useState("")
    const[extra_cleaning, setExtarCleaning] = useState("")
    const[cleaning_date, setCleaningDate] = useState("")
    const[cleaning_time, setCleaningTime] = useState("")
    const[cleaning_end_time, setCleaningEndTime] = useState("")
    const[apartment_name, setApartmentName] = useState("")
    const[room_type_and_size, setRoomTypeSize] = useState([])
    const[address, setAddress] = useState("")
    const[assignedTo, setAssignedTo] = useState("")
    const[cleaner_latitude, setCleanerLatitude] = useState("")
    const[cleaner_longitude, setCleanerLongitude] = useState("")
    const[apartment_latitude, setApartmentLatitude] = useState("")
    const[apartment_longitude, setApartmentLongitude] = useState("")
    
  
    // Retrieve the count for each room type
    const bedroomCount = room_type_and_size.find(room => room.type === "Bedroom")?.number || 0;
    const bathroomCount = room_type_and_size.find(room => room.type === "Bathroom")?.number || 0;
    const kitchen = room_type_and_size.find(room => room.type === "Kitchen")?.number || 0;
    const livingroomCount = room_type_and_size.find(room => room.type === "Livingroom")?.number || 0;
    
    const bedroomSize = room_type_and_size.find(room => room.type === "Bedroom")?.size || 0;
    const bathroomSize = room_type_and_size.find(room => room.type === "Bathroom")?.size || 0;
    const kitchenSize = room_type_and_size.find(room => room.type === "Kitchen")?.size || 0;
    const livingroomSize = room_type_and_size.find(room => room.type === "Livingroom")?.size || 0;

    const { width } = useWindowDimensions();
    const numColumns2 = 3
    const columnWidth2 = width / numColumns2 - 10; // Adjusted width to accommodate margins

   
    // filter friend form friend list in the firebase Friendlist with cleanerId and scheduleId 
    const index = friendsWithLastMessagesUnread.findIndex(
      (friend) =>
        friend.userId === assignedTo?.cleanerId && friend.scheduleId === scheduleId
    );

  
    
    const specificFriend = index !== -1 ? friendsWithLastMessagesUnread[index] : null;
  
    const[selectedUser] = useState({
      userId : assignedTo?.cleanerId,
      firstname: assignedTo?.firstname,
      lastname: assignedTo?.lastname,
      avatar: assignedTo?.avatar,
      chatroomId:specificFriend?.chatroomId
    })
    console.log("spec.................")
    // console.log(JSON.stringify(selectedUser, null, 2))
    console.log("spec.................")

    
    useEffect(()=> {
        fetchSchedule()
    },[])

    const fetchSchedule = async() => {
      try {
        setLoading(true); // Start loading
        await userService.getScheduleById(scheduleId)
        .then(response=> {
          const res = response.data
          setSchedule(res)
          setRegularCleaning(res.schedule.regular_cleaning)
          setExtarCleaning(res.schedule.extra)
          setCleaningDate(res.schedule.cleaning_date)
          setCleaningTime(res.schedule.cleaning_time)
          setCleaningEndTime(res.schedule.cleaning_end_time)
          setApartmentName(res.schedule.apartment_name)
          setRoomTypeSize(res.schedule.selected_apt_room_type_and_size)
          setAddress(res.schedule.address)
          setAssignedTo(res.assignedTo)
          setCleanerLatitude(res.assignedTo.cleaner_latitude)
          setCleanerLongitude(res.assignedTo.cleaner_longitude)
          setApartmentLatitude(res.schedule.apartment_latitude)
          setApartmentLongitude(res.schedule.apartment_longitude)
          setTargetCleanerId(res?.assignedTo?.cleanerId)
          setTargetScheduleId(res._id)
        })
        
       
      } catch(e) {
        // error reading value
        console.log(e)
      }finally {
        setLoading(false); // Stop loading
      }
    }

    const makeCall = (number) => {
      const url = `tel:${number}`;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            Alert.alert('Phone number is not available');
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => console.log(err));
    };
    const callPhone = () => {
      // alert("hey")
      makeCall(item?.contact?.phone)
    }

    const openExisitingConversation = () => {
    
      navigation.navigate(ROUTES.chat_conversation,{
          selectedUser:selectedUser,
          fbaseUser: fbaseUser,
          schedule: schedule,
          friendIndex: index
      })
    }


    const taskItem = ( {item, index} ) => (
        <View style={styles.chip_container}>
            {/* <Text style={{fontSize:13}}>{item.label} </Text> */}
            <Chip 
              mode="outlined" 
              style={styles.chip}
              textStyle={styles.chipText} 
            >
              {item.label}
            </Chip>
            
        </View>
        
      )

      const taskItem2 = ( {item,index} ) => (
        <View style={[styles.tasks, { width: columnWidth2 }]}>
            <Text style={{fontSize:14}}><MaterialCommunityIcons name={item.icon} size={16} /> {item.label} </Text>
        </View>
        
      )

      const renderItem = ({ item }) => {
        switch (item.type) {

            case 'circleicons' :
                return(
                    <View style={styles.container}>
                      
                        <Card>
                          <View style={styles.centerContent}>
                            <AntDesign name="home" size={60} color={COLORS.gray}/> 
                            <Text bold style={styles.headerText}>{apartment_name}</Text>
                            <Text style={{color:COLORS.gray, marginBottom:10, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{address}</Text>
                          </View>

                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:5}}>
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
                        </Card>
                        
                        <View style={{marginHorizontal:5}}>
                        <Text bold style={{fontSize:16, marginBottom:0}}>Schedule</Text>
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
                              title={`Starts ${moment(cleaning_time, 'h:mm:ss A').format('h:mm A')}`}
                              title_color={COLORS.white}
                            />
                            <CircleIconButton1
                              iconName="timer-outline"
                              buttonSize={50}
                              radiusSise={25}
                              iconSize={26}
                              title={`Ends ${moment(cleaning_end_time, 'h:mm:ss A').format('h:mm A')}`}
                              title_color={COLORS.white}
                            />
                            </View>
                        </CardColored>
                        {!assignedTo?.cleanerId ? "" :
                        <Card>
                        <Text bold style={{fontSize:16, marginBottom:10}}>Assigned Cleaner</Text>
                        <View style={styles.communicate}>
            
                            <View style={{flexDirection:'row', alignItems:'flex-start'}}>
                              <Avatar.Image
                                size={40} 
                                source={{uri:assignedTo?.avatar}}
                                style={{backgroundColor:COLORS.gary}}
                              />
                              <View>
                                <Text style={{marginLeft:5, fontWeight:'500', fontSize:14}}>{assignedTo?.firstname} {assignedTo?.lastname}</Text>
                                <Text style={{fontSize:12, color:COLORS.gray, marginLeft:0}}> {calculateDistance(cleaner_latitude, cleaner_longitude, apartment_latitude, apartment_longitude)} miles away</Text>
                              </View>
                            </View>

                            <View style={{flexDirection:'row'}}>
                              <CircularIcon iconName="phone" onPress = {callPhone} />
                              <CircularIcon iconName="chat-processing-outline" onPress={openExisitingConversation} />
                            </View>
                            
                          </View>
                          
                        </Card>
                      }
                        </View>
                    </View> 
                )

                case 'taskItem':
                    return (
                    <View style={{marginHorizontal:5}}>
                        <Card>
                        <Text bold style={{fontSize:16}}>Regular Cleaning</Text>
                        <View style={styles.chip_container}>
                        {regular_cleaning.map((item, index) => (
                          <Chip 
                            key={index} 
                            mode="outlined" 
                            style={styles.chip}
                            textStyle={styles.chipText}
                            >
                            {item.label}
                          </Chip>
                        ))}
                      </View>
                        
                        </Card>
                      {extra_cleaning.length > 0 &&
                        <Card>
                        {/* <FlatList
                            data={extra_cleaning}
                            renderItem = {taskItem2}
                            ListHeaderComponent={<Text bold style={{fontSize:16}}>Deep Cleaning</Text>}
                            ListHeaderComponentStyle={styles.list_header}
                            // ListEmptyComponent= {emptyListing}
                            // ItemSeparatorComponent={itemSeparator}
                            keyExtractor={(item, index)=> item.label}
                            numColumns={numColumns2}
                            showsVerticalScrollIndicator={false}
                        /> */}

                        <Text bold style={{fontSize:16}}>Deep Cleaning</Text>
                        <View style={styles.chip_container}>
                        {extra_cleaning.map((item, index) => (
                          <Chip 
                            key={index} 
                            mode="outlined" 
                            style={styles.chip}
                            textStyle={styles.chipText}
                            >
                            <MaterialCommunityIcons name={item.icon} size={16} />  {item.label}
                          </Chip>
                        ))}
                      </View>
                        </Card>
                      }
                    </View>
                    )

            }
        }

        const data = [
            { type: 'circleicons' },
            { type: 'taskItem'},

          ];
          
  return (
    <SafeAreaView
      style={{
        flex:1,
        backgroundColor:COLORS.white,
      }}
    >
      <StatusBar
        barStyle="dark-content" // Use "light-content" for light text
        backgroundColor={COLORS.white} // Replace with your preferred background color
        translucent={false} // Prevent transparency
      />

    
      {loading ? (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        ) : (
          <View> 
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
     flex:1,
     marginHorizontal:5,
     marginBottom:20
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
     buttonText: {
       color: '#ffffff',
       fontSize: 18
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
    communicate:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center'
    },
    chip_container: {
      // flexDirection: 'row',  // Arrange items in a row
      // flexWrap: 'wrap',      // Allow chips to wrap naturally
      // gap: 2,               // Add spacing between chips (for React Native >= 0.71)
      // justifyContent: 'center', // Align items to the start
      // padding: 5,
      // alignItems:'center',
      
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
      fontSize: 13,  // Reduce font size
      fontWeight: '400',  // Normal font weight
      color:COLORS.gray
    },
   })


   