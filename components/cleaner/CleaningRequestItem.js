import React from 'react';
import Text from '../Text';
import { View, StyleSheet,TouchableOpacity, FlatList, Image } from 'react-native';
import COLORS from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import ROUTES from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';

import ButtonPrimary from '../ButtonPrimary';
import { Badge } from 'react-native-paper';

const CleaninRequestItemtItem = ({item, status, currency }) => {


  console.log("Iteeeeeeeeeeeeeeeeeeeeeeeem")
  // console.log(item.item?.sender_expo_push_token)
  // console.log(item.item?.schedule.schedule)
  // console.log(item.item?.chatroomId)
  // console.log(JSON.stringify(item, null, 2))
  console.log("Iteeeeeeeeeeeeeeeeeeeeeeeem")

  //Rename item to "selected_schedule"
  const schedule = item
  console.log("Scheduleee", schedule)
  const selected_schedule = schedule.item.schedule

  const navigation = useNavigation();
  // console.log("my request", JSON.stringify(item.item.schedule, null, 2))
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






        <TouchableOpacity
          
        >
              <View style={styles.requestCard}>
               
              <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
                <Text bold style={styles.apart_name}>
                  {item.item.schedule.hostInfo?.firstname} {item.item.schedule.hostInfo?.lastname}
                </Text>
                <Text style={styles.apart_name}>
                  {item.item.schedule.schedule.apartment_name}
                </Text>
                <Text style={styles.apartment}>
                  {item.item.schedule.schedule?.address}
                </Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    

                    {status === "pending_payment" && (
                      <Badge
                        style={[styles.statusApproveBadgeP, { alignSelf: 'flex-start' }]} // Add alignSelf
                      >
                        Pending Confirmation
                      </Badge>
                    )}
                </View>
              </View>

                
                <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                  <Text style={styles.date}>{moment(item.item.schedule.schedule?.cleaning_date).format('ddd MMM D')}</Text>
                  <Text style={styles.time}>{moment(item.item.schedule.schedule?.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
                  {/* <Ionicons name="chevron-forward-outline" color={COLORS.secondary} size={16}></Ionicons> */}
                  <Text style={styles.price}>
                    {currency}{item.item.schedule.schedule.total_cleaning_fee}
                  </Text>
                  

                  {item.item.status ==="pending_acceptance" &&
                  <Badge 
                    style={styles.statusApproveBadge}
                    onPress={() => navigation.navigate(ROUTES.cleaner_schedule_review, {
                      item: {selected_schedule},
                      requestId: item.item.requestId,
                      scheduleId:item.item.schedule._id,
                      hostId:item.item.schedule.hostInfo._id
                    })}
                  >
                      Accept Request
                    </Badge>
                  }

                  
                </View>
                
                {/* <Text style={styles.requestDate}>{request.dateRequested}</Text>
                <Text style={styles.requestDetails}>{request.details}</Text> */}

                
              </View>
              </TouchableOpacity>
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
  statusApproveBadge: {
    backgroundColor: COLORS.deepBlue,
    color: '#fff',
    paddingHorizontal:7,
    marginTop:20
  },
  statusApproveBadgeP: {
    backgroundColor: COLORS.light_gray,
    color: '#fff',
    paddingHorizontal:7,
    marginTop:10,
    justifyContent:'flex-start',
    alignItems:'flex-start'
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
    flexDirection:'row',
    padding: 15, 
    borderRadius: 12, 
    backgroundColor: '#e9f5ff', 
    marginVertical: 5,
    alignItems:'flex-start'
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  price:{
    fontSize:18,
    color:COLORS.deepBlue,
    fontWeight:'700',
    marginTop:25
  }
});

export default CleaninRequestItemtItem;


