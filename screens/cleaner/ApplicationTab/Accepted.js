import React from 'react';
import { SafeAreaView,StyleSheet, StatusBar, Text, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import ApplicationListItem from '../../../components/cleaner/ApplicationListItem';
import * as Animatable from 'react-native-animatable';
import CardNoPrimary from '../../../components/CardNoPrimary';

export default function Accepted({accepted_applications}) {

    const singleItem = ( {item,index} ) => (
        <CardNoPrimary>
            <ApplicationListItem
            item={item}
            />
        </CardNoPrimary>
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
    <View>
        <Animatable.View animation="slideInRight" duration={550}>
        <FlatList 
            data = {accepted_applications}
            renderItem = {singleItem}
            ListHeaderComponentStyle={styles.list_header}
            ListEmptyComponent= {emptyListing}
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

})
