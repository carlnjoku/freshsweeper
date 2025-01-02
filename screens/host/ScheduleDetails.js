import React, { useEffect, useState } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, useWindowDimensions, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import userService from '../../services/userService';
import COLORS from '../../constants/colors';
import { Avatar, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../../components/StarRating';
import GoogleDirections from '../../components/GoogleDirections';
import CircleIconButton1 from '../../components/CircleButton1';
import CardColored from '../../components/CardColored';
import Card from '../../components/Card';
import CircleIcon from '../../components/CirecleIcon';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import moment from 'moment';

export default function ScheduleDetails({navigation, route}) {
    
    const {scheduleId, item} = route.params

    console.log("extraaaaaaaa..............")
    console.log(JSON.stringify(item, null, 2))
    console.log("extraaaaaaaa..............")

    const[regular_cleaning, setRegularCleaning] = useState(item.schedule.regular_cleaning)
    const[extra_cleaning, setExtarCleaning] = useState(item.schedule.extra)
    const[apartment_name, setApartmentName] = useState(item.schedule.apartment_name)
    const[room_type_and_size, setRoomTypeSize] = useState(item.schedule.selected_apt_room_type_and_size)
    const[address, setAddress] = useState(item.schedule.address)


    const cleaning_date = item.schedule.cleaning_date
    const cleaning_time = item.schedule.cleaning_time

  
    // Retrieve the count for each room type
    const bedroomCount = room_type_and_size.find(room => room.type === "Bedroom")?.number || 0;
    const bathroomCount = room_type_and_size.find(room => room.type === "Bathroom")?.number || 0;
    const livingroomCount = room_type_and_size.find(room => room.type === "Livingroom")?.number || 0;

    const { width } = useWindowDimensions();
    const numColumns2 = 2
    const columnWidth2 = width / numColumns2 - 10; // Adjusted width to accommodate margins


    useEffect(()=> {
        // fetchSchedule()
    })

    

    const taskItem = ( {item, index} ) => (
        <View style={[styles.tasks, { width: columnWidth2 }]}>
            <Text style={{fontSize:13}}>{item.label} </Text>
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
                        
                        <View style={{marginHorizontal:5}}>
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
                        </View>
                    </View> 
                )


            
            

                case 'taskItem':
                    return (
                    <View style={{marginHorizontal:5}}>
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
            // { type: 'googledirection' },
            { type: 'circleicons' },
            { type: 'taskItem'},

          ];
          
  return (
    <SafeAreaView
      style={{
        flex:1,
        backgroundColor:COLORS.backgroundColor,
      }}
    >

        {/* <GoogleDirections 
          origin={{
            latitude:40.6940337,
            longitude:-73.98938989999999
          }}
          destination={{
            latitude:40.7119653,
            longitude:-74.2087581
          }}
        /> */}

        <View> 
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
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
   })


   