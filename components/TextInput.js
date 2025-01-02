import React from 'react';
import Text from './Text';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import COLORS from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';

export default function Input({onChangeText,onFocus,errors, handleError, label, iconName, value}) {
  
    


    return (
    <TextInput 
        mode="outlined"
        label={label}
        placeholder={label}
        placeholderTextColor={COLORS.darkGray}
        outlineColor="#CCC"
        keyboardType="numeric" // Accepts only numeric input
        value={value}
        activeOutlineColor={COLORS.primary}
        right= {<TextInput.Affix text= "ft²" />}
        left={<TextInput.Icon  icon="account" style={{marginTop:10}} fontSize="small" />}
        style={{marginBottom:10, fontSize:14, width:'80%', backgroundColor:"#fff"}}
        onChangeText={onChangeText}
        onFocus={handleError}
        error={errors}
    
    />
  )
}


const styles = StyleSheet.create({
    input_container:{
        borderRadius:8,
        borderWidth:1,
        padding:0,
        borderColor:'#CCC',
        marginVertical:10
    },
    input_container_inner:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }
})


        