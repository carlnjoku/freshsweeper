import React from 'react';
import Text from '../Text';
import { View, StyleSheet,TouchableOpacity, FlatList, _Image } from 'react-native';
import { Avatar} from 'react-native-paper';
import COLORS from '../../constants/colors';
import { formatDate } from '../../utils/formatDate';
import Card from '../Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import ROUTES from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';
import ChipWithBackground from '../ChipWithBackground';

const ScheduleListItem = ({item, currentUser }) => {

  console.log("element..........................")
  // console.log(item)
  console.log("element..........................")
  const navigation = useNavigation();

  

  return (
   

    <View>
        <TouchableOpacity 
          onPress={() => navigation.navigate(ROUTES.cleaner_job_details, {
            'item':item,
            'currentUser':currentUser
          })}
        >
            <View style={{flexDirection: 'row', paddingVertical:5}}>
              <View style={{flex: 0.12}}>
                  
                  {item.avatar ? 
                          <Image 
                              source={{uri:item.avatar}}
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
              <View style={{flex: 0.9}}>
                  <Text bold  style={{marginLeft:10, fontSize:15, color:COLORS.black}}>{item.apartment_name}</Text>
                  <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.address} </Text>
                  <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.distance.miles} miles away</Text>
                  
                  {/* <Text style={{marginLeft:10, fontSize:13, color:COLORS.gray}}>{item.cleaning_date}  {item.cleaning_time}</Text> */}
                  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:2}}> 
                    <ChipWithBackground label={item.cleaning_date} backgroundColor={COLORS.primary_light_1} color={COLORS.gray}/> 
                    <Text style={{fontSize:13}}>{item.cleaning_time}</Text>
                    <Text  style={{marginLeft:10, fontSize:16, color:COLORS.gray}}>{currentUser.location.currency.symbol}{item.total_cleaning_fee}</Text>
                  </View>
                  
              </View>
              
          
              {/* {item.label==="Notifications" ? <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}></Text></View> : <View style={{flex: 0.35, alignItems: 'flex-end'}}><Text style={{fontSize:12, color:COLORS.gray}}>  {item.value}</Text></View>} */}
              {/* <View style={{flex: 0.1, alignItems: 'flex-end'}}><Ionicons name="chevron-forward-outline" color={COLORS.secondary} size={16}></Ionicons></View> */}
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
  }
});

export default ScheduleListItem;

