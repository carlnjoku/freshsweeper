import React from 'react'
import Text from '../Text';
import { View, StyleSheet,TouchableOpacity, FlatList, Image } from 'react-native';
import { Avatar} from 'react-native-paper';
import COLORS from '../../constants/colors';
import { MaterialCommunityIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import ChipWithBackground from '../ChipWithBackground';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../constants/routes';
import moment from 'moment';
import CircleIconNoLabel from '../CirecleIconNoLabel';

export default function OngoingWorkListItem({item}) {

  const navigation = useNavigation();
    console.log("iteee1....................m")
    // console.log(JSON.stringify(item, null, 2))
    console.log("iteee...................m")
  return (
    <View>
      
          <TouchableOpacity 
            onPress={() =>navigation.navigate(ROUTES.host_task_progress,{
              scheduleId:item._id,
              schedule:item
            })}
          >
              <View style={{flexDirection: 'row', paddingVertical:5}}>
                <View style={{flex: 0.1}}>
                {item.assignedTo ? 
                          
                            <Avatar.Image 
                                source={{uri:item.assignedTo.avatar}}
                                size={36}
                                style={{height:36, width:36, borderRadius:18, marginLeft: -1, borderWidth:1, borderColor:COLORS.light_gray_1, backgroundColor:COLORS.light_gray, marginBottom:10}} 
                            />
                            :
      
                            <Avatar.Image
                              size={40}
                              source={require('../../assets/default_avatar.png')}
                              style={{ backgroundColor: COLORS.gray }}
                            />
                        
                      }
                </View>
                <View style={{flex: 0.8}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text bold  style={{marginLeft:5, fontSize:15, color:COLORS.gray}}> 
                          {item.schedule.apartment_name} 
                         </Text>
                        
                      </View>
                    {/* <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.location.city}, {item.location.region}</Text> */}
                    
                   

                    <View style={{flexDirection:'column', justifyContent:'space-between', alignItems:'flex-start', marginTop:2}}> 
                      
                      <View style={styles.schedule}>
                        <Text style={{fontSize:12, marginRight:10}}>{moment(item.schedule.cleaning_date, 'ddd MMM DD YYYY').format('ddd MMM DD')}</Text>
                        <Text style={{fontSize:12, color:COLORS.gray}}>{moment(item.schedule.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
                      </View>
                      
                    </View>
                    <View style={{width:"50%"}}>
                      <ChipWithBackground label="Track progress" backgroundColor={COLORS.primary_light_1} color={COLORS.gray}  /> 
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:3}}>
                      
                      <View style={{flexDirection:'row', flex: 0.15, marginLeft:20}}>
                      
                      
                    </View>
                    
                </View>

                
                    
                </View>
                <View style={{flex: 0.1}}>
                  <View style={styles.rightContainer}>
                    <CircleIconNoLabel
                      iconName="chevron-right"
                      buttonSize={30}
                      radiusSise={15}
                      iconSize={16}
                      onPress={() =>navigation.navigate(ROUTES.host_task_progress,{
                        scheduleId:item._id,
                        schedule:item
                      })}
                    />
                  </View>
                </View>
            </View>
          </TouchableOpacity>
              
  
    </View>
  )
}

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
    task: {
      fontWeight:'500'
    },
    apartment:{
      color:COLORS.gray,
      fontSize:13,
    },
    date:{
      marginTop:-4,
      fontSize:14,
      fontWeight:'500'
      // color:COLORS.gray
    },
    time:{
      marginTop:4,
      fontSize:12,
      // color:COLORS.gray
    },
    schedule:{
      flexDirection: 'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginLeft:5,
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
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingLeft: 10,
      marginRight:0
    },
  });
  
 
