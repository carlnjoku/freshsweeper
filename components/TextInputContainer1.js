import React from 'react';
import Text from './Text';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import COLORS from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TextInputContainer1({children,label, iconName}) {
  return (
    <View style={styles.input_container}>
        <View style={styles.input_container_inner}>
            <View style={{width:"100%"}}>
                {children}
            </View>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    input_container:{
        borderRadius:5,
        borderWidth:1,
        padding:0,
        borderColor:'#CCC',
        marginVertical:10,
        paddingRight:10
    },
    input_container_inner:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white'
    }
})


        