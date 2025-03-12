import React from 'react';
import Text from '../Text';
import { View, StyleSheet,TouchableOpacity, FlatList } from 'react-native';
import COLORS from '../../constants/colors';
import { formatDate } from '../../utils/formatDate';
import Card from '../Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import ROUTES from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';

const UpcomingScheduleListItem = ({item }) => {

  console.log("item...........................item")
  // console.log(JSON.stringify(item,null, 2))
  console.log("item...........................item")
  const navigation = useNavigation();

  return (
   

    <View style={ styles.jobCard}>
      <View style={styles.container}>
            <View style={styles.date_time}>
              <Text style={styles.date}>{moment(item.item.schedule.cleaning_date, 'ddd MMM DD YYYY').format('ddd MMM DD')}</Text>
              <Text style={styles.time}>{item.item.schedule.cleaning_time}</Text>
            </View>
            
            <View style={styles.dotline}>
              <View style={styles.dot} />
              <View style={styles.line} />
            </View>
            
           
            
            <View style={styles.task_details}>
                <Text style={styles.task}>{item.item.schedule.apartment_name}</Text>
                <Text style={styles.apartment}>{item.item.schedule.address} </Text>
                <Text style={styles.status}>{item.item.schedule.status}</Text>
                <View style={styles.action}>
                { item.status ==='open' ? 
                <TouchableOpacity 
                  onPress={() => navigation.navigate(ROUTES.cleaner_schedule_details, {
                    'item':item.item
                  })}
                >
                  <Text style={styles.details}>DETAILS</Text>
                </TouchableOpacity>

                :

                <TouchableOpacity 
                  onPress={() => navigation.navigate(ROUTES.cleaner_schedule_details, {
                    'item':item.item
                  })}
                >
                    <Text style={styles.clockin}>CLOCK-IN</Text>
                </TouchableOpacity>
              }
                </View>
            </View> 
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
    flex: 0.75,
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
  jobCard: { 
    padding: 15, 
    backgroundColor: '#f9f9f9', 
    marginVertical: 5,
    borderRadius:10 
  },
});

export default UpcomingScheduleListItem;

