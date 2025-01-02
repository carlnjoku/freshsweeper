import React from 'react';
import { SafeAreaView,Text, StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import CardNoPrimary from '../../components/CardNoPrimary';
import CircleIconNoLabel from '../../components/CirecleIconNoLabel';
import COLORS from '../../constants/colors';

export default function ContactDisplay({contact, handleOpenContact}) {

  return (
    <CardNoPrimary>
        <View style={styles.titleContainer}>
        <Text bold style={styles.title}>Contact</Text> 
        <View style={styles.actions}>
            <CircleIconNoLabel 
                iconName="pencil"
                buttonSize={30}
                radiusSise={15}
                iconSize={16}
                onPress={handleOpenContact}
            /> 
        </View>
        </View>
        <View style={styles.line}></View>
        <View style={styles.content}>
            <Text>Address</Text>
            <Text style={styles.address}>{contact.address}</Text>
        </View>
        <View style={styles.content}>
            <Text>Phone</Text>
            <Text style={styles.address}>{contact.phone}</Text>
        </View>
        <View style={styles.content}>
            <Text>Social Security #</Text>
            <Text style={styles.address}>{contact.ssn}</Text>
        </View>
    </CardNoPrimary>
  )
}


const styles = StyleSheet.create({
    header:{
      margin:0
    },
    name:{
      color:COLORS.white,
      fontSize:18,
    },
    location:{
      color:COLORS.white
    },
    container:{
      margin:10
    },
    avatar_background:{
      paddingTop:80,
      paddingBottom:10,
      minHeighteight:200,
      backgroundColor:COLORS.primary,
      justifyContent:'center',
      alignItems:'center'
    },
    line:{
      borderBottomWidth:0.8,
      borderColor:COLORS.light_gray_1,
      marginVertical:5,
      height:4
    },
    titleContainer:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginTop:0
    },
    title:{
        fontSize:16,
        fontWeight:'bold'
      
    },
    content:{
      flexDirection:'row',
      justifyContent:'space-between',
      marginVertical:5
    },
    actions:{
      flexDirection:'row',
  
    },
    address:{
        color:COLORS.gray,
        fontSize:14
    }
  })
  