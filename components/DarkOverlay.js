import React from 'react';
import { View, StyleSheet } from 'react-native';

const DarkOverlay = ({ opacity }) => {
  return (
    <View style={[styles.overlay, { opacity }]} />
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
});

export default DarkOverlay;
