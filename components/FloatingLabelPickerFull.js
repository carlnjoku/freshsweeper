import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import COLORS from '../constants/colors';

const FloatingLabelPickerFull = ({ 
  title, 
  selectedValue, 
  onValueChange, 
  options, 
  labelKey = "label", 
  valueKey = "value" 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const isActive = isFocused || selectedValue !== '';

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      {/* Floating Label */}
      <Text
        style={[
            styles.label,
            {
              top: isActive ? -10 : 15,
              fontSize: isActive ? 12 : 16,
              color: isActive ? COLORS.gray : COLORS.gray,
            },
          ]}
      >
        {title}
      </Text>

      {/* Picker Component */}
      <Picker
        selectedValue={selectedValue}
        onValueChange={(value) => {
            onValueChange(value);
            setIsFocused(!!value);
        }}
        style={styles.picker}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        >
        {/* Placeholder Option */}
        <Picker.Item label="" value="" />

        {/* Dynamically Rendered Options */}
        {options.map((option, index) => (
            <Picker.Item
            key={index}
            label={option[labelKey]} // Display the label from the labelKey
            value={option} // Pass the entire option object as the value
            />
        ))}
    </Picker>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.light_gray,
    borderRadius:5,
    marginVertical: 10,
    
  },
  label: {
    position: 'absolute',
    left: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 5,
    zIndex: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  activeContainer: {
    borderColor: COLORS.light_gray,
  },
});

export default FloatingLabelPickerFull;