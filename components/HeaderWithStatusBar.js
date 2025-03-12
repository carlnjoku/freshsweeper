import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HeaderWithStatusBar = ({ title }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {title ==="" ? <Text style={styles.headerText}></Text>
        :
        <Text style={styles.headerText}>{title}</Text>
        }
        
        
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
  },

//   header: {
//     position: 'relative', // Ensures layout elements are positioned relative to the parent
//     height: 60, // Adjust based on your header's height
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
});

export default HeaderWithStatusBar;