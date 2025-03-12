import React from 'react';
import Text from '../Text';
import { View, StyleSheet,TouchableOpacity, FlatList, Image } from 'react-native';
import COLORS from '../../constants/colors';
import { formatDate } from '../../utils/formatDate';
import Card from '../Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import ROUTES from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import Chip from '../ChipIcon';
import ButtonPrimary from '../ButtonPrimary';
import CardNoPrimary from '../CardNoPrimary';

const ListItem = ({item }) => {


  const navigation = useNavigation();
  
  const targetDate = moment(`${item.schedule.cleaning_date} ${item.schedule.cleaning_time}`, 'YYYY-MM-DD HH:mm:ss')
  // const targetDate = moment(`2024-12-26 11:00:00`, 'YYYY-MM-DD HH:mm:ss')
  
  // Get the current date and time
  const currentDate = moment();

  

  return (
   
    <View>
             
        <View style={styles.centerContent}>
              <Text bold style={styles.headerText}>{item.schedule.apartment_name}</Text>
              <Text style={{color:COLORS.gray, marginBottom:10, marginLeft:-5}}> <MaterialCommunityIcons name="map-marker" size={16} />{item.schedule?.address} </Text>

              <Text style={styles.date}>{moment(item.schedule?.cleaning_date).format('ddd MMM DD')}</Text>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Text style={styles.time}>{moment(item.schedule?.cleaning_time,'h:mm:ss A').format('h:mm A')}</Text>
              <Text> - </Text>
              <Text style={styles.time}> {moment(item.schedule?.cleaning_end_time,'h:mm:ss A').format('h:mm A')}</Text>
         
              </View>
              

              {currentDate.isAfter(targetDate) && item?.status === 'in_progress' ? 
                

                <ButtonPrimary 
                  title="Go Back To Work"
                  onPress = {()=>navigation.navigate(ROUTES.cleaner_attach_task_photos,{
                    scheduleId:item._id,
                    schedule:item,
                    hostId:item.hostInfo._id
                  })}

                />
                :
                <ButtonPrimary 
                  title="Clock-In"
                  onPress = {()=>navigation.navigate(ROUTES.cleaner_clock_in,{
                    scheduleId:item._id,
                    schedule:item
                  })}

                />
                
                
              }
            </View>
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
  headerText:{
    fontSize:18
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
  centerContent: {
    alignItems: 'center',  // Center content horizontally
    marginVertical:5
  },
  cardItem: {
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 40,
    padding: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    minHeight:200,
    justifyContent:'center',
    alignItems:'center'
 },
  
});

export default ListItem;

