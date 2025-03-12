import React from 'react';
import { SafeAreaView,StyleSheet, StatusBar, Text, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import UpcomingScheduleListItem from '../../../components/host/ScheduleListItem';
import * as Animatable from 'react-native-animatable';
import { useBookingContext } from '../../../context/BookingContext';


export default function Upcoming({schedules,currency}) {
    
    
    
    const singleItem = ( {item, index} ) => (
        
        <UpcomingScheduleListItem
          item={item}
          currency={currency}
        />

    )

    const itemSeparator = () => (
        
        <View style={styles.item_separator}></View>
      )
      // const emptyListing = () => (
      //   <View style={styles.empty_listing}>
      //     <Text>No new schedule found </Text>
      //     {/* {apartments.length < 1 && 
      //       <TouchableOpacity style={styles.button} onPress= {() => navigation.navigate(ROUTES.host_add_apt)}><Text style={styles.add_apartment_text}>Add Apartment</Text></TouchableOpacity>
      //     } */}
      //   </View>
      // )


  return (
    <View style={{marginBottom:60}}>
        <Animatable.View animation="fadeIn" duration={550}>
          <FlatList 
              data = {schedules}
              renderItem = {singleItem}
              ListHeaderComponentStyle={styles.list_header}
              ListEmptyComponent={<Text style={styles.emptyText}>No new schedule</Text>}
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
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
})