import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const Chip = ({ label, onPress, selected,iconName,iconSize,iconColor, active }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      // style={[styles.chip, active ? styles.selected : styles.inactiveChip]}
    >
      <View style={[styles.container, active ? styles.selected : styles.inactiveChip]}>
        <Text style={[styles.label, selected && styles.selectedLabel]}> <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />  {label}  </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f6',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 5,
    height:27,
    marginHorizontal:5
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  selected: {
    backgroundColor: COLORS.primary_light_1,
  },
  selectedLabel: {
    color: '#fff',
  },

//   activeChip: {
//     backgroundColor: '#6200ee', // Set your active chip background color here
// },
inactiveChip: {
  backgroundColor: '#f5f5f5', // Set your inactive chip background color here
},
});



export default Chip;
