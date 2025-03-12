import React from 'react';
import { SafeAreaView,StyleSheet, Text, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import UpcomingScheduleListItem from '../../../components/cleaner/UpcomingScheduleListItem';
import ListItem from '../../../components/cleaner/ListItem';
import COLORS from '../../../constants/colors';
import UpcomingScheduleItem from '../../../components/cleaner/UpcomingScheduleItem';


export default function Upcoming({schedules}) {
    const singleItem = ( {item,index} ) => (


        <UpcomingScheduleItem 
          item={item}
        />

    )

    const itemSeparator = () => (
        
        <View style={styles.item_separator}></View>
      )
      const emptyListing = () => (
        <View style={styles.empty_listing}>
          <Text>No new schedule found </Text>
          {/* {apartments.length < 1 && 
            <TouchableOpacity style={styles.button} onPress= {() => navigation.navigate(ROUTES.host_add_apt)}><Text style={styles.add_apartment_text}>Add Apartment</Text></TouchableOpacity>
          } */}
        </View>
      )


  return (
    <View style={{paddingVertical:15}}>
        <Animatable.View animation="fadeIn" duration={550}>
        <FlatList 
            data = {schedules}
            renderItem = {singleItem}
            ListHeaderComponentStyle={styles.list_header}
            ListEmptyComponent= {<Text style={styles.emptyText}>No new schedule found</Text>} 
            ItemSeparatorComponent={itemSeparator}
            keyExtractor={(item, index)=> item.label}
            numColumns={1}
            showsVerticalScrollIndicator={false}
        />
        </Animatable.View>
    </View>
  )
  
}

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 0.7,
    borderBottomColor: COLORS.light_gray_1,
    marginBottom: 5,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
})
