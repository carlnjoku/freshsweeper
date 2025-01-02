import React, { useContext, useEffect,useState } from 'react';
import Text from '../../components/Text';
import { SafeAreaView,StyleSheet, StatusBar, Linking, FlatList, ScrollView, useWindowDimensions, Modal, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import CircleIconNoLabel from '../../components/CirecleIconNoLabel';
import CardNoPrimary from '../../components/CardNoPrimary';
import COLORS from '../../constants/colors';

export default function AboutMeDisplay({aboutme,handleOpenAboutMe, mode }) {


  return (
    <CardNoPrimary>
        <View style={styles.titleContainer}>
        <Text bold style={styles.title}>About Me</Text> 
        {mode ==="edit" && 
        <View style={styles.actions}>
            <CircleIconNoLabel 
                iconName="pencil"
                buttonSize={30}
                radiusSise={15}
                iconSize={16}
                onPress={handleOpenAboutMe}
            /> 
        </View>
}
        </View>
        <View style={styles.line}></View>
        <View style={styles.content}>
            <Text style={styles.aboutme}>{aboutme}</Text>
        </View>
        
    </CardNoPrimary>
  )
}


const styles = StyleSheet.create({
    header:{
      margin:0
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
    aboutme:{
        color:COLORS.gray,
        fontSize:14
    }
  })
  