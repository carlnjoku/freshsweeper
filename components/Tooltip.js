import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const Tooltip = ({ text, position = 'bottom', children }) => {
  const translateX = (Dimensions.get('window').width / 2) - 100; // 100 is half the tooltip width
  
  return (
    <View style={styles.container}>
      {children}
      <View style={[styles.tooltip, position === 'top' ? { bottom: '100%', left: translateX } : { top: '100%', left: translateX }]}>
        <Text style={styles.tooltipText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
    maxWidth: 200,
    zIndex: 999,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Tooltip;
