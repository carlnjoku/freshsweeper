import React from 'react';
import { SafeAreaView,Text, StyleSheet, StatusBar, Linking, FlatList, ScrollView, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import CardNoPrimary from '../../components/CardNoPrimary';
import CircleIconNoLabel from '../../components/CirecleIconNoLabel';
import COLORS from '../../constants/colors';


export default function PaymentTypeDisplay({handleOpenPaymentType}) {
  return (
    <CardNoPrimary>
        <View style={styles.titleContainer}>
            <Text bold style={styles.title}>Payment Methods</Text> 
            <View style={styles.actions}>
        
            <CircleIconNoLabel 
                iconName="pencil"
                buttonSize={30}
                radiusSise={15}
                iconSize={16}
                onPress={handleOpenPaymentType}
            /> 
            
            
            </View>
        </View> 
        <View style={styles.line}></View>
        <View style={styles.content}>
            <Text>Add Qualifications</Text>
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
    
  })
  
