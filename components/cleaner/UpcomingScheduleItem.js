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
import ButtonPrimary from '../ButtonPrimary';

const UpcomingScheduleItem = ({item }) => {
  console.log("Scheduleeeeeeeeeeeeeeeeees")
  // console.log(JSON.stringify(item, null, 2))
  console.log("Scheduleeeeeeeeeeeeeeeeees")
  const navigation = useNavigation();

   
  return (
   

<View>
   
      <View style={styles.container}>
            <View style={styles.date_time}>
              <Text style={styles.date}>{moment(item.schedule.cleaning_date).format('ddd MMM DD')}</Text>
              <Text style={styles.time}>{moment(item.schedule.cleaning_time, 'h:mm:ss A').format('h:mm A')}</Text>
            </View>
            
            <View style={styles.dotline}>
              <View style={styles.dot} />
              <View style={styles.line} />
            </View>
            
            
            <View style={styles.task_details}>
                <Text bold style={styles.task}>{item.schedule.apartment_name}</Text>
                {/* <Text style={styles.task}>{item.schedule.apartment_name}</Text> */}
                <Text style={styles.apartment}>{item.schedule.address} </Text>
                <View style={styles.action}>

                <ButtonPrimary 
                  title="Clock-In"
                  onPress = {()=>navigation.navigate(ROUTES.cleaner_clock_in,{
                    scheduleId:item._id,
                    schedule:item
                  })}

                />
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
    flex: 0.7,
    alignItems: 'flex-start',
    width:'100%',
    marginTop:-5
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
    fontSize:14,
    color:COLORS.primary,
    // fontWeight:'bold'
  },
  clockin:{
    fontSize:12,
    marginLeft:20,
    color:COLORS.primary,
    fontWeight:'bold'
  },
  action:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    marginTop:-5,
    marginBottom: 5,
  }
});

export default UpcomingScheduleItem;

