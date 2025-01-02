import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomCard = ({children}) => {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', // White background
    borderRadius: 10,        // Rounded corners
    padding: 16,             // Inner padding
    margin: 10,              // Outer margin
    borderWidth: 1,          // Border thickness
    borderColor: '#f2f1f1',     // Light gray border color
    shadowColor: '#ccc',     // Shadow color
    shadowOffset: {          // Shadow offset
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,     // Shadow opacity
    shadowRadius: 4,         // Shadow blur radius
    elevation: 2,            // Elevation for Android
  },
  title: {
    fontSize: 18,            // Title font size
    fontWeight: 'bold',      // Bold font weight
    marginBottom: 8,         // Spacing below the title
  },
  content: {
    fontSize: 14,            // Content font size
    color: '#555',           // Slightly dimmed text color
  },
});

export default CustomCard;