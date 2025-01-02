import React from 'react'
import { SafeAreaView,Text, StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import CleaningRequestItem from '../../components/cleaner/CleaningRequestItem';
import COLORS from '../../constants/colors';
import Card from '../../components/Card';
import CardNoPrimary from '../../components/CardNoPrimary';

export default function AllRequests({route, navigation}) {

   
    const item = route.params
    
    
    const singleItem = (item) =>  (
        <CleaningRequestItem item={item} />
    )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundColor }}>
        
        <View style={{paddingHorizontal:20}}>
         
            <FlatList 
                data={item.item}
                renderItem = {singleItem}
               
                ListHeaderComponentStyle={styles.list_header}
                ListEmptyComponent={<Text>No listings found</Text>}
                ItemSeparatorComponent={() => <View style={styles.line}></View>}
                keyExtractor={(item) => item.key}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                horizontal={false}
            />
           
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      width: "100%",
    },
    rowItem: {
      flexDirection: 'row',
      padding: 10,
    },
    thumbnails: {
      width: 80,
      height: 80,
      borderRadius: 5,
      margin: 5,
    },
    list_header: {
      fontWeight: '500',
      marginBottom: 10,
    },
    line: {
      borderBottomWidth: 0.7,
      borderBottomColor: COLORS.light_gray_1,
      marginBottom: 5,
    },
  });
  
