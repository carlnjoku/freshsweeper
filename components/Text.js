import React from 'react';
import COLORS from '../constants/colors';
import { Text as RNText, StyleSheet } from 'react-native';


// const Text = ({ style, ...rest }) => {
//   return <RNText {...rest} style={[styles.defaultStyle, style]} />;
// };

const Text = ({ style, bold, ...rest }) => {
    const fontFamily = bold ? 'Roboto-Bold' : 'Roboto-Regular'; // Determine font variant based on prop
      return <RNText {...rest} style={[styles.defaultStyle, { fontFamily }, style]} />;
    };


const styles = StyleSheet.create({
  defaultStyle: {
    color: COLORS.default, // Set default text color
    // fontFamily: 'Roboto-bold', // Set Open Sans as the', // Set default font family
  },
});

export default Text;
