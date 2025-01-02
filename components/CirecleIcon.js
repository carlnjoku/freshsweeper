import React from 'react';
import Text from './Text';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const CircleIcon = ({ iconName, onPress, buttonSize, type, radiusSise, iconSize, title, title_color }) => {


  const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        alignItems:'center'
    },
    button: {
      height: buttonSize,
      width: buttonSize,
      borderRadius: radiusSise, // Half of the width and height to create a circle
      // borderColor: COLORS.primary_light,
      // borderWidth:1.5,
      backgroundColor: COLORS.white, 
      borderWidth:0.8,
      borderColor:COLORS.light_gray,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight:2,
      
    },
    title_color:{
    color:title_color,
    marginRight:10,
    fontSize:13, 
    color:COLORS.gray
    }
});
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <MaterialCommunityIcons name={iconName} size={iconSize} color={COLORS.gray} />
        </TouchableOpacity>
        <Text style={styles.title_color}>{title} {type}</Text>
    </View>
  );
};
// const bsize = buttonSize


export default CircleIcon;
