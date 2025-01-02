import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import COLORS from '../constants/colors';

const ChipWithBackground = ({ label, onPress, selected, backgroundColor,color }) => {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, { backgroundColor }, selected && styles.selected]}>
        <Text style={[styles.label, {color}, selected && styles.selectedLabel]}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: backgroundColor,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    margin: 4,
  },
  label: {
    fontSize: 14,
    // color: '#333',
    textTransform: 'capitalize',
    color:COLORS.primary
  },
  selected: {
    backgroundColor: '#007bff',
  },
  selectedLabel: {
    color: '#fff',
  },
});

export default ChipWithBackground;
