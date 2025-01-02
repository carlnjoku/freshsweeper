import React from 'react';
import Text from './Text';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import COLORS from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TextInputContainer({children,label, iconName}) {
  return (
    <View style={styles.input_container}>
        <View style={styles.input_container_inner}>
            <View style={{width:"10%"}}>
                <MaterialCommunityIcons name={iconName} size={36} color={COLORS.primary} />
            </View>
            <View style={{width:"90%"}}>
            <Text bold style={{marginLeft:15, fontSize:16}}>{label}</Text>
                {children}
            </View>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    input_container:{
        borderRadius:8,
        borderWidth:1,
        padding:5,
        borderColor:'#CCC',
        marginVertical:10
    },
    input_container_inner:{
        backgroundColor:COLORS.backgroundColor,
        flexDirection:'row',
        justifyContent:'space-between'
    }
})


        