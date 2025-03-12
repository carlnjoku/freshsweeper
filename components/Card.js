import React from 'react';
import { SafeAreaView,StyleSheet, Image, ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';

export default function Card({children}) {
  return (
    <View style={styles.card}>

        {children}
        
    </View>
  )
}


const styles = StyleSheet.create({
    card: {
        width:'100%',
        alignSelf:'center',
        marginTop:15,
        marginBottom:10,
        padding:10,
        minHeight:90,
        borderRadius:10,
        backgroundColor:COLORS.white,
        elevation:5,
        shadowColor: "#ccc",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2},
      },
})

