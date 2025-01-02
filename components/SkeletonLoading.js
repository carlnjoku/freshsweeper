import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

const SkeletonLoading = () => {
  return (
    <View style={styles.container}>
      {/* Placeholder content */}
      <View style={styles.placeholder}>
        
      </View>
      <View style={styles.placeholder1}>
        
      </View>
      <View style={styles.placeholder2}>
        
      </View>
      <View style={styles.placeholder3}>
        
      </View>
      <View style={styles.placeholder3}>
        
      </View>
      {/* <View style={styles.placeholder}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      <View style={styles.placeholder}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View> */}
      {/* Add more placeholder views as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 200,
    height: 20,
    marginVertical: 5,
    backgroundColor: '#f0f0f0', // Placeholder color
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder2: {
    width: 200,
    height: 20,
    marginVertical: 5,
    backgroundColor: '#f0f0f0', // Placeholder color
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder3: {
    width: 200,
    height: 20,
    marginVertical: 5,
    backgroundColor: '#f0f0f0', // Placeholder color
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder4: {
    width: 200,
    height: 20,
    marginVertical: 5,
    backgroundColor: '#f0f0f0', // Placeholder color
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder5: {
    width: 200,
    height: 20,
    marginVertical: 5,
    backgroundColor: '#f0f0f0', // Placeholder color
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SkeletonLoading;
