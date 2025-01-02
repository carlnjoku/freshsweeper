import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const RoomSlider = () => {
  const [numberOfRooms, setNumberOfRooms] = useState(1); // Initial value of rooms

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Number of Rooms: {numberOfRooms}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1} // Minimum value of rooms
        maximumValue={10} // Maximum value of rooms
        step={1} // Increment value
        value={numberOfRooms} // Current value of rooms
        onValueChange={(value) => setNumberOfRooms(value)} // Update state when value changes
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  slider: {
    width: '80%',
  },
});

export default RoomSlider;

