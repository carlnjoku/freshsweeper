import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import COLORS from '../constants/colors';


const FloatingLabelPicker = ({ label, selectedValue, onValueChange, title, options, labelKey = "label", valueKey = "value" }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [selectedValue, setSelectedValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isActive = isFocused || selectedValue !== '';

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <Text
        style={[
          styles.label,
          {
            top: isActive ? -10 : 15,
            fontSize: isActive ? 12 : 16,
            color: isActive ? COLORS.black : COLORS.gray,
          },
        ]}
      >
        {/* {label} */}
        {title}
      </Text>
    <Picker
        selectedValue={selectedValue}
        onValueChange={(value) => {
        onValueChange(value);
        setIsFocused(!!value);
        }}
        style={styles.picker}
    >
        <Picker.Item label="" value="" />
        {options.map((option, index) => (
        // <Picker.Item key={option.abbreviation} label={option.name} value={option.abbreviation} />
        <Picker.Item
            key={index}
            label={option[labelKey]}
            value={option[valueKey]}
        />
        ))}
    </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius:5,
    marginTop: 15,
  },
  label: {
    position: 'absolute',
    left: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 5,
  },
  picker: {
     height: 50, width: '100%' 
  },
});

export default FloatingLabelPicker;