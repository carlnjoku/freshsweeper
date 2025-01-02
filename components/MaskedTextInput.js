import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import MaskInput from 'react-native-mask-input';
import COLORS from '../constants/colors';

const MaskedTextInput = ({ label, placeholder, mask, value, onChangeText, ...props }) => {
  return (
    <PaperTextInput
      label={label}
      mode="outlined"
      placeholderTextColor={COLORS.darkGray}
      outlineColor="#CCC"
      activeOutlineColor={COLORS.primary}
      value={value}
      style={{backgroundColor:"#fff", marginBottom:5}}
      render={() => (
        <MaskInput
          value={value}
          onChangeText={onChangeText}
          mask={mask}
          style={styles.input}
          
        />
      )}
      {...props}
    />
  );
};


const styles = StyleSheet.create({
    input: {
      fontSize: 16,
      padding: 0,
      margin: 0,
      paddingTop:15,
      marginLeft:15,
    },
  });
export default MaskedTextInput