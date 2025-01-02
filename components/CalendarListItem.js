import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';

const CalendarListItem = ({ item }) => {

    const handleSchedule = (scheduleId) => {
        console.log(scheduleId)
    }
  return (
    <View style={styles.container}>
        
            <View style={styles.date_time}>
                <Text>{item.schedule.cleaning_time}</Text>
                <Text style={styles.date}>{item.schedule.cleaning_date}</Text>
            </View>
            <View style={styles.line} />
            <TouchableOpacity
            onPress={(scheduleId) => handleSchedule(item._id)}
            style={{width:'100%'}}
             >
            <View style={styles.details}>
                <Text style={styles.task}>{item.schedule.apartment_name}</Text>
                <Text style={styles.apartment}>{item.schedule.address}</Text>
            </View>
            
            <View>
                <Text>{item.status}</Text>
            </View>
            </TouchableOpacity>
        
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  line: {
    borderLeftWidth: 1, // Adjust the thickness of the line as needed
    borderLeftColor: 'gray', // Change the color of the line as needed
    borderStyle: 'dotted', // Set the line style to dotted
    height: '100%', // Make the line extend the full height of the container
    marginRight: 10, // Adjust the spacing between the text and the line as needed
    marginHorizontal:5
  },
  date_time:{
    marginRight: 5,
  },
  task: {
    fontWeight:'500'
  },
  apartment:{
    color:COLORS.gray,
    fontSize:13,
  },
  date:{
    textAlign:'center',
    fontSize:12,
    color:COLORS.gray
  },
  assignee:{
    fontSize:12,
    color:COLORS.gray
  },
  details:{
    width:'55%'
  },
  status:{
    width:"10%"
  }
});

export default CalendarListItem;
