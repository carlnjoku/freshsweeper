import React from 'react';
import Text from '../Text';
import { View, StyleSheet,TouchableOpacity, FlatList, Image, Pressable } from 'react-native';
import COLORS from '../../constants/colors';
import { formatDate } from '../../utils/formatDate';
import Card from '../Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import ROUTES from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Chip, Badge } from 'react-native-paper';
// import Chip from '../ChipIcon';

const CleaningRequestItem = ({item }) => {

  // alert(item.hostIfo.expo_push_token)
  console.log("Iteeeeeeeeeeeeeeeeeeeeeeeem")
  // console.log(item.item?.sender_expo_push_token)
  // console.log(item.item?.schedule)
  // console.log(item.item?.chatroomId)
  // console.log(JSON.stringify(item.item, null, 2))
  console.log("Iteeeeeeeeeeeeeeeeeeeeeeeem")

  // Rename item to "selected_schedule"
  const schedule = item
  const selected_schedule = schedule.item.schedule

  console.log("Selected_schedule.....................")
  console.log(selected_schedule)
  console.log("Selected_schedule.....................s")
  // const host_expo_push_token = hostInfo.item.item
  // const host_expo_push_token = 
  // {"address": "171 Scheerer Avenue, Newark, NJ, USA", "apartment_latitude": 40.7119653, "apartment_longitude": -74.2087581, "apartment_name": "Bedrock Apartment ", "bathroom": "1", "bedroom": "3", "cleaning_date": "Mon Apr 29 2024", "cleaning_time": "11:17:00 AM", "extra": [{"icon": "rug", "label": "Carpet", "price": 20, "value": "Carpet Cleaning"}, {"icon": "window-closed-variant", "label": "Window", "price": 20, "value": "Window Washing"}, {"icon": "locker-multiple", "label": "Inside Cabinets", "price": 20, "value": "Inside Cabinets"}, {"icon": "dog-side", "label": "Pet Cleanup", "price": 20, "value": "Pet Cleanup"}], "regular_cleaning": [{"label": "Sweeping and Mopping", "value": "Sweeping and Mopping"}, {"label": "Vacuuming", "value": "Vacuuming"}, {"label": "Kitchen", "value": "Kitchen"}, {"label": "Bathroom", "value": "Bathroom "}, {"label": "Dishwashing", "value": "Dishwashing"}, {"label": "Trash Removal", "value": "Trash Removal"}, {"label": "Room Cleaning", "value": "Room Cleaning"}, {"label": "Livingroom", "value": "Livingroom"}, {"label": "Window Cleaning", "value": "Window Cleaning"}, {"label": "Air Freshening", "value": "Air Freshening"}, {"label": "Appliance Cleaning", "value": "Appliance Cleaning"}, {"label": "Final Inspection", "value": "Final Inspection"}, {"label": "Dusting", "value": "Dusting"}], "totalPrice": 80}
  const navigation = useNavigation();

  return (
   

    // <View>
    //   <View style={styles.container}>
    //         <View style={styles.date_time}>
    //         {item.item.hostInfo.avatar ? 
    //                     <Image 
    //                         source={{uri:item.avatar}}
    //                         style={{height:50, width:50, borderRadius:25, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
    //                     />
    //                     :

    //                     <Avatar.Image
    //                         size={50}
    //                         source={require('../../assets/default_avatar.png')}
    //                         style={{ backgroundColor: COLORS.gray }}
    //                     />
    //                 }
    //         </View>
            
            
            
            
    //         <View style={styles.task_details}>
    //             <Text style={styles.task}>{item.item.hostInfo.firstname} {item.item.hostInfo.lastname}</Text>
    //             {/* <Text style={styles.task}>{item.schedule.apartment_name}</Text> */}
    //             <Text style={styles.apartment}>{item.item.schedule.address} </Text>
                
    //             <Text style={styles.date}>{moment(item.item.schedule.cleaning_date, 'ddd MMM DD YYYY').format('ddd MMM DD')}</Text>
    //             <Text style={styles.time}>{item.item.schedule.cleaning_time}</Text>
                
    //             <View style={styles.action}>
    //             { item.item.status ==='in_progress' ? 
    //             <TouchableOpacity 
    //               onPress={() => navigation.navigate(ROUTES.cleaner_schedule_details, {
    //                 'item':item
    //               })}
    //             >
    //               <Text style={styles.details}>DETAILS</Text>
    //             </TouchableOpacity>

    //             :

    //             <TouchableOpacity 
    //               onPress={() => navigation.navigate(ROUTES.cleaner_schedule_details, {
    //                 'item':item
    //               })}
    //             >
    //                 <Text style={styles.clockin}>CLOCK-IN</Text>
    //             </TouchableOpacity>
    //           }
    //             </View>
    //         </View> 
    //   </View>
    // </View>

    <View>
      {/* <TouchableOpacity style={styles.categoryBtn} 
          onPress={() => navigation.navigate(ROUTES.cleaner_schedule_review, {
          item: {selected_schedule},
          host_expo_push_token : item.item?.sender_expo_push_token,
          chatroomId: item.item.chatroomId
          })}
        >
    
    
        <View style={{flexDirection: 'row', paddingVertical:5}}>
            <View style={{flex: 0.15}}>
               
                {item.item.hostInfo?.avatar ? 
                        <Image 
                            source={{uri:item.item.hostInfo.avatar}}
                            style={{height:40, width:40, borderRadius:20, borderWidth:2, borderColor:COLORS.light_gray_1, marginBottom:10}} 
                        />
                        :

                        <Avatar.Image
                            size={40}
                            source={require('../../assets/default_avatar.png')}
                            style={{ backgroundColor: COLORS.gray }}
                        />
                    }
            
            </View>
            <View style={{flex: 0.7}}>
                <Text bold style={styles.apart_name}>{item.item.schedule.hostInfo?.firstname} {item.item.schedule.hostInfo?.lastname}</Text>
                <Text style={styles.apartment}>{item.item.schedule.schedule?.address} </Text>

                
            </View>
        
           
            <View style={{flex: 0.3, alignItems: 'flex-end'}}>
              <Text style={styles.date}>{moment(item.item.schedule.schedule?.cleaning_date, 'ddd MMM DD YYYY').format('ddd MMM DD')}</Text>
              <Text style={styles.time}>{item.item.schedule.schedule?.cleaning_time}</Text>
              
            </View>
        </View>
          
        </TouchableOpacity> */}






        <Pressable
          
        >
              <View style={styles.requestCard}>
                <View style={styles.requestCardInner}>
                  <View style={{flex: 0.12}}>
                  
                            {item.item?.cleaner?.avatar ? 
                              <Avatar.Image 
                                  source={{uri:item.item?.cleaner.avatar}}
                                  size={30}
                                  // style={{height:40, width:40, borderRadius:20, marginLeft: -10, borderWidth:1, borderColor:COLORS.light_gray_1, marginBottom:10}} 
                              />
                              :
        
                              <Avatar.Icon
                                size={30}
                                style={{ backgroundColor: COLORS.gray }}
                              />
                          
                            }
                  </View>
                  <View style={{flex: 0.7}}>
                    <Text bold style={styles.apart_name}>{item.item?.cleaner.firstname} {item.item?.cleaner.lastname}</Text>
                    <Text style={styles.apart_name}>{item.item?.schedule?.schedule.apartment_name}</Text>
                    <Text style={styles.apartment}>{item.item?.schedule?.schedule?.address} </Text>
                    {/* <Text style={styles.apartment}>RequestId {item.item._id} </Text> */}
                    <Badge
                        style={[styles.statusApproveBadgeP, { alignSelf: 'flex-start' }]} // Add alignSelf
                      >
                        Pending Confirmation
                      </Badge>

                  </View>
                  
                  <View style={{flex: 0.25, alignItems: 'flex-end'}}>
                    <Text style={styles.date}>{moment(item.item?.schedule?.schedule?.cleaning_date).format('ddd MMM D')}</Text>
                    <Text style={styles.time}>{moment(item.item?.schedule?.schedule?.cleaning_time, 'HH:mm:ss').format('h:mm A')}</Text>
                    {/* <Ionicons name="chevron-forward-outline" color={COLORS.secondary} size={16}></Ionicons> */}
                  </View>
                </View>
                
                
                {/* <Text style={styles.requestDate}>{request.dateRequested}</Text>
                <Text style={styles.requestDetails}>{request.details}</Text> */}
              </View>
              
              </Pressable>
    </View>
        
      

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0,
    marginTop:5
  },
  dotline:{
    flex: 0.05,
    height:'100%',
    alignItems: 'flex-start'
  },
  line: {
    borderLeftWidth: 0.7, // Adjust the thickness of the line as needed
    borderLeftColor: COLORS.light_gray, // Change the color of the line as needed
    // borderStyle: 'dotted', // Set the line style to dotted
    minHeight: 78, // Make the line extend the full height of the container
    // marginRight: 10, // Adjust the spacing between the text and the line as needed
    marginHorizontal:5,
    marginVertical: 0 // Adjust vertical spacing as needed
  },
  date_time:{
    flex: 0.25,
    alignItems:'flex-end',
    marginRight:5
  },
  apart_name: {
    fontWeight:'500'
  },
  apartment:{
    color:COLORS.gray,
    fontSize:13,
  },
  date:{
    marginTop:-4,
    fontSize:12,
    fontWeight:'500'
    // color:COLORS.gray
  },
  time:{
    marginTop:4,
    fontSize:12,
    // color:COLORS.gray
  },
  assignee:{
    fontSize:12,
    color:COLORS.gray
  },
  task_details:{
    flex: 0.7,
    alignItems: 'flex-start',
    width:'100%',
    marginTop:10
  },
  status:{
    textTransform:'capitalize',
    color:COLORS.light_gray
  },
  
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginBottom: 5, // Adjust this to control the space between the dot and the line
  },
  details:{
    fontSize:12,
    color:COLORS.primary,
    // textDecorationLine:'underline',
    fontWeight:'bold'
  },
  clockin:{
    fontSize:12,
    marginLeft:20,
    color:COLORS.primary,
    // textDecorationLine:'underline',
    fontWeight:'bold'
  },
  action:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    marginTop:5,
    marginBottom: 5,
  },
  section: { marginBottom: 20 },
  requestCard: { 
    padding: 10, 
    borderRadius: 12, 
    backgroundColor: '#e9f5ff', 
    marginVertical: 5,
    alignItems:'flex-start'
  },
  requestCardInner: { 
    flexDirection:'row',
    alignItems:'flex-start'
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  request_actions:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'flex-end',
    width: '100%', // Ensure the container takes the full width
  },
  chip:{
    borderRadius:50,
    margin:5,
    fontWeight:'condensed',
    fontSize:14
  },
  statusApproveBadgeP: {
    backgroundColor: COLORS.light_gray,
    color: '#fff',
    paddingHorizontal:7,
    marginTop:10,
    justifyContent:'flex-start',
    alignItems:'flex-start'
  },
});

export default CleaningRequestItem;

                      