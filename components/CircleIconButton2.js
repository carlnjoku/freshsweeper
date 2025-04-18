import React from 'react';
import Text from './Text';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const CircleIconButton2 = ({ iconName, onPress, buttonSize, radiusSise, iconSize, title, title_color }) => {


  const styles = StyleSheet.create({
    container:{
        flexDirection:'column',
        alignItems:'center'
    },
    button: {
      height: buttonSize,
      width: buttonSize,
      borderRadius: radiusSise, // Half of the width and height to create a circle
      borderColor: COLORS.light_gray_1,
      borderWidth:0,
      backgroundColor: COLORS.primary_light_1, 
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:0
    },
    title_color:{
    color:title_color,
    fontSize:12
    }
});
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialCommunityIcons name={iconName} size={iconSize} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title_color}>{title}</Text>
    </View>
  );
};
// const bsize = buttonSize


export default CircleIconButton2;
