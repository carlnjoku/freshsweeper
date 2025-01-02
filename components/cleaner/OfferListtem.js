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

const OfferListItem = ({upcoming_schedule }) => {

  const navigation = useNavigation();
  const singleItem = ( {item,index} ) => (
    <View>
    
      <View style={styles.container}>
            <View style={styles.date_time}>
              <Text style={styles.date}>{moment(item.schedule.cleaning_date, 'ddd MMM DD YYYY').format('ddd MMM DD')}</Text>
              <Text style={styles.time}>{item.schedule.cleaning_time}</Text>
            </View>
            
            <View style={styles.dotline}>
              <View style={styles.dot} />
              <View style={styles.line} />
            </View>
            
            
            <View style={styles.details}>
                <Text style={styles.task}>{item.schedule.apartment_name}</Text>
                <Text style={styles.apartment}>{item.schedule.address}</Text>
                <Text style={styles.status}>{item.status}</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate(ROUTES.cleaner_schedule_details, {
                    'scheduleId':item
                  })}
                >
                    <Text>Clock-In</Text>
                </TouchableOpacity>
            </View>
            
      </View>
    </View>
  )

  const emptyListing = () => (
    <Text>No listings found</Text>
  )
  const itemSeparator = () => (
    <View style={styles.line}></View>
  )
   
  return (
    <View >

          <Card> 
            <FlatList 
              data={upcoming_schedule} // Display only the specified number of items
              renderItem = {singleItem}

              ListHeaderComponent={<Text bold style={{fontSize:16}}>Latest Offers</Text>}
              ListHeaderComponentStyle={styles.list_header}
              ListEmptyComponent= {emptyListing}
              ItemSeparatorComponent={itemSeparator}
              keyExtractor={(item, index)=> item.key}
              numColumns={1}
              showsVerticalScrollIndicator={false}
              horizontal={false}
            />
          </Card>
        
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  dotline:{
    flex: 0.05,
    height:'100%',
    alignItems: 'flex-start'
  },
  line: {
    borderLeftWidth: 0.8, // Adjust the thickness of the line as needed
    borderLeftColor: 'black', // Change the color of the line as needed
    borderStyle: 'dotted', // Set the line style to dotted
    height: 80, // Make the line extend the full height of the container
    // marginRight: 10, // Adjust the spacing between the text and the line as needed
    marginHorizontal:5,
    marginVertical: 0 // Adjust vertical spacing as needed
  },
  date_time:{
    flex: 0.2,
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
  details:{
    flex: 0.7,
    alignItems: 'flex-start',
    width:'100%',
    marginTop:10
  },
  status:{
    textTransform:'capitalize',
    color:COLORS.light_gray
  },
  list_header: {
    fontWeight:'500',
    marginBottom:10
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginBottom: 5, // Adjust this to control the space between the dot and the line
  },
});

export default OfferListItem;

