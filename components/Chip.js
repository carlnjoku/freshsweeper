import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Chip = ({ label, onPress, selected }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, selected && styles.selected]}>
        <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  selected: {
    backgroundColor: '#007bff',
  },
  selectedLabel: {
    color: '#fff',
  },
});

export default Chip;
