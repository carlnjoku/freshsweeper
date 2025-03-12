import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons'; // For the close button icon

const HeaderWithStatusBarAndClose = ({ title, onClose }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Title */}
        <Text style={styles.headerText}>{title}</Text>
        
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff', // Matches the header's background
  },
  headerContainer: {
    height: 60, // Height of the header below the status bar
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Ensures layout elements are positioned relative to the parent
    flexDirection: 'row', // Allows placing the title and button in the same row
    // Shadow for both iOS and Android
    ...Platform.select({
      ios: {
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal and vertical)
        shadowOpacity: 0.8, // Shadow opacity
        shadowRadius: 4, // Shadow spread radius
      },
      android: {
        elevation: 5, // Shadow elevation for Android
      },
    }),
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Makes the title take available space
    textAlign: 'center', // Centers the title text
  },
  closeButton: {
    position: 'absolute',
    right: 10, // Positions the button to the right
    top: 18, // Aligns the button vertically in the header
  },
});

export default HeaderWithStatusBarAndClose;