import React, { useContext, useEffect,useState } from 'react';
import Text from '../../components/Text';
import Card from '../../components/Card';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import GoogleMapAndUsers from '../../components/GoogleMapAndUsers';
import ChipIcon from '../../components/ChipIcon';
import CircleIcon from '../../components/CirecleIcon';
import COLORS from '../../constants/colors';
import moment from 'moment';
import calculateETA from '../../utils/calculateETA';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import DraggableOverlay from '../../components/DraggableOverlay';
import Approve from './Approve';
import * as Animatable from 'react-native-animatable';



export default function Confirmation({route}) {

    const {item,selectedUser, selected_scheduleId, selectedSchedule, chatroomId, totalPrice} = route.params
  
    const {currentUserId, currency} = useContext(AuthContext)

    const[room_type_and_size, setRoomTypeSize] = useState(item.selected_schedule.selected_apt_room_type_and_size)
    console.log("robiroooooooooooooooooo")
    // console.log([item])
    console.log("robiroooooooooooooooooo")
    const distanceInKm = 10; // Example distance in kilometers
    const averageSpeedKph = 50; // Example average speed in kilometers per hour
    const eta = calculateETA(distanceInKm, averageSpeedKph);

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

    // Retrieve the count for each room type
    const bedroomCount = room_type_and_size.find(room => room.type === "Bedroom")?.number || 0;
    const bathroomCount = room_type_and_size.find(room => room.type === "Bathroom")?.number || 0;
    const livingroomCount = room_type_and_size.find(room => room.type === "Livingroom")?.number || 0;

 

    const [overlayVisible, setOverlayVisible] = useState(false);
    const[openModal, setOpenModal] = useState(false)
    
    const handleOpenApprove = () => {
        setOpenModal(true)
    }

    const handleCloseApprove = () => {
        setOpenModal(false)
      }

    const toggleOverlay = () => {
        setOverlayVisible(prevState => !prevState);
    };
  


    const taskItem = ( {item,index} ) => (
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


  return (
    <SafeAreaView
      style={{
        flex:1,
        backgroundColor:COLORS.backgroundColor,
      }}
    >
        
        {/* <StatusBar translucent backgroundColor="transparent" /> */}
        <ScrollView>
        {/* <GoogleMapAndUsers 
        //   users={currentUserArray}
          apartment_name ={item.selected_schedule.apartment_name}
          apartment_address={item.selected_schedule.apartment_address}
          apartment_latitude={item.selected_schedule.latitude}
          apartment_longitude={item.selected_schedule.longitude}
        //   center={center}

        />  */}
        
        
        <View style={styles.eta}>
            <ChipIcon
              iconName="car-outline"
              label={time_to_destination}
              iconSize={18}
            /> 

            <ChipIcon
              iconName="train"
              label={time_to_destination}
              iconSize={17}
            /> 
            <ChipIcon
              iconName="walk"
              label={time_to_destination}
              iconSize={18}
            /> 
        </View>
        <View style={styles.container}>
        <View>
            
        </View>
          <Card>
          <View style={styles.centerContent}>
                            <AntDesign name="home" size={60} color={COLORS.gray}/> 
                            <Text bold style={styles.headerText}>{item.selected_schedule.apartment_name}</Text>
                            <Text style={{color:COLORS.gray, marginBottom:10, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{item.selected_schedule.address}</Text>
                          </View>

            {/* <Text bold style={styles.title}>{item.selected_schedule.apartment_name} </Text>
            <Text style={{color:COLORS.gray, fontSize:16, marginBottom:10, marginLeft:-8}}> <MaterialCommunityIcons name="map-marker" size={16} />{item.selected_schedule.address}</Text>
             */}
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:5}}>
          
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
            
          </Card>

          <Card>
                <Text bold style={{fontSize:16}}>Claener Details</Text>
                
                   
                        
                <View style={{flexDirection: 'row', paddingVertical:10, paddingHorizontal:0}}>
                    <View style={{flex: 0.15}}>
                        {/* <Image source={{uri:item.avata}} style={styles.icon_url_style} /> */}
                        {selectedUser.avatar ? 
                                <Image 
                                    source={{uri:selectedUser.avatar}}
                                    style={{height:40, width:40, borderRadius:20, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
                                />
                                :

                                <Image
                                    size={50}
                                    source={require('../../assets/default_avatar.png')}
                                    style={{height:50, width:50, borderRadius:25, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
                                />
                            }
                    
                    </View>
                    <View style={{flex: 0.8}}>
                        <Text style={{marginLeft:5, fontSize:16, color:COLORS.secondary}}>{selectedUser.firstname} {selectedUser.lastname}</Text>
                        <Text style={{marginLeft:5, fontSize:12, color:COLORS.gray}}>2.4 Miles away</Text>
                    </View>
                
                    
                </View>
                   
                
            </Card>
          
        <View>
        
       
          <Card>
            <FlatList
                data={item.selected_schedule.regular_cleaning}
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
                data={item.selected_schedule.extra}
                renderItem = {taskItem2}
                    ListHeaderComponent={<Text bold style={{fontSize:16}}>Deeps Cleaning</Text>}
                    ListHeaderComponentStyle={styles.list_header}
                    // ListEmptyComponent= {emptyListing}
                    // ItemSeparatorComponent={itemSeparator}
                    keyExtractor={(item, index)=> item.label}
                    numColumns={numColumns2}
                    showsVerticalScrollIndicator={false}
            />
          </Card>
          <View style={{marginTop:20}} />
        </View>
        </View>
                
       

        
        </ScrollView>
        
       {/* <View style={styles.button}> */}
       
        <TouchableOpacity 
          onPress={handleOpenApprove} style={styles.button} 
        >
          
          <Text bold style={styles.buttonacceptText}><MaterialCommunityIcons name="check-all" size={24} color={COLORS.white} /> Approve</Text>
        </TouchableOpacity>
        
        
        <Modal 
            visible={openModal}
            animationType="slide" 
            transparent={true}
            // animationType="none" // No animation
            // statusBarTranslucent={true}
            // onRequestClose={onClose} // Handle hardware back button on Android
          >
            
            
            <Approve 
                close_modal={handleCloseApprove}
                selectedUser={selectedUser}
                totalPrice={totalPrice}
                selectedSchedule={selectedSchedule}
                selected_scheduleId={selected_scheduleId}
                chatroomId = {chatroomId}
                hostId = {currentUserId}
                currency = {currency}
            />
            
           
          </Modal>
          <StatusBar backgroundColor="transparent" translucent={true} />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
   container:{
    marginHorizontal:10
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
      paddingVertical: 12,
      paddingHorizontal: 20,
      justifyContent:'center',
      backgroundColor: COLORS.primary,
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
    
  })



  

